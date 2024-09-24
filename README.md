<h1 align="center">Onthemarket-Scraping</h1>
<a href="https://www.onthemarket.com">
  <div align="center">
    <br><img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/onthemarket_logo.png" width='300'/>
  </div><br>
</a>

>This project is primarily focused on extracting real estate information from OnTheMarket.com, a leading property portal in the United Kingdom. Through this initiative, we aim to gather comprehensive data on various properties listed on the platform, including residential and commercial listings, their prices, locations, specifications, and other pertinent attributes.

### Should You Consider Using OnTheMarket for Your Property Search?
OnTheMarket is a United Kingdom property portal similar to Rightmove and Zoopla. In October 2023, it was announced that the firm would be acquired by CoStar Group for £99 million. On December 12, the Washington, D.C.-based property data company reported having completed the purchase of OnTheMarket plc. 

User reviews indicate that OnTheMarket has a solid rating of [3.6 stars](https://uk.trustpilot.com/review/onthemarket.com) on Trustpilot, which is comparable to [Rightmove](https://www.rightmove.co.uk/)'s [3.6 stars](https://www.trustpilot.com/review/www.rightmove.co.uk) rating, while [Zoopla](https://www.zoopla.co.uk/) stands at a lower [2.3 stars](https://uk.trustpilot.com/review/www.zoopla.co.uk). This suggests that OnTheMarket has garnered a reasonably positive reception among its users, indicating that many have had satisfactory experiences with the platform.

Overall, using OnTheMarket is considered a good option for anyone looking to navigate the UK property market, backed by a growing company with positive user feedback. If you're searching for a home or investment property, OnTheMarket should definitely be on your list of resources to explore.

<a href="https://twitter.com/OnTheMarketCom/status/1819010455219699757">
  <div align="center">
    <img align-"center" src="https://raw.githubusercontent.com/BeautifulMoon211/Onthemarket-Scraping/refs/heads/auxiliary/onthemarket-1.jfif"/>
  </div>
</a>

## Onthemarket Single Page Scraper
> You can scrape a bunch of comprehensive information of an estate such as ID, link of property, price, key features, description, agent name, agent address and agent phone number using Requests and Cheerio.

```
const response = await axios.get(PAGE_URL);
const $ = cheerio.load(html);

const price = $('.text-denim.price').text().trim(); 
const size = getValidResult($('svg[data-icon="ruler-combined"]').parent().text().trim())
const address = extractPropertyByRegex(html, /"display_address":"(.*?)"(?:,"params":|,)/);
...
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

**Live Demo for Onthemarket Single Page Scraper is [here](https://www.loom.com/share/e6ec9b5695e240ddafec11db9595b8ad?sid=c0a8faa0-6523-432d-9021-4db9710ec32e)** 

## Onthemarket Dataset Scraper ( ULTIMATE! )
> You can get COMPLETE dataset of Ontermarket!



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




<a href="https://www.google.com/search?q=philadelphia+longitude+latitude">
  <div align="center">
    <img align-"center" src="https://global.discourse-cdn.com/cesium/original/3X/c/9/c972c590712aa63d29009b11a4577efeedaa819c.png" width='80%'/>
  </div>
</a>

It is required to use [smtplib](https://mailtrap.io/blog/python-send-email/) for Google Search.
```
NEW JERSEY, WOODLAND TOWNSHIP: 39.8537, -74.5229
ILLINOIS, OAK BROOK DU: 41.840794, -87.952377
CONNECTICUT, MERIDEN NEW: 41.53666666666666, -72.79472222222222
WASHINGTON, OMAK: 48.411, -119.5276
NEW HAMPSHIRE, FRANKLIN: 43.4442, -71.6473
...
```
**Live Demo for Coordinates Finder is [here](https://www.loom.com/share/36d816493f4a4f9db6bdef8ad27cf1a0?sid=9f49f28b-2f6b-4719-aa6f-95e96b46c5aa)** 

### Cities Selector
Based on coordinates from Yelp Scraper and Coordinates Finder, let's find cities which located in the area the company supported.

<a href="https://www.yelp.com/map/sunation-energy-ronkonkoma">
  </br><div align="center">
    <img align-"center" src="https://maps.googleapis.com/maps/api/staticmap?size=315x150&sensor=false&client=gme-yelp&language=en&scale=1&path=color%3A0x1F8EFF70%7Cweight%3A2%7Cfillcolor%3A0x1F8EFF40%7C40.727172%2C-73.814309%7C40.582027%2C-73.769150%7C40.582027%2C-73.423253%7C40.609850%2C-71.856214%7C41.290122%2C-71.856214%7C41.290122%2C-73.497061%7C40.922801%2C-73.769150%7C40.752494%2C-73.814309%7C40.727172%2C-73.814309&markers=scale%3A1%7Cicon%3Ahttps%3A%2F%2Fyelp-images.s3.amazonaws.com%2Fassets%2Fmap-markers%2Fannotation_32x43.png%7C40.790157%2C-73.130497&signature=zBbAcfjde_skqiuiSu9wE2RiNRQ=" width='315px'/>
  </div></br>
</a>

## Wordpress Detector
> If you append `/wp-admin` or `/wp-login.php` to the website's URL and it takes you to a login page, it is likely a WordPress site. Check whether the modified path is valid or not.

**Live Demo for Wordpress Detector is [here](https://www.loom.com/share/c0b84d6d56204ad28f4480365eec2076?sid=b0eb5766-c288-4a3a-87d2-22de00298adc)** 

## Social Contact Scraper
> Parse any website and find the spicific pattern for social contact information. Scrape them as much as possible.
```
Social contact information: https://www.youtube.com/@sunationenergy
                            https://www.instagram.com/sunationenergy
                            https://twitter.com/SUNation_Energy
                            https://www.linkedin.com/company/sunation-energy
                            https://www.tiktok.com/@sunationenergy
                            leads@sunation.com
                            https://www.facebook.com/SUNationEnergy
```

## Project Info
### Author 
Sweem

### Developers
 - [Sweem](https://github.com/beautifulmoon211)
 - [Johnson Takashi](https://github.com/HighAmbition211)

### Version
1.0.0

### License
This project is licensed under the MIT License - see teh [LICENSE](https://github.com/BeautifulMoon211/Onthemarket-Scraping/blob/main/LICENSE) file for details.

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