export const urlByLocation = (location: string): string => {
    console.log('urlByLocation', "https://www.onthemarket.com/for-sale/property/" + location + "/?view=map-list")
    return "https://www.onthemarket.com/for-sale/property/" + location + "/?view=map-list"
}

export const urlByBed = (location: string, bedCount: number): string => {
    switch (bedCount) {
        case 0:
            return `https://www.onthemarket.com/for-sale/property/${location}/?max-bedrooms=0&view=map-list`
        case 10:
            return `https://www.onthemarket.com/for-sale/property/${location}/?min-bedrooms=10&view=map-list`
        default:
            return `https://www.onthemarket.com/for-sale/property/${location}/?max-bedrooms=${bedCount}&min-bedrooms=${bedCount}&view=map-list`
    }
}

export const urlByBedMaxMin = (location: string, bedCount:number, maxPrice: number, minPrice: number): string => {
    let url: string;
    switch (bedCount) {
        case 0:
            url = `https://www.onthemarket.com/for-sale/property/${location}/?max-bedrooms=0&min-bedrooms=0&max-price=${maxPrice}&min-price=${minPrice}&view=map-list`
        case 10:
            url = `https://www.onthemarket.com/for-sale/property/${location}/?min-bedrooms=10&max-price=${maxPrice}&min-price=${minPrice}&view=map-list`
        default:
            url = `https://www.onthemarket.com/for-sale/property/${location}/?max-bedrooms=${bedCount}&min-bedrooms=${bedCount}&max-price=${maxPrice}&min-price=${minPrice}&view=map-list`
    }
    const result =  minPrice == 0 ? url.replace('&min-price=0', '') : url
    // console.log("urlByBedMaxMin Result: ", result)
    return result
    // return minPrice == 0 ? url.replace('&min-price=0', '') : url
}

export const urlTop = (location: string): string => {
    return `https://www.onthemarket.com/for-sale/property/${location}/?min-price=15000001&view=map-list`
}

export const urlByID = (id: string): string => {
    return `https://www.onthemarket.com/details/${id}`
}

export const urlByPages = (originURL: string, id: number) => {
    return originURL + `&page=${id}`
}