import locationBasedScraper from './locationBasedScraper.js'

const main = async () => {
    try {
        const location = 'london'
        await locationBasedScraper(location)
    } catch (error) { 
        console.error('Error in main execution:', error)
    }
}

main();