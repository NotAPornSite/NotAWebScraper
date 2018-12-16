const JSSoup = require("jssoup").default,
	  request = require("request-promise"),
	  fs = require("fs"); 

class RedditScraper {

	constructor(interval){
		this.interval = interval;
		this.subreddits = [];
		this.images = [];
		this.testPage = "<html><head></head><body>";
	}

	loadSubReddits(){
		this.subreddits = JSON.parse(fs.readFileSync("./data/subreddits.json"));
	}

	save(){
		fs.writeFile('./data/images.json', JSON.stringify(this.images));
		fs.writeFile('./data/testPage.html', this.testPage);
	}

	start(){
		console.log("starting the scrape for reddit.");
		let promises = [];
		this.loadSubReddits();
		this.subreddits.forEach(link =>{ //loop through each subreddit
			let options = {
				uri: link,
				headers: {
					'Cookie': 'over18=1'
				}    
			};
			let promise = new Promise((res,rej)=>{
				request(options).then(html=>{ //request the page
	
					let soup = new JSSoup(html),
						imgs = soup.findAll("img");
			
					imgs.forEach((img)=>{
						if(!this.images.includes(img.attrs["src"])){
							this.images.push(img.attrs["src"]);
						}
		
						this.testPage += "<img src='"+img.attrs["src"]+"'/>";
					});
					this.save();
					res();
				}).catch(err=>{
					this.save();
					rej(err);
				});
			});
			promises.push(promise);
		});
		return Promise.all(promises);
	}
}

module.exports = RedditScraper;