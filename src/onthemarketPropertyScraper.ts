import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlByLocation, urlByBed, urlByBedMaxMin, urlTop, urlByID, urlByPages } from './urlProvider.js'

const API_URL = 'https://api.scraperapi.com';
const priceRange = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000, 240000, 250000, 275000, 300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2750000, 3000000, 3250000, 3500000, 3750000, 4000000, 4250000, 4500000, 4750000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000, 12500000, 15000000]

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

const getResponse = async (API_KEY: string, PAGE_URL: string): Promise<string> => {
    console.log('Fetching data with ScraperAPI...');
    
    const queryParams = new URLSearchParams({
        api_key: API_KEY,
        url: PAGE_URL,
        country_code: 'us'
    });

    const response = await axios.get(`${API_URL}?${queryParams.toString()}`);
    const html = response.data;
    return html
}

const getSearchResultCount = async (API_KEY: string, PAGE_URL: string): Promise<[number, string]> => {
    try {
        const html = await getResponse(API_KEY, PAGE_URL)
        const $ = cheerio.load(html);
        let resultCount = 0
        $(".text-denim.xl\\:text-xs").each((_, el) => {  
            const results = $(el).text();  
            resultCount = parseInt(results.split(" ")[0], 10);  
        });

        return [resultCount, html]
    } catch(error) {
        console.error('Error fetching data:', error);
        return [-1, ""]
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
        liLists.map((li) => {
            const idAttr = $(li).attr('id')

            if (idAttr && idAttr.startsWith('result-')) {
                innerIDs.push(extractPropertyByRegex(idAttr, /result-(\d+)/))
                // const idMatch = idAttr.match(/result-(\d+)/);
                // if (idMatch) {
                //     const id = idMatch[1]
                //     innerIDs.push(id)
                // }
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
    // const regex = /"last-link":\s*(\{[^]*?\})/;
    // const match = htmlString.match(regex);
    // if (match) {
    //     const jsonStr = match[1];
    //     return JSON.parse(jsonStr).page;
    // }
    // return -1
}

const pagePropertyScraper = async (API_KEY:string, idLists: string[]): Promise<Property[]> => {
    const propertyList: Property[] = [];

    for (const id of idLists) {
    // idLists.map(async (id) => {
        try{
            const link_to_property = urlByID(id)
            const html = await getResponse(API_KEY, urlByID(id))
            const $ = cheerio.load(html)

            const price = $('.text-denim.price').text().trim(); 
            const size = $('svg[data-icon="ruler-combined"]').parent().text().trim();
            const address = extractPropertyByRegex(html, /"display_address":"(.*?)","params":/)

            let key_features = ''
            $('.text-md.space-y-1.5.mt-6.font-heading').children('div').map((divElement) => {
                const spans = $(divElement).find('span');
                if (spans.length === 2) {
                    const key_feature = spans.first().text().trim() + spans.last().text().trim(); 
                    key_features += key_features == '' ? key_feature : (', ' + key_feature)
                }
            })

            const description = $('div[item-prop="description"]').contents().filter((i, el) => el.type === 'text').text().trim()
            const agent_name = $('h2.text-base2.font-body').text().trim();
            const agent_address = $('p.text-sm.text-slate').text().trim();
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

            console.log("id: ", id, "link_to_property: ", link_to_property, "price: ", price, "size: ", size, "address: ", address, "key_features: ", key_features, "description: ", description, "agent_name: ", agent_name, "agent_address: ", agent_address, "agent_phone_numbe: ", agent_phone_number)
        } catch (error) {
            console.error(`Error processing ID ${id}: `, error)
        }
    }
    return propertyList
}

const propertyScraper = async (API_KEY: string, id: string) => {
    try {
        const PAGE_URL = urlByID(id)
        const html = await getResponse(API_KEY, PAGE_URL)
        const $ = cheerio.load(html);
        const propertyList: Property[] = [];

        const lastPage = getLastPage(html)
        for(let i = 1; i <= lastPage; i++ ) {
            const idLists = await idListsScraper(API_KEY, urlByPages(PAGE_URL, i))
            pagePropertyScraper(API_KEY, idLists)
        }
        
    } catch (error) {
        console.error('Error fetching data:', error);
        return []
    }
}

const bedMaxMinBasedScraper = async (API_KEY: string, location: string, bedCount: number, maxPrice: number, minPrice: number) => {
    const pageURL = urlByBed(location, bedCount)
    const [resultCount, html] = await getSearchResultCount(API_KEY, pageURL)
    if (resultCount > 1000) {
        const middlePrice = Number((maxPrice + minPrice) / 2)
        await bedMaxMinBasedScraper(API_KEY, location, bedCount, minPrice, middlePrice)
        await bedMaxMinBasedScraper(API_KEY, location, bedCount, middlePrice + 1, maxPrice)
    } else {
        propertyScraper(API_KEY, pageURL)
    }
}

const bedBasedScraper = async(API_KEY: string, location: string) => {
    for (let bedCount = 0; bedCount < 11; bedCount++) {
        bedMaxMinBasedScraper(API_KEY, location, bedCount, 0, priceRange[-1])
    }
    propertyScraper(API_KEY, urlTop(location))
}

export default bedBasedScraper