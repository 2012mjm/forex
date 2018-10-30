// config
const API = [
	'OWQtfh3LZ4VVxS2A5T8Tx1szdi7MvAjK', //jgm93598@awsoo.com
	'wSGMlAeBZ2FAbUzC8bVcASdCfODxZGtQ', //lux39924@nbzmr.com
	'T4PG2LO5BbE6bbq7wvqANlshQ1mfMoFF', //yjf17804@nbzmr.com
	'1NQJg3UflriTqUrWR9is8YkiRQ0SVUxf', //zke68444@nbzmr.com
	'AX68ZsTkIO4uzHCVoKelaMm2jCI79LKh', //zqm85651@awsoo.com
	'AGbKbBUqY1NikVUkiJiKzxQjHEZsgmoT', //gds54730@nbzmr.com
	'o9F6Vldg1CwwUFLxJoRnzoaUEeTqDWwh', //dbv88276@awsoo.com
	'1WsjRK7cwt7F9WtRB5j1dOOi2YKuVCOi', //jtn67422@nbzmr.com
];
const QUOTE = ['EURUSD','GBPUSD','EURCHF','EURGBP','EURNZD','AUDJPY','GBPAUD','GBPCAD','GBPNZD','NZDUSD','EURJPY','USDJPY','USDCHF','GBPJPY'];
const DB = {
	host     : 'localhost',
	user     : 'mjm3d_forex',
	password : 'uz99fa@S,muQ',
	database : 'mjm3d_forex',
	//port: '3388'
}

// require
const mysql = require('mysql');
const ForexDataClient = require("forex-quotes");

// db connect
const connection = mysql.createConnection(DB);
connection.connect();

// client connect
let currentApiIndex = 0;
let client = new ForexDataClient(API[currentApiIndex]);

setInterval(() => {
	client.getQuotes(QUOTE).then(response => {
		
		if(response.error !== undefined && response.error) {
			currentApiIndex = (currentApiIndex+1 > API.length-1) ? 0 : currentApiIndex+1;
			client = new ForexDataClient(API[currentApiIndex]);
			
			client.getQuotes(QUOTE).then(response => {
				if(response.length > 0) {
					response.forEach(item => {
						connection.query("INSERT INTO quote (symbol, price, bid, ask, timestamp) VALUES ('"+ item.symbol +"', '"+ item.price +"', '"+ item.bid +"', '"+ item.ask +"', '"+ item.timestamp +"');", function (error, results, fields) {
						  if (error) console.log(error);
						  else console.log(results);
						});
					});
				}
			})
		}
		else {
			if(response.length > 0) {
				response.forEach(item => {
					connection.query("INSERT INTO quote (symbol, price, bid, ask, timestamp) VALUES ('"+ item.symbol +"', '"+ item.price +"', '"+ item.bid +"', '"+ item.ask +"', '"+ item.timestamp +"');", function (error, results, fields) {
					  if (error) console.log(error);
					  else console.log(results);
					});
				});
			}
		}
	});
}, 15000);

//connection.end();
