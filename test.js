const JSSoup = require("jssoup").default,
	  request = require("request-promise"),
	  fs = require("fs"),
	  mysql = require('mysql'); 
/*
	a function to get the database config from the root config.json file.
	@return an object containing the database config
	*/ 
function getDataBaseConfig(){
		return JSON.parse(fs.readFileSync("./config.json"))["database"];
	};

	/*
		a function to get a connection to the database
		@return a mysql connection
	*/
function getConnection(){
		let config = getDataBaseConfig();
		return mysql.createConnection({
			host: config["host"],
			user: config["user"],
			password: config["password"]
		}); 
	};

  let options = {
	uri: "https://www.pornhub.com/video?c=28",
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
request(options).then(html=>{ //request the page
	let soup = new JSSoup(html),
		categories = soup.findAll("a");
	categories.forEach(category => {
		if(category.attrs["href"] && category.attrs["href"].includes("viewkey=")){
			console.log(category.attrs["href"]);
			if(category.nextElement.attrs){
				console.log(category.nextElement.attrs["title"]);
			}
			console.log("");
		}
		// if(category.attrs["href"] && category.attrs["href"].includes("/video?c=") && category.attrs["alt"]){
		// 	let sql = "INSERT INTO npc.scrape_source (host,source,category_name) VALUES ('https://pornhub.com','https://www.pornhub.com"+category.attrs["href"]+"','"+category.attrs["alt"]+"') ON DUPLICATE KEY UPDATE host=VALUES(host),source=VALUES(source)",
		// 	con = getConnection();
		// 	con.connect(err => {
		// 		//if (err) console.log(err);
		// 		con.query(sql, (err, result) => {
		// 			if (err){
		// 				console.log(err);
		// 			}else{
		// 				console.log("storing links was successful!");
		// 			}
		// 			con.end();
		// 		});
		// 	});
		// }
	});
 });
