"use strict"; 
const express = require("express"), 
    app = express(), 
	http = require("http").Server(app),
	mysql = require('mysql'),
	fs = require("fs");
/*
a function to get the database config from the root config.json file.
@return an object containing the database config
*/ 
let getDataBaseConfig = () => {
	return JSON.parse(fs.readFileSync("./config.json"))["database"];
};

/*
	a function to get a connection to the database
	@return a mysql connection
*/
let getConnection = () =>{
	let config = getDataBaseConfig();
	return mysql.createConnection({
		host: config["host"],
		user: config["user"],
		password: config["password"]
	}); 
};

app.get("/",(req,res)=>{
	let sql = "select url from npc.resource order by RAND() desc limit 0,10",
		con = getConnection(),
		body = "",
		start = req.query.start,
		stop = req.query.stop,
		ajax = req.query.ajax;

	if(!start || !stop){
		start = 0;
		stop = 10;
	}
	
	sql = `select url from npc.resource order by RAND() limit ${start},${stop}`.toString();

	con.connect(err => {
		//if (err) console.log(err);
		con.query(sql,(err, result) => {
			if (err) console.log(err);

			result.forEach(image =>{
				body += `
					<img src="${image.url}"></img><br>

				`.toString();
			});

			let html = `
				<!DOCTYPE html>
				<html>
					<head>
						<meta charset="utf-8">
						<title>Scraper Healthcheck</title>
					</head>
					<body>
						<div id="images">
							${body}
						</div>
						<script>
							"use strict";
							let currentStart = 11,
								currentStop = 21,
								isFetch = false; 

							window.onscroll = function(ev) {
								if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
									if(!isFetch){
										isFetch = true;
										fetch('http://localhost:8080/?ajax=true&start='+currentStart+'&stop='+currentStop)
										.then(function(response) {
											console.log(response);
											response.text().then((text)=>{
												let images = document.getElementById("images");
												images.innerHTML += text;
												currentStart += 11;
												currentStop += 11;
												isFetch = false;
											});
										});
									}
								}
							};
						</script>
					</body>
				</html>
			`;

			if(ajax){
				res.send(body);
			}else{
				res.send(html.toString());
			}


			con.end();
		});
	});
});

http.listen(8080,()=>{
    console.log("Listening on port 8080");
}); 