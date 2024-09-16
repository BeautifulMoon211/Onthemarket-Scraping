import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { urlByLocation, urlByBed, urlByBedMaxMin, urlTop } from './urlProvider.js'

const API_URL = 'https://api.scraperapi.com';
const priceRange = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000, 240000, 250000, 275000, 300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2750000, 3000000, 3250000, 3500000, 3750000, 4000000, 4250000, 4500000, 4750000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000, 12500000, 15000000]

interface Property {
    price: string;
    address: string;
    beds: string;
    bath: string; 
    space: string;
    link: string | null;
    contact: string;
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

const propertyScraper = async (API_KEY: string, PAGE_URL: string): Promise<Property[]> => {
    try {
        const html = await getResponse(API_KEY, PAGE_URL)
        const $ = cheerio.load(html);
        const propertyList: Property[] = [];
        console.log('onthemarketPropertyScraper', PAGE_URL)
        // console.log('Extracting information from the HTML...', html);

        // $(".HomeCardContainer").each((_, el) => {  
        //     const price = $(el).find('.bp-Homecard__Price--value.span').length > 0 ?   
        //         $(el).find('.bp-Homecard__Price--value.span').text() :   
        //         $(el).find('.bp-Homecard__Price--value').text();  
        //     const beds = $(el).find('.bp-Homecard__Stats--beds.text-nowrap').text();  
        //     const bath = $(el).find('.bp-Homecard__Stats--baths.text-nowrap').text();  
        //     const space = $(el).find('.bp-Homecard__LockedStat--value').text();  
        //     const address = $(el).find('.bp-Homecard__Address--address').length > 0 ?   
        //         $(el).find('.bp-Homecard__Address--address').text() :   
        //         $(el).find('.bp-Homecard__Address').text();  
        //     const link = $(el).find('.link-and-anchor.visuallyHidden').attr('href');  
        //     const linkText = $(el).find('.link-and-anchor.visuallyHidden').text();  
        //     const contact = $(el).find('.RentalCTAContact__button--phone .ButtonLabel').text();  
            
        //     if (!price) {  
        //         return;  
        //     }  

        //     propertyList.push({  
        //         price,  
        //         address: address || linkText,  
        //         beds,  
        //         bath,  
        //         space,  
        //         link: link ? `https://www.redfin.com${link}` : null,  
        //         contact  
        //     });  
        // });  
        // console.log('JSON result:', propertyList);  
        return propertyList
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