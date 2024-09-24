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

## Onthemarket Scraper
> You can scrape a bunch of comprehensive information of companies for specific field such as company name, website link, phone number, located address, owner name, provided services and several contact informations.

- *Name:* Sunation Energy
- *Website link:* sunation.com
- *Phone number:* +1 (631) 892-7245
- *Located address:* 171 Remington Blvd Ronkonkoma, NY 11779
- *Services offered:* EV charging stations, Add solar panels, Solar rooftop panel installation, Solar system maintenance, Add to existing system, Solar system installation, Solar shingle installation, Solar system repair
- *Owner name:* Scott Maskin
- *Supported area:* [(40.727172, 73.814309), (40.582027, 73.769150), (40.582027, 73.423253), (40.609850, 71.856214), (41.290122, 71.856214), (41.290122, 73.497061), (40.922801, 73.769150), (40.752494, 73.814309), (40.727172, 73.814309)] (with coordinates from...)



| Number | Name          | Website           | Phone          | Address                    | Owner   |
|--------|---------------|-------------------|----------------|----------------------------|---------|
| 1      | Sunation Energy| sunation.com      | (631) 892-7245 | 171 Remington Blvd Ronkonkoma, NY 11779 | Scitt M.  |
| 2      | Exact Solar   | exactsolar.com    | (267) 748-0596 | 82 Walker Ln Newtown, PA 18940 | Doug E. |
| 3      | EmPower Solar | empower-solar.com | (516) 837-3459 |                            | Daid S.   |
|...|...|...|...|...|...|

**Live Demo for Yelp Scraper is [here](https://www.loom.com/share/0ae6d558f6c94ba09b64bb1edf40a805?sid=0e0683fb-e212-4823-a84f-bfb120d3ac68)** 

## Cities Selector
> You can also get cities which located in service provided area.

### Coordinates Finder
You can get coordinates of cities using Google Search.

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