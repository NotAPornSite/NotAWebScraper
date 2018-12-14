const JSSoup = require("jssoup").default,
	  request = require("request-promise"); 

class RedditScraper {

	constructor(interval){
		this.interval = interval;
		this.url = "https://en.wikipedia.org/wiki/List_of_Presidents_of_the_United_States";
	}

	start(){
		console.log("starting the scrape for reddit.");
		request(this.url).then(html => {
			var soup = new JSSoup(html);
			soup.findAll('a').forEach((link)=>{
				console.log(link.attrs["href"]);
			});
		});
	}
}

module.exports = RedditScraper;