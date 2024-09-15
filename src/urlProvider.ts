export const urlByLocation = (location: string) : string => {
    console.log('urlByLocation', "https://www.onthemarket.com/for-sale/property/" + location + "/?view=map-list")
    return "https://www.onthemarket.com/for-sale/property/" + location + "/?view=map-list"
}

export const urlsByBed = (price: number): string[] => {
    return [`https://www.onthemarket.com/for-sale/property/london/?max-bedrooms=1&max-price=${price}&min-price=${price}&view=map-list`, 
        `https://www.onthemarket.com/for-sale/property/london/?max-price=${price}&min-bedrooms=3&min-price=${price}&view=map-list`, 
        `https://www.onthemarket.com/for-sale/2-bed-property/london/?max-price=${price}&min-price=${price}&view=map-list`
    ]
}

export const urlByMaxMin = (max: number, min: number): string => {
    console.log('urlByMaxMin', `https://www.onthemarket.com/for-sale/property/london/?max-price=${max}&min-price=${min}&view=map-list`)
    return `https://www.onthemarket.com/for-sale/property/london/?max-price=${max}&min-price=${min}&view=map-list`
}