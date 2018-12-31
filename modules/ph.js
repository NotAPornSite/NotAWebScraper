const JSSoup = require("jssoup").default,
	  request = require("request-promise"); 

//get all of the categories from the ph category page. scan the categories 
//and collect the post links. then use /embed/posthash to get the proper iframe url.

class PhScraper {

	constructor(interval){
		this.interval = interval;
		this.url = "https://www.pornhub.com";
		this.categories = []; 
	}

	start() {
		console.log("starting the scrape for ph.");
		this.getCategories();
	}

	getCategories() {
		request(this.url+"/categories").then(html => {
			var soup = new JSSoup(html);
			soup.findAll('a').forEach((link)=>{
				console.log(link.attrs["href"]);
			});
		});
	}
}

module.exports = PhScraper;