import {getResponse, getSearchResultCount, onthemarketPropertyScraper} from './onthemarketPropertyScraper.js'
import { urlByLocation, urlByMaxMin, urlsByBed } from './urlProvider.js'

const API_KEY = process.env.API_KEY ?? 'YOUR_DEFAULT_API_KEY' // <--- Enter your API key here

const priceRange = [10000, 20000, 30000, 40000, 50000, 60000, 70000, 80000, 90000, 100000, 110000, 120000, 130000, 140000, 150000, 160000, 170000, 180000, 190000, 200000, 210000, 220000, 230000, 240000, 250000, 275000, 300000, 325000, 350000, 375000, 400000, 425000, 450000, 475000, 500000, 550000, 600000, 650000, 700000, 750000, 800000, 850000, 900000, 950000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 2400000, 2500000, 2750000, 3000000, 3250000, 3500000, 3750000, 4000000, 4250000, 4500000, 4750000, 5000000, 5500000, 6000000, 6500000, 7000000, 7500000, 8000000, 8500000, 9000000, 9500000, 10000000, 12500000, 15000000]

interface PercentageData {
    from: number,
    percent: number
}

const getPricePercentages = (htmlString: string): PercentageData[] => {
    const regex = /"price-ranges":\s*(\[[^]*?\])/;
    const match = htmlString.match(regex);
    if (match) {
        const jsonStr = match[1];
        return JSON.parse(jsonStr);
    }
    return []
}

const getPeakPrice = (data: PercentageData[]) : number => {
    const result = data.find(item => item.percent === 100)
    if (!result) {
        throw new Error("No item with percent 100 found");
    }
    return result?.from
}

// const getPeakPriceCount = async (peakPrice: number) : Promise<number> => {
//     let peakPriceCount = 0
//     urlsByBed(peakPrice).map(async (pageUrlByBed) => {
//         const priceByBed = await getSearchResultCount(API_KEY, pageUrlByBed)
//         console.log(pageUrlByBed, priceByBed, "priceByBed: ", priceByBed)
//         peakPriceCount += priceByBed
//     })
//     return peakPriceCount
// }
const getPeakPriceCount = async (peakPrice: number): Promise<number> => {  
    const results = await Promise.all(urlsByBed(peakPrice).map(async (pageUrlByBed) => {  
        const priceByBed = await getSearchResultCount(API_KEY, pageUrlByBed);  
        console.log(pageUrlByBed, "priceByBed: ", priceByBed);
        return priceByBed;
    }));  

    const peakPriceCount = results.reduce((total, count) => total + count, 0);  
    return peakPriceCount;  
}  

const getCountByPercentage = (pricePercentage: number, peakPriceCount: number) : number => {
    return Number((pricePercentage + 1) * peakPriceCount / 100)
}

const locationBasedScraper = async (location: string) => {
    console.log("onthemarketPropertyScraper - API_KEY : ", API_KEY);

    const html = await getResponse(API_KEY, urlByLocation(location));
    const pricePercentages = getPricePercentages(html);
    console.log("pricePercentages: ", pricePercentages)
    const peakPrice = getPeakPrice(pricePercentages);
    console.log("peakPrice: ", peakPrice)
    const peakPriceCount = await getPeakPriceCount(peakPrice);
    console.log("peakPriceCount: ", peakPriceCount)

    let priceIndex = 0
    let startIndex = 0
    let totalCounted = 0

    const reset = () => {
        totalCounted = 0
        startIndex = priceIndex
    }

    while(priceIndex < 81) {
        const indexCount = getCountByPercentage(pricePercentages[priceIndex].percent, peakPriceCount)
        console.log("priceIndex: ", priceIndex, pricePercentages[priceIndex].from, pricePercentages[priceIndex].percent, "startIndex: ", startIndex, "totalCounted: ", totalCounted, "indexCount: ", indexCount)
        if (totalCounted < 1000) {
            if (indexCount < 1000) {
                totalCounted += indexCount
            } else {
                await onthemarketPropertyScraper(API_KEY, urlByMaxMin(priceRange[priceIndex], priceRange[startIndex]))

                urlsByBed(priceRange[priceIndex]).map(async (pageUrlByBed) => {
                    await onthemarketPropertyScraper(API_KEY, pageUrlByBed)
                })
                reset()
            }
            priceIndex += 1
        } else {
            await onthemarketPropertyScraper(API_KEY, urlByMaxMin(priceRange[priceIndex - 1], priceRange[startIndex]))
            reset()
            priceIndex -= 1
        }
    }
}

export default locationBasedScraper