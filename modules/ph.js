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
						console.log("subreddits loaded!");
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
		console.log(this.videos["Asian"]);
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
						'Cookie': "RNKEY=4621439*5812013:1837939381:2942044328:1",
						'Upgrade-Insecure-Requests': '1',
						'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
					}
				};	 
				//console.log(this.getCookie());
				request(options).then(html=>{ //request the page
					let soup = new JSSoup(html),
						posts = soup.findAll("a");
						//console.log(category.source);
					posts.forEach(post =>{
						if(post.attrs["href"] && post.attrs["href"].includes("viewkey=")){
							console.log(post.attrs["href"]);
							
							let obj = {};
							obj.post_url = category.attrs["href"];
							if(post.nextElement.attrs){
								obj.url = post.nextElement.attrs["title"];
							}
							this.videos[category.category_name].push(obj);
						}
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

	leastFactor(n) {
		if (isNaN(n) || !isFinite(n)) return NaN;
		if (typeof phantom !== 'undefined') return 'phantom';
		if (typeof module !== 'undefined' && module.exports) return 'node';
		if (n==0) return 0;
		if (n%1 || n*n<2) return 1;
		if (n%2==0) return 2;
		if (n%3==0) return 3;
		if (n%5==0) return 5;
		var m=Math.sqrt(n);
		for (var i=7;i<=m;i+=30) {
		 if (n%i==0)      return i;
		 if (n%(i+4)==0)  return i+4;
		 if (n%(i+6)==0)  return i+6;
		 if (n%(i+10)==0) return i+10;
		 if (n%(i+12)==0) return i+12;
		 if (n%(i+16)==0) return i+16;
		 if (n%(i+22)==0) return i+22;
		 if (n%(i+24)==0) return i+24;
		}
		return n;
	   }
	getCookie() {
		var p=1237761925422; var s=1421282938; var n;
	   if ((s >> 0) & 1)/*
	   else p-=
	   */p+=
	   228043235*/*
	   p+= */3;/* 120886108*
	   */else /*
	   else p-=
	   */p-=   684214321*/* 120886108*
	   */1;/* 120886108*
	   */if ((s >> 13) & 1)/*
	   else p-=
	   */p+=85887202*
	   14;/*
	   else p-=
	   */else p-=/*
	   else p-=
	   */36451571*/* 120886108*
	   */14;/* 120886108*
	   */if ((s >> 5) & 1)     p+=/* 120886108*
	   */187894358*/*
	   p+= */6;        else  p-= 1901854*
	   6;/*
	   else p-=
	   */if ((s >> 4) & 1)/*
	   else p-=
	   */p+= 260748112*
	   7;/*
	   else p-=
	   */else p-=/*
	   else p-=
	   */215931160*    5;
	   if ((s >> 14) & 1)/*
	   *13;
	   */p+=
	   67088211*/*
	   *13;
	   */17;/* 120886108*
	   */else
	   p-=     16147634*/* 120886108*
	   */15;    p-=3553843198;
		n=this.leastFactor(p);
	   return "RNKEY="+n+"*"+p/n+":"+s+":2523374263:1";
	   }
	   

}

module.exports = PhScraper;