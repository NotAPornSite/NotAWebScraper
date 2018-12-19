const mysql = require('mysql'),
	  fs = require("fs");

/*
	a function to get the database config from the root config.json file.
	@return an object containing the database config
*/ 
let getDataBaseConfig = () => {
	return JSON.parse(fs.readFileSync("../config.json"))["database"];
};

/*
	a function to get a connection to the database
	@return a mysql connection
*/
let getConnection = () => {
	let config = getDataBaseConfig();
	return mysql.createConnection({
		host: config["host"],
		user: config["user"],
		password: config["password"]
	  }); 
};

/*
	a function to run a given sql file.
	@param filename - name of the sql file to run.
*/
let runFile = filename => {
	let sql = fs.readFileSync("./"+filename+".sql","utf8"),
		con = getConnection();
	  
	  con.connect(err => {
		if (err) throw err;
		console.log("Running File: "+filename+".sql");
		con.query(sql, (err, result) => {
			if (err) throw err;
			console.log(filename+".sql ran successfully!");
			console.log(result);
			con.end();
		});
	  });
};

/*
	a function to run all sql files. 
 */
let runAll = () => {
	let config = getDataBaseConfig();
	config["files"].forEach(file => {
		runFile(file);
	});
};

/*
	a function to drop a given table. 
	@param tableName - name of a table to drop.
*/
let drop = (tableName) => {
	let sql = "DROP TABLE npc."+tableName,
		con = getConnection();
	  
	con.connect(err => {
		if (err) throw err;
		console.log("Dropping Table: "+tableName);
		con.query(sql, (err, result) => {
			if (err) throw err;
			console.log(tableName+"wAs dropped successfully!");
			con.end();
		});
	});
};

/*
	a function to drop all tables in the config.
*/
let dropAll = () => {
	let config = getDataBaseConfig();
	config["tables"].forEach(file => {
		drop(file);
	});
};

/*
	a function to run the app.
*/
function main() {
	if(process.argv[2] === "all"){ 				//if you want to run all sql files
		runAll(); 
	}else if(process.argv[2] === "drop"){		//drop a table
		if(process.argv[3] === "all"){			//drop all tables
			dropAll();
		}else{
			drop(process.argv[3]);				//drop a specific table
		}
	}else{
		runFile(process.argv[2]);				//run a specific file
	}
}

main();