const ta = require('technicalindicators');

const mysql = require('mysql');
const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'mjm3d_forex',
        password : 'uz99fa@S,muQ',
        database : 'mjm3d_forex',
        //port: '3388'
});
connection.connect();

let period = 7;

//setInterval(() => {
connection.query("SELECT * FROM `quotes` WHERE `symbol` LIKE 'EURUSD' AND `date` LIKE '2018-10-% 18:34:%'", function (error, results, fields) {
	if (error) console.log(error);
	//results = results.reverse();

	period = Math.floor(results.length / 4);
	console.log('period', period);

	let i = 0;
	let min = [];
	let max = [];
	let values = {open: [], close: [], high:[], low:[]}

	results.forEach(result => {
		if(i%4 == 0) {
			values.open.push(result.open);
			min = [];
			max = [];
			min.push(result.min);
			max.push(result.max);
		}
		else if((i+1)%4 == 0) {
			values.close.push(result.close);
			min.push(result.min);
			max.push(result.max);
			values.high.push(Math.min(...min));
			values.low.push(Math.max(...max));
		}
		else {
			min.push(result.min);
			max.push(result.max);
		}

		i++;
	});

	console.log(values);
	
	console.log('SMA', ta.SMA.calculate({period, values: values.close})[0]);

	console.log('MACD', ta.MACD.calculate({values: values.close, 
        	fastPeriod        : 4,//5,
	        slowPeriod        : 5,//8,
	        signalPeriod      : 3,
	        SimpleMAOscillator: false,
	        SimpleMASignal    : false
	})[0]);

	console.log('RSI', ta.RSI.calculate({period: period-1, values: values.close})[0]);

	console.log('CCI', ta.CCI.calculate({...values, period})[0]);
});
//}, 60000);
