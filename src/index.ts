import locationBasedScraper from './locationBasedScraper.js'

const main = async () => {
    try {
        const location = 'london'
        const properties = await locationBasedScraper(location)
        console.log(properties)
    } catch (error) { 
        console.error('Error in main execution:', error)
    }
}

main();