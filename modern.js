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
	'26nRzKHYUvrItPK0RlKnnfwCERzQxw0R', //qjh23814@ebbob.com
	'NaeV4TN2hiphPPa7qrZXkmSFGf6cnCkj', //jgw15086@nbzmr.com
	'owk2nQRvJkJyDkKP9uXb6BE5cgoOylWD',
	'gfWcQ5petmbVqq9r9oSpDg4ilOKw57rO',
	'CsiUj0r01ID2ivXFDkg7opHDmmUzsIkv',
	'ogSBW0hboDVs8TGs4p6uPFF7FjCzcfJR',
	'2nfunZlEHXr3DQCja5KYLGivQ02GSeMK',
	'P3w7uIHv49bmSk0oWxVrech3jWISggKx',
	'qZxR9DOzXzblCaSZ2wBg5q8oPSxGOsze',
	'LHo1hzOV2UszHZp7u4IBxFQkSpHxq5Ax',
	'omSw9sZmhy88CcMgHZyHiBVmwJ8KZOeA',
	'dyJFCfrTlXc47D6uWPhfyz0dF9TFifNu',
	'4DXR1Y0fkTuH91Zh4bIbfN0ocvbSMb9R',
	'E5aQTF6yQVxsZnhJUsJif4emO6ifAsND',
	'UlWJWzSSDNWP4kSB0EkpJPQ9Dc5wlIfI',
	'VTPXJtW3PNjicGD9RBFAxvUwTP8OGkAD',
	'et0NbjdxocDKM41qwCZ6yx1RjZccrRzM',
	'1cMHkDprjjc2UD6A1n2HHlm6HmhMMyhN',
	'uN57hCmPzYmorkyWMdo8IrneawkeT8f4',
	'oGe0oglLI8Oegcqmr2ROdjdxgJoNG4dm',
	'HduA28kX6Oa7zgxFa7WW7mKCfKFd3zl7',
	'EzTiGAPp1vAOb5e6WnF3ipJIohTR9K0Z',
	'cKUubWHRiUdUa0RjE8FAi9gPXwfcDNIr',
	'OzwzYqI0aEaK8xvrfS7kYTnnVYcaxij4',
	'5Hi6zb6aHd23NIhA3InJHL9HRshFtPH0',
	'PYc4jgKfnuWxKal4zUxPcmTvFbdAXvwk',
	'bqUyIB3XqCbcjVL9ENKj87cOVR1UBCFX',
	'WuvEQIl7RNoGiA0dHtWEVKH4eKa1uaix',
	'F5IKLyAWKt7TofEO9jAV3apTe2cZp2HT',
	'D2gb5E9z2IueUzcwDfTO3qe8SY2zIYfV',
	'VWQfI5GYBWJGHy5QzqPHBiG2yKkGGtmD',
	'XbYLMb7BMiECQn84mC5STP2IF06RucQLX',
	'lxAgmHypMa9yhAwZWCusTaXFKMWJCamA',
	'UG8QtVuuMIXKcKZLiJyDezZrYp4rKKFD',
	'8sB87Wciq5hLncgfwhCyDtLLoRXdlz8y',
	'jJGTDlWBK3yKK0U7E5DPHhWVuHvhUczB',
	'HMShq7Pm9GZCDZGKdnyOeVN8CpoK08Lc',
	'i0zKvlvA6n0J2cEFMfJxSf5M5s53cs4R',
	'RAeh1XL09r4RlKS05MvDHyCDEJjcWWx1',
	'gi31W5dQuphtOEPbwj2c1emDOmfgU9eQ',
	'1xHLbdULj9CBiQjn0x1uU1UYnd9IOy4A',
	'DFsnLZ2RkbNBWkUN6LC1M32wKmNNVxBR',
	'pE8vcnNma2QwcV5UJRKoIrwpFP1Z5Pej',
	'i1tSTuWjJLeiA1jvKtqo9civon6g6uB8',
	'dM7R7dbuYFXN5t3ZdtX1KEqEL5m7SMKM',
	'UV6DX7u4ZAPJOI00047yMLICucgDoACS',
	'P8rZRQ8ut9hIyrVWgPzyqkaOiHW6vd7A',
	'HHdyWIAWfm3CZV8CtZyee434GnkHHYGR',
	'JxslaS9c9uq6chV1sK0DQhhAZM4WJzjl',
	'4eDaCX2bg2WwBxBPK3b8TsiKhjzjoIXd',
	'1iCbe2tjrplAsme6uutpUPLrQBVxm9F6',
	'7eGrgXaFWQbc0xfDZIz507i8U4BiOhdq',
	'jU2MnMnJxrHJrrEKz3jX9Kt7KCSLcGuV',
	'7MkM7nu3xJ9TDUaaLdQGkp1VdanHWmYG',
	'MzOt6TgsqJzNIcD0y4DPD6m9Hc7QY0zS',
	'22laVjRMd4AMKOtjoJcZtdDhvG7sHYey',
	'R01p0BYxlRNaLufbFpxoRmZUrsr3dlkX',
	'SZaD6EgyIQETPqT8QW71RHhQtxbVRHca',
	'RY6wuYXCAK9yd1HGgUAnNR2j7IhXPQ15',
	'KU2LjFFeSAQHbwZlb0gjXVVClaVflWlq',
	'RpXvhXvIiTUNxcOQeoAFAnT6k7HMQ5lN',
	'EXiCnAFguoB0nzt2bG2FwQs8ESw5iTYo',
	'X1DJFh6GsHgGPJjUpeekg6YSZoNX5Jde',
	'OEd5Le5qBSSBpbVwexGr8UFh3tsZn6Ui',
	'T791Nf0KBUFottDswTMt49Cfwfc5yMKZ',
	'Yx342ulO3n54hApd8pT11kZSaaMPZLmt',
	'lK74cp8hSvzTgfPpp5nodo4BvXnqWXgF',
	'piNyc65k5pzlxqkfFxVpKxe6wYmFEkfr',
	'WaTauTppTHGGXLmOXmXPidKhdzAvyVRV',
	'j7wbb0hyB8V2SrRgUQH1WCkNzHMgDKms',
	'j8OVpLPd7VyzqdddnI1UDrW3VSIRam3w',
	'Y5Nz2SuK1Dy5XAL3W3lV7vXV5UDd2AlP',
	'nqm9veG34psBQCfrTThmi5MgYv99eV2I',
	'PNvSr2cgYTiyaeZXudkACWyt1tSuMU8E',
	'PVsmT2VgoLJsHZuLEbCGCGpCGB1Njc6u',
	'PtxvaKWrboRlur9TuMCeFEZiNlCoOp5r',
	'yDDj4OCug0lpoPxzCx3yKfoNU7JxoPOV',
	'IWTSnRKIXXNcZjRJzzzj1ne5HGgKj58X',
	'fzNa6mgIrDLWYoyPn6ySKXZVTaqCWk4P',
	'UIvSuht9heT2wxau2XbM1ThHqc2QBxfm',
	'xsqxTSMhytVGt2NbERVoneJFzeq3TycM',
	'NKwvsJHFmjKzThCETJ0fOVe1AhVeJX5p',
	'ffiQSOSjOFFXhBQvlaKS6LS63nHwLzb6',
	'rE3bGSul9IJ66HKoCOk94aNp4qtYd7tp',
	'x4kPcKVyx8rWQjWfVMslX5RfRC4t2alc',
	'EbF2ps0IiRW8eTpbBaVMa9Wibin9v2oj',
	'zZ8prhn1PLk4tLss60PF63lxb8QBFrva'
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
			    cal(response);
			})
		}
		else {
			cal(response);
		}
	});
}, 1000);


let prices = [];
let open = [];
let close = [];
let max = [];
let min = [];
let openTime = [];
QUOTE.forEach(item => {
    prices[item] = [];
    open[item] = null;
    close[item] = null;
    max[item] = null;
    min[item] = null;
    openTime[item] = null;
})

function cal(response) {
    if(response.length > 0) {
		response.forEach(item => {

		    let d = new Date(item.timestamp*1000);
		    if((d.getSeconds() - 1) % 15 === 0) {

                open[item.symbol] = item.price;
                prices[item.symbol] = [];
                prices[item.symbol].push(item.price);
                openTime[item.symbol] = d;
            }

            else if(d.getSeconds() % 15 === 0) {
                close[item.symbol] = item.price;
                prices[item.symbol].push(item.price);
                
                if(prices[item.symbol].length == 15) {
                    min[item.symbol] = Math.min(...prices[item.symbol]);
                    max[item.symbol] = Math.max(...prices[item.symbol]);
                    
                    connection.query("INSERT INTO quotes (symbol, open, close, max, min, date) VALUES ('"+ item.symbol +"', '"+ open[item.symbol] +"', '"+ close[item.symbol] +"', '"+ max[item.symbol] +"', '"+ min[item.symbol] +"', '"+ openTime[item.symbol].toMysqlFormat() +"');", function (error, results, fields) {
                        if (error) console.log(error);
                        else console.log(results);
    			    });
                }
            }
            
            else {
                prices[item.symbol].push(item.price);
            }
		});
	}
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};

//connection.end();
