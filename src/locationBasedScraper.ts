import onthemarketPropertyScraper from './onthemarketPropertyScraper.js'

const API_KEY = process.env.API_KEY ?? 'YOUR_DEFAULT_API_KEY'

const locationBasedScraper = async (location: string) => {
    await onthemarketPropertyScraper(location)
}

export default locationBasedScraper