import 'dotenv/config';
import fs from 'fs';
import * as csv from 'fast-csv'
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlByLocation, urlByBed, urlByBedMaxMin, urlTop, urlByID, urlByPages } from './urlProvider.js'

const API_URL = 'https://api.scraperapi.com';
const writeStream = fs.createWriteStream(`propertyLists.csv`, { encoding: 'utf-8' })

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

const getResponse = async (API_KEY: string, PAGE_URL: string): Promise<string> => {
    console.log('Fetching data with ScraperAPI...', API_KEY, PAGE_URL);

    const queryParams = new URLSearchParams({
        api_key: API_KEY,
        url: PAGE_URL,
        country_code: 'us'
    });

    try {
        const response = API_KEY === 'YOUR_DEFAULT_API_KEY' 
            ? await axios.get(PAGE_URL) 
            : await axios.get(`${API_URL}?${queryParams.toString()}`)

        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error
    }
}

const getSearchResultCount = async (API_KEY: string, PAGE_URL: string): Promise<number> => {
    try {
        const html = await getResponse(API_KEY, PAGE_URL)
        const $ = cheerio.load(html);
        let resultCount = 0
        $(".text-denim.xl\\:text-xs").each((_, el) => {
            const results = $(el).text();
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

const idListsScraper = async (API_KEY: string, PAGE_URL: string): Promise<string[]> => {
    const innerIDs: string[] = []
    const outerURLs: string[] = []

    try {
        const html = await getResponse(API_KEY, PAGE_URL)
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
    return JSON.parse(extractPropertyByRegex(htmlString, /"last-link":\s*(\{[^]*?\})/)).page
}

const pagePropertyScraper = async (API_KEY:string, idLists: string[]) => {
    for (const id of idLists) {
        try{
            const link_to_property = urlByID(id)
            const html = await getResponse(API_KEY, link_to_property)
            const $ = cheerio.load(html)

            const price = $('.text-denim.price').text().trim(); 
            const size = $('svg[data-icon="ruler-combined"]').parent().text().trim();
            const address = extractPropertyByRegex(html, /"display_address":"(.*?)","params":/)
            const key_features = $('.otm-ListItemOtmBullet.before\\:bg-denim')
                .map((index, element) => `${index + 1}. ${$(element).text().trim()}`)
                .get().join(', ');
            // const description = $('div[item-prop="description"]').text().trim()
            // const description = $('div[item-prop="description"]').text()
            // const description = $('div[item-prop="description"]').text().replace(/\s*\n\s*/g, ' ').trim();
            const description = $('div[item-prop="description"]').text()
                .replace(/Description/g, '')
                .replace(/Location.*$/g, '')
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

            // console.log("id: ", id, "link_to_property: ", link_to_property, "price: ", price, "size: ", size, "address: ", address, "key_features: ", key_features, "description: ", description, "agent_name: ", agent_name, "agent_address: ", agent_address, "agent_phone_numbe: ", agent_phone_number)
        } catch (error) {
            console.error(`Error processing ID ${id}: `, error)
        }
    }
}

const propertyScraper = async (API_KEY: string, PAGE_URL: string) => {
    try {
        const html = await getResponse(API_KEY, PAGE_URL)
        const lastPage = getLastPage(html)
        for(let i = 1; i <= lastPage; i++ ) {
            const idLists = await idListsScraper(API_KEY, urlByPages(PAGE_URL, i))
            await pagePropertyScraper(API_KEY, idLists)
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const bedMaxMinBasedScraper = async (API_KEY: string, location: string, bedCount: number, maxPrice: number, minPrice: number) => {
    console.log("bedMaxMinBasedScraper", API_KEY, location, bedCount, maxPrice, minPrice)
    const pageURL = urlByBed(location, bedCount)
    const resultCount = await getSearchResultCount(API_KEY, pageURL)
    if (resultCount > 1000) {
        const middlePrice = Number((maxPrice + minPrice) / 2)
        await bedMaxMinBasedScraper(API_KEY, location, bedCount, minPrice, middlePrice)
        await bedMaxMinBasedScraper(API_KEY, location, bedCount, middlePrice + 1, maxPrice)
    } else {
        propertyScraper(API_KEY, pageURL)
    }
}

const bedBasedScraper = async(API_KEY: string, location: string) => {
    // for (let bedCount = 0; bedCount < 11; bedCount++) {
    //     await bedMaxMinBasedScraper(API_KEY, location, bedCount, 0, 15000000)
    // }
    await propertyScraper(API_KEY, urlTop(location))
    console.log("FINISH", propertyList.length)

    csv.write(propertyList, { headers: true })
    .on("finish", () => {
        console.log(`CSV file has been written.`)
    }).pipe(writeStream)
}

export default bedBasedScraper