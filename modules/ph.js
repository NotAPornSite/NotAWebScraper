const JSSoup = require("jssoup").default,
	  request = require("request-promise"),
	  fs = require("fs"),
	  mysql = require('mysql'); 
//get all of the categories from the ph category page. scan the categories 
//and collect the post links. then use /embed/posthash to get the proper iframe url.

class PhScraper {

	constructor(){
		this.url = "https://www.pornhub.com";
		this.categories = []; 
		this.allVideos = [];
		this.videos = {};
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

	loadCategories() {
		return new Promise((res,rej)=>{
			let sql = "SELECT category_name, source FROM npc.scrape_source WHERE host = 'https://pornhub.com'",
				con = this.getConnection();
	  
			con.connect(err => {
				//if (err) console.log(err);
				con.query(sql, (err, result) => {
					if (err){
						console.log(err);
					}else{
						console.log("catgories loaded!");
						result.forEach((category) => {
							this.categories.push(category);
						});
					}
					con.end();
					res();
				});
			});
		});
	}

	save() {
		let sql = "INSERT INTO npc.resource (url, post_url, source, source_host, date_found, type) VALUES ? ON DUPLICATE KEY UPDATE url=VALUES(url),post_url=VALUES(post_url)",
			con = this.getConnection(),
			values = [],
			dateFound = new Date().toISOString().slice(0, 19).replace('T', ' ')

		for(let category in this.videos){
			this.videos[category].forEach(video => {
				values.push([video.url, video.post_url, category, "https://pornhub.com",dateFound,"video"]);
			});
		}
		
		con.connect(err => {
			//if (err) console.log(err);
			con.query(sql, [values], (err, result) => {
				if (err){
					console.log(err);
				}else{
					console.log("storing links was successful!");
				}
				con.end();
			});
		});
		this.categories = []; 
		this.allVideos = [];
		this.videos = {};
	}

	start() {
		console.log("starting the scrape for ph.");
		let promises = [];
		this.categories.forEach(category => {
			this.videos[category.category_name] = [];
			let promise = new Promise((res,rej)=>{
				let options = {
					uri: category.source,
					headers: {
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
						'Accept-Language': 'en-US,en;q=0.9',
						'Cache-Control': 'no-cache',
						'Connection': 'keep-alive',
						'Host': 'www.pornhub.com',
						'Pragma': 'no-cache',
						'Upgrade-Insecure-Requests': '1',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
					}
				};	 
				//console.log(this.getCookie());
				request(options).then(html=>{ //request the page to get the needed cookie
					let soup = new JSSoup(html),
						script = "(function() {var document = { location: {reload: (v) => {}}, cookie: ''};\n" + soup.find("script").prettify().replace("<script type=\"text/javascript\">","").replace("</script>","").replace("if (isNaN(n) || !isFinite(n)) return NaN;","").replace("if (typeof module !== 'undefined' && module.exports) return 'node'","");
						
					let lastBracket = script.lastIndexOf("}"),
						newScript = script.substr(0,lastBracket) + "return document;}  return go(); })()"; //eval the js that ph sends back to get the needed cookie

					options.headers["Cookie"] = eval(newScript).cookie; //set cookie before requesting next page
 
					request(options).then(html=>{ //request the page
						let soup = new JSSoup(html),
							posts = soup.findAll("a");
					
						posts.forEach(post =>{
							if(post && post.attrs["href"] && post.attrs["href"].includes("viewkey=") && post.attrs["href"].trim() !== ""){
								
								let obj = {
									post_url: "",
									url: ""
								};
								obj.post_url = "https://www.pornhub.com/embed/"+post.attrs["href"].split("viewkey=")[1]; //iframe embed link
								if(post.nextElement.attrs){
									obj.url = post.nextElement.attrs["title"]; //title of the video if one is found
								}
								if(!this.allVideos.includes(obj.post_url)){
									this.videos[category.category_name].push(obj);
									this.allVideos.push(obj.post_url);
								}
							}
						});
					
					});
					res();
				}).catch(err=>{
					res();
				});;
			});
			promises.push(promise);
		});
		return Promise.all(promises);
	}
	   

}

module.exports = PhScraper;