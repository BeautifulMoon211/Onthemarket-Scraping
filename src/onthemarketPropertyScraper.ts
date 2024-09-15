import 'dotenv/config';
import axios from 'axios';
import * as cheerio from 'cheerio';

const API_URL = 'https://api.scraperapi.com';

interface Property {
    price: string;
    address: string;
    beds: string;
    bath: string; 
    space: string;
    link: string | null;
    contact: string;
}

export const getResponse = async (API_KEY: string, PAGE_URL: string): Promise<string> => {
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

export const getSearchResultCount = async (API_KEY: string, PAGE_URL: string): Promise<number> => {
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

export const onthemarketPropertyScraper = async (API_KEY: string, PAGE_URL: string): Promise<Property[]> => {
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
};