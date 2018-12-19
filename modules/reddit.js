const JSSoup = require("jssoup").default,
	  request = require("request-promise"),
	  fs = require("fs"),
	  mysql = require('mysql'); 

class RedditScraper {

	constructor(interval){
		this.interval = interval;
		this.subreddits = [];
		this.images = {}; //images in their categories
		this.allImages = []; //all images found
		this.videos = {};
		this.allVideos = []; 
		this.testPage = "<html><head></head><body>";
	}

	loadSubReddits(){
		this.subreddits = JSON.parse(fs.readFileSync("./data/subreddits.json"));
	}

	/*
	a function to get the database config from the root config.json file.
	@return an object containing the database config
	*/ 
	getDataBaseConfig(){
		return JSON.parse(fs.readFileSync("./config.json"))["database"];
	};

	/*
		a function to get a connection to the database
		@return a mysql connection
	*/
	getConnection(){
		let config = this.getDataBaseConfig();
		return mysql.createConnection({
			host: config["host"],
			user: config["user"],
			password: config["password"]
		}); 
	};

	save(){
		// fs.writeFile('./data/images.json', JSON.stringify(this.images));
		// fs.writeFile('./data/videos.json', JSON.stringify(this.videos));
		// fs.writeFile('./data/testPage.html', this.testPage);
		 fs.writeFile('./data/alllink.json',  JSON.stringify(this.allImages));

		let sql = "INSERT INTO npc.resource (url, post_url, source, source_host, date_time) VALUES ? ON DUPLICATE KEY UPDATE url=VALUES(url),post_url=VALUES(post_url)",
			con = this.getConnection(),
			values = [],
			dateFound = Date.now();
		
		for(let category in this.images){
			this.images[category].forEach(image => {
				values.push([image.url, image.post_url, category, "https://reddit.com"],dateFound);
			});
		}
	  
		con.connect(err => {
			//if (err) console.log(err);
			con.query(sql, [values], (err, result) => {
				if (err) console.log(err);
				console.log("storing links was successful!");
				con.end();
			});
		});
	}

	start(){
		console.log("starting the scrape for reddit.");
		let promises = [];
		this.loadSubReddits();
		this.subreddits.forEach(link =>{ //loop through each subreddit
			this.images[link] = [];
			this.videos[link] = [];
			let options = {
				uri: link,
				headers: {
					'Cookie': 'over18=1'
				}    
			};
			let promise = new Promise((res,rej)=>{
				request(options).then(html=>{ //request the page
					let soup = new JSSoup(html),
						posts = soup.findAll("a");

					posts.forEach(post=>{
						if(post.attrs["href"] && post.attrs["href"].includes("/comments/")){
							post.descendants.forEach(element =>{
								if(element.name === "img"){
									if(!this.allImages.includes(element.attrs["src"]) && element.attrs["src"]){ //if not found in any of the categories then add it 
										this.images[link].push({url: element.attrs["src"], post_url: post.attrs["href"]});
										this.allImages.push(element.attrs["src"]);
										this.testPage += "<img src='"+element.attrs["src"]+"'/>";
									}
								}
								// else if (element.name === "video"){ //<--------- I CANT FIGURE OUT WHY THIS DOESNT WORK
									
								// 	element.descendants.forEach(source =>{
								// 		console.log(source.attrs["type"]);
								// 		this.allVideos.push(source.attrs["src"]);
								// 	});
								// }
							});
						}
					});
						
					// videos.forEach(video =>{
					// 	if(!this.allVideos.includes(video.attrs["src"])){ //if not found in any of the categories then add it 
					// 		this.videos[link].push(video.attrs["src"]);
					// 		this.allVideos.push(video.attrs["src"]);
					// 		this.testPage += "<video><source src='"+video.attrs["src"]+"' type='video/mp4'></source></video>";
					// 	}
					// });
					res();
				}).catch(err=>{
					res();
				});
			});
			promises.push(promise);
		});
		return Promise.all(promises);
	}
}

module.exports = RedditScraper;