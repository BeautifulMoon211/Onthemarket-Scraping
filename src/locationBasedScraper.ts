import onthemarketPropertyScraper from './onthemarketPropertyScraper.js'

const API_KEY = process.env.API_KEY ?? 'YOUR_DEFAULT_API_KEY'

const locationBasedScraper = async (location: string) => {
    // console.log("onthemarketPropertyScraper - API_KEY : ", API_KEY);
    await onthemarketPropertyScraper(API_KEY, location)
}

export default locationBasedScraper