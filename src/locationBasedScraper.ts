import onthemarketPropertyScraper from './onthemarketPropertyScraper.js'

const API_KEY = process.env.API_KEY ?? 'YOUR_DEFAULT_API_KEY' // <--- Enter your API key here

const locationBasedScraper = async (location: string) => {
    const OTM_PAGE_URL = "https://www.onthemarket.com/for-sale/property/" + location + "/?view=map-list"
    console.log("onthemarketPropertyScraper - API_KEY : ", API_KEY)
    const properties = await onthemarketPropertyScraper(API_KEY, OTM_PAGE_URL)
    return properties
}

export default locationBasedScraper