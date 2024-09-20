import 'dotenv/config';
import fs from 'fs';
import * as csv from 'fast-csv'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlByBedMaxMin, urlTop, urlByID, urlByPages } from './urlProvider.js'

let writeStream;

interface Property {
    id: string;
    link_to_property: string;
    price: string;
    size: string;
    address: string;
    key_features: string;
    description: string;
    agent_name: string;
    agent_address: string;
    agent_phone_number: string;
}
const propertyList: Property[] = [];

const getResponse = async (PAGE_URL: string): Promise<string> => {
    try {
        const response = await axios.get(PAGE_URL)
        if (!response.data) {  
            throw new Error('No data received from API');  
        }  
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error
    }
}

const getSearchResultCount = async (PAGE_URL: string): Promise<number> => {
    try {
        const html = await getResponse(PAGE_URL)
        const $ = cheerio.load(html);
        let resultCount = 0
        $(".text-denim.xl\\:text-xs").each((_, el) => {
            const results = $(el).text()
                .replace('+', '')
                .replace(',', '');
            resultCount = parseInt(results.split(" ")[0], 10);
        });

        return resultCount
    } catch(error) {
        console.error('Error fetching data:', error);
        return -1
    }
}

function extractPropertyByRegex(url: string, regex: RegExp): string {
    const match = url.match(regex);
    return match ? match[1] : ""
}

const idListsScraper = async (PAGE_URL: string): Promise<string[]> => {
    const innerIDs: string[] = []
    const outerURLs: string[] = []

    try {
        const html = await getResponse(PAGE_URL)
        const $ = cheerio.load(html);
        const liLists = $('li.w-full.relative');
        liLists.each((_, li) => {
            const idAttr = $(li).attr('id')

            if (idAttr && idAttr.startsWith('result-')) {
                innerIDs.push(extractPropertyByRegex(idAttr, /result-(\d+)/))
            } else {
                const outerURL = $(li).find('.font-semibold a').attr('href')
                if (outerURL)
                    outerURLs.push(outerURL);
            }
        })
        return innerIDs
    } catch (error) {
        console.error('Error fetching data:', error);
        return []
    }
}

const getLastPage = (htmlString: string): number => {
    const lastPageResponse = extractPropertyByRegex(htmlString, /"last-link":\s*(\{[^]*?\})/)
    if (lastPageResponse)
        return JSON.parse(lastPageResponse).page
    else
        return 1
}

const pagePropertyScraper = async (idLists: string[]) => {
    for (const id of idLists) {
        try{
            const link_to_property = urlByID(id)
            const html = await getResponse(link_to_property)
            const $ = cheerio.load(html)

            const price = $('.text-denim.price').text().trim(); 
            const size = getValidResult($('svg[data-icon="ruler-combined"]').parent().text().trim())
            const address = extractPropertyByRegex(html, /"display_address":"(.*?)"(?:,"params":|,)/);
            
            let key_features: string = ''
            key_features = $('.otm-ListItemOtmBullet.before\\:bg-denim')
                .map((index, element) => `${index + 1}. ${$(element).text().trim()}`)
                .get().join(', ');
            if (key_features == '' || key_features.indexOf('2.') == -1) { // if `Property description & features` have no features or only one feature.
                $('div[class="text-md space-y-1.5 mt-6 font-heading"]').children('div').each((index, divElement) => {
                    const spans = $(divElement).find('span');
                    const atag = $(divElement).find('a');
                    if (spans.length === 2) {
                        const key_feature = `${index + 1}. ${spans.first().text().trim()}${spans.last().text().trim()}`;
                        key_features += key_features == '' ? key_feature : (', ' + key_feature)
                    } else if (spans.length === 1 && atag.length === 1) {
                        const key_feature = `${index + 1}. ${spans.text().trim()}${atag.text().trim()}`;
                        key_features += key_features == '' ? key_feature : (', ' + key_feature)
                    }
            })}
            key_features = getValidResult(key_features)

            const description = $('div[item-prop="description"]').text()
                .replace(/Description/g, ' ')
                .replace(/Location/g, ' ')
                .replace(/\s{2,}/g, ' ')
                .replace(/\s*\n\s*/g, ' ')
                .trim();
            const agent_name = $('h2.text-base2.font-body').text().trim();
            const agent_address = $('p.text-sm.text-slate').text().trim().replace(/\n/g, ' ');
            const agent_phone_number = $('.otm-Telephone.cursor-pointer ').text().trim();

            propertyList.push({
                id: id,
                link_to_property: link_to_property,
                price: price,
                size: size,
                address: address,
                key_features: key_features,
                description: description,
                agent_name: agent_name,
                agent_address: agent_address,
                agent_phone_number: agent_phone_number
            })
        } catch (error) {
            console.error(`Error processing ID ${id}: `, error)
        }
    }
}

const getValidResult = (result: string): string => {
    return result === '' ? 'Ask agent' : result
}

const propertyScraper = async (PAGE_URL: string) => {
    try {
        const html = await getResponse(PAGE_URL)
        const lastPage = getLastPage(html)
        for(let i = 1; i <= lastPage; i++ ) {
            const idLists = await idListsScraper(urlByPages(PAGE_URL, i))
            await pagePropertyScraper(idLists)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const bedMaxMinBasedScraper = async (location: string, bedCount: number, maxPrice: number, minPrice: number) => {
    const pageURL = urlByBedMaxMin(location, bedCount, maxPrice, minPrice)
    const resultCount = await getSearchResultCount(pageURL)
    if (resultCount >= 1000) {
        const middlePrice = Number((maxPrice + minPrice) / 2)
        await bedMaxMinBasedScraper(location, bedCount, middlePrice, minPrice)
        await bedMaxMinBasedScraper(location, bedCount, maxPrice, middlePrice + 1)
    } else {
        await propertyScraper(pageURL)
    }
}

const csvWriter = (location: string) => {
    writeStream = fs.createWriteStream(`${location}.csv`, { encoding: 'utf-8' })
    csv.write(propertyList, { headers: true }).pipe(writeStream)
}

const bedBasedScraper = async(location: string) => {
    for (let bedCount = 0; bedCount < 11; bedCount++) {
        await bedMaxMinBasedScraper(location, bedCount, 15000000, 0)
    }
    await propertyScraper(urlTop(location))

    csvWriter(location)
}

export default bedBasedScraper