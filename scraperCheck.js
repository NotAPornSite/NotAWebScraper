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

let lastDate = new Date();

app.get("/",(req,res)=>{
	let sql = "SELECT COUNT(1) AS count, (SELECT MAX(date_found) FROM npc.resource) AS lastDate FROM npc.resource",
		con = getConnection();
	con.connect(err => {
		//if (err) console.log(err);
		con.query(sql,(err, result) => {
			if (err) console.log(err);
			if(lastDate > result[0].lastDate){
				lastDate = result[0].lastDate;
			}
			let html = `
				<!DOCTYPE html>
				<html>
					<head>
						<meta charset="utf-8">
						<title>Scraper Healthcheck</title>
					</head>
					<body>
						<span>Last Run Date: ${lastDate}</span><br>
						<span>Link Count: ${result[0].count}</span>
					</body>
				</html>
			`;

			res.send(html.toString());

			con.end();
		});
	});
});

http.listen(8080,()=>{
    console.log("Listening on port 8080");
}); 