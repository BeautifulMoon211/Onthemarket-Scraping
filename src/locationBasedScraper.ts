import onthemarketPropertyScraper from './onthemarketPropertyScraper.js'

const locationBasedScraper = async (location: string) => {
    await onthemarketPropertyScraper(location)
}

export default locationBasedScraper