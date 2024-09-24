<h1 align="center">Onthemarket-Scraping</h1>
<a href="https://www.onthemarket.com">
  <div align="center">
    <br><img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/onthemarket_logo.png" width='300'/>
  </div><br>
</a>

>This project is primarily focused on extracting real estate information from OnTheMarket.com, a leading property portal in the United Kingdom. Through this initiative, we aim to gather comprehensive data on various properties listed on the platform, including residential and commercial listings, their prices, locations, specifications, and other pertinent attributes.

### Should You Consider Using OnTheMarket for Your Property Search?
[OnTheMarket](https://www.onthemarket.com) is a United Kingdom property portal similar to Rightmove and Zoopla. In October 2023, it was announced that the firm would be acquired by CoStar Group for £99 million. On December 12, the Washington, D.C.-based property data company reported having completed the purchase of OnTheMarket plc. 

User reviews indicate that OnTheMarket has a solid rating of [3.6 stars](https://uk.trustpilot.com/review/onthemarket.com) on Trustpilot, which is comparable to [Rightmove](https://www.rightmove.co.uk/)'s [3.6 stars](https://www.trustpilot.com/review/www.rightmove.co.uk) rating, while [Zoopla](https://www.zoopla.co.uk/) stands at a lower [2.3 stars](https://uk.trustpilot.com/review/www.zoopla.co.uk). This suggests that OnTheMarket has garnered a reasonably positive reception among its users, indicating that many have had satisfactory experiences with the platform.

Overall, using OnTheMarket is considered a good option for anyone looking to navigate the UK property market, backed by a growing company with positive user feedback. If you're searching for a home or investment property, OnTheMarket should definitely be on your list of resources to explore.

<a href="https://twitter.com/OnTheMarketCom/status/1819010455219699757">
  <div align="center">
    <img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/onthemarket-1.jfif" width='80%'/>
  </div>
</a>

## Onthemarket Dataset Scraper ( ULTIMATE! )
> You can get COMPLETE dataset of Ontermarket!

To retrieve comprehensive information about all estates, we first need to gather all available IDs. However, Onthemarket limits visible results to fewer than 1,000 per page, which prevents us from scraping pages that exceed this limit. 

To navigate this, we will segment our search based on the number of bedrooms and systematically adjust the price range. This process will continue until we generate a URL that yields fewer than 1,000 IDs. Once we have the necessary IDs, we can utilize the previously established Single Page Scraper to extract all relevant information efficiently.

### Spliting Price Range
> Use binary search!

If URL yields more than 1,000 IDs, split the price as a half size until we find the one which contains less than 1,000 IDs.

<a href="https://www.onthemarket.com/for-sale/property/london/?view=map-list">
  <div align="center">
    <img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/ultimate.png"  width='70%'/>
  </div>
</a><br>

```
const bedMaxMinBasedScraper = async (location: string, bedCount: number, maxPrice: number, minPrice: number) => {
    const pageURL = urlByBedMaxMin(location, bedCount, maxPrice, minPrice)
    const resultCount = await getSearchResultCount(pageURL)
    if (resultCount >= 1000) {
        const middlePrice = Number((maxPrice + minPrice) / 2)
        await bedMaxMinBasedScraper(location, bedCount, middlePrice, minPrice)
        await bedMaxMinBasedScraper(location, bedCount, maxPrice, middlePrice + 1)
    } else {
        await propertyScraper(pageURL)
    }
}
```
If the number of IDs is less than 1,000, get all IDs from the URL.

### ID Scraper
> Use Cheerio! - The fast, flexible & elegant library for parsing and manipulating HTML and XML.

One page only show 30 estates, so there must be several pages per URL. Extract IDs while switching pages.

<a href="https://www.onthemarket.com/for-sale/property/london/?max-bedrooms=0&max-price=234375&view=map-list">
  <div align="center">
    <img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/limitedResult.png"  width='70%'/>
  </div>
</a>

```
const propertyScraper = async (PAGE_URL: string) => {
    const html = await getResponse(PAGE_URL)
    const lastPage = getLastPage(html)

    for(let i = 1; i <= lastPage; i++ ) {
        const idLists = await idListsScraper(urlByPages(PAGE_URL, i))
        await pagePropertyScraper(idLists)
    }
}
```
Wow! We scrape all IDs of Onthemarket. What's the next? Scrape all information based on IDs - that's it.

### Single Page Scraper
> Now Final one.

You can scrape a bunch of comprehensive information of an estate such as ID, link of property, price, key features, description, agent name, agent address and agent phone number based on ID.

<a href="https://www.onthemarket.com/details/15573423">
  <div align="center">
    <img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/single-page.png"  width='70%'/>
  </div>
</a>

```
const pagePropertyScraper = async (idLists: string[]) => {
    for (const id of idLists) {
        const link_to_property = urlByID(id)
        const html = await getResponse(link_to_property)
        const $ = cheerio.load(html)

        const price = $('.text-denim.price').text().trim(); 
        const size = getValidResult($('svg[data-icon="ruler-combined"]').parent().text().trim())
        const address = extractPropertyByRegex(html, /"display_address":"(.*?)"(?:,"params":|,)/);
        ...        
        const agent_phone_number = $('.otm-Telephone.cursor-pointer ').text().trim();
    }
}
```

- *ID:* 15573423
- *Link to Property:* https://www.onthemarket.com/details/15573423
- *Price:* £215,000
- *Address:* Brewery Close, Wembley
- *Key Features:* 1. Large Studio Flat, 2. First Floor, 3. Long Lease, 4. Close to Station and Railway, 5. Communal Garden, 6. Allocated Car Park, 7. Council Tax Band B, 8. EPC Rating C
- *Description:* PURPOSE BUILT STUDIO FLAT - LONG LEASE - PARKING. Brian Cox are pleased to present this well presented one bedroom flat situated on the third floor. The property comprises of a lounge, kitchen, bedroom and bathroom. The property benefits from double glazing, gas central heating, long lease, residents parking and communal grounds. The property is situated close to shopping facilities, sought after schools and transportation links.
- *Agent Name:* Brian Cox Estate Agents - North Greenford
- *Agent Address:* 374 Oldfield Lane North Greenford, Middlesex UB6 8PU
- *Agent Phone number:* +44 020 3641 4791

**Live Demo for Single Page Scraper is [here](https://www.loom.com/share/e6ec9b5695e240ddafec11db9595b8ad?sid=c0a8faa0-6523-432d-9021-4db9710ec32e)** 


### Result

| ID | Link to Property | Price | Size | Address | Key Features |  
|-|-|-|-|-|-|  
| 15829962  | [View Property](https://www.onthemarket.com/details/15829962) | £160,000  | 365 sq ft / 34 sq m  | 480 Bath Road, UB7          | 1. Tenure: Leasehold (900 years remaining), 2. Council tax: Ask agent, 3. Broadband: Basic 8Mbps *, 4. Water: Ask agent, 5. Heating: Ask agent, 6. Electricity: Ask agent, 7. Sewerage: Ask agent |  
| 15573423  | [View Property](https://www.onthemarket.com/details/15573423) | £215,000  | 376 sq ft / 35 sq m  | Brewery Close, Wembley       | 1. Large Studio Flat, 2. First Floor, 3. Long Lease, 4. Close to Station and Railway, 5. Communal Garden, 6. Allocated Car Park, 7. Council Tax Band B, 8. EPC Rating C |  
| 15823383  | [View Property](https://www.onthemarket.com/details/15823383) | £170,000  | 301 sq ft / 28 sq m  | Adams Way, Croydon          | 1. Tenure: Leasehold, 2. No Onward Chain, 3. Large Purpose Built Studio, 4. Well Presented Throughout, 5. Allocated Parking, 6. Communal Garden, 7. Walking Distance to Tram Stop and Bus Stop |
| ... | ... | ... | ... | ... | ... |

| Description | Agent Name | Agent Address | Agent Phone Number |  
|-|-|-|-|  
| Alexandra Park is pleased to offer this studio flat with Heathrow Airport nearby. The property comprises: studio room, kitchen, bathroom, entryphone system, electric heating, parking space & a large communal garden. Property additional info: entrance: entryphone system communal door to: flat entrance: hardwood door to: hallway: entryphone system, tiled flooring, ... | Alexandra Park Estates - South Harrow | 500 Northolt Road South Harrow, Middlesex HA2 8HA | 020 8115 0985 |  
| PURPOSE BUILT STUDIO FLAT - LONG LEASE - PARKING. Brian Cox are pleased to present this well presented one bedroom flat situated on the third floor. The property comprises of a lounge, kitchen, bedroom, and bathroom. The property benefits from double glazing, gas central heating, long lease, residents parking and communal grounds. The property is situated close to shopping facilities, sought after schools and transportation links.                                                                                                                                               | Brian Cox Estate Agents - North Greenford | 374 Oldfield Lane North Greenford, Middlesex UB6 8PU | 020 3641 4791      |  
| Haart Croydon are pleased to market this chain free large studio apartment within a popular development a short distance of transport links and amenities. Situated on the ground floor of a purpose-built block, is this large studio available to view now. The studio benefits from a semi-open plan fitted kitchen with built in electric hob and oven. ... | Haart Estate Agents - Croydon | 121 South End Croydon CR0 1BJ  | 020 8022 6763      |
| ... | ... | ... | ... |

**Live Demo for Onthemarket Scraper is [here](https://www.loom.com/share/268eb7ed85c04d028b40cb7f1a6c58c3?sid=c50abbd4-abc2-4e3f-968f-e994045a713a), or you can check the total search result for London in [GitHub latest release](https://github.com/BeautifulMoon211/Onthemarket-Scraping/releases/tag/v1.1).** 


## Project Info
### Author 
Sweem

### Developers
 - [Sweem](https://github.com/beautifulmoon211)
 - [Johnson Takashi](https://github.com/HighAmbition211)

### Version
1.1.0

### License
This project is licensed under the MIT License - see the [LICENSE](https://github.com/BeautifulMoon211/Onthemarket-Scraping/blob/main/LICENSE) file for details.

<h3>
    If you found this project useful or interesting, please consider giving it a 
    <a href="https://github.com/BeautifulMoon211/Onthemarket-Scraping">
        <img src="https://raw.githubusercontent.com/HighAmbition211/HighAmbition211/refs/heads/auxiliary/others/star.gif" style="width:25px"> 
        Star
    </a>, or 
    <a href="https://github.com/BeautifulMoon211/">
        Following
    </a> 
    me.
    If you'd like to use this template, feel free to 
    <a href="https://github.com/BeautifulMoon211/Onthemarket/fork">
        Fork
    </a> 
    it and customize it to your needs!
</h3>

###  Thank you for the help with [Johnson Takashi](https://github.com/HighAmbition211).