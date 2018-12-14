const $ = require("cheerio"),
	  request = require("request-promise"); 

class PhScraper {

	constructor(interval){
		this.interval = interval;
		this.url = "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States";
	}

	start(){
		console.log("starting the scrape for ph.");
		request(this.url).then(function(html){
			//success!
			const wikiUrls = [];
			for (let i = 0; i < 45; i++) {
			  wikiUrls.push($('big > a', html)[i].attribs.href);
			}
			console.log(wikiUrls);
		  });
	}
}

module.exports = PhScraper;