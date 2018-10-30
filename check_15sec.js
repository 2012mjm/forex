const ta = require('technicalindicators');
const request = require('request');

const mysql = require('mysql');
const connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'mjm3d_forex',
        password : 'uz99fa@S,muQ',
        database : 'mjm3d_forex',
        //port: '3388'
});
connection.connect();

let period = 8;
const chatIds = ['114463063'];

setInterval(() => {
let d = new Date();
let sec = 0;
let min = String(d.getMinutes()).padStart(2, "0");
let hour = String(d.getHours()).padStart(2, "0");

if(d.getSeconds() >= 1 && d.getSeconds() <= 15) sec = '01';
else if(d.getSeconds() >= 16 && d.getSeconds() <= 30) sec = '16';
else if(d.getSeconds() >= 31 && d.getSeconds() <= 45) sec = '31';
else sec = '46';

console.log('date', d);

connection.query("SELECT * FROM `quotes` WHERE `symbol` LIKE 'EURUSD' AND `date` LIKE '2018-10-% "+hour+":"+min+":"+sec+"'", function (error, results, fields) {
	if (error) console.log(error);
	//results = results.reverse();
	period = results.length;
	console.log('period', period);

	let values = {open: [], close: [], high:[], low:[]}
	results.forEach(result => {
		values.open.push(result.open)
		values.close.push(result.close)
		values.high.push(result.max)
		values.low.push(result.min)
	})

	//console.log(results[0], values);
	
	console.log('SMA', ta.SMA.calculate({14, values: values.close}));

	console.log('MACD', ta.MACD.calculate({values: values.close, 
        	fastPeriod        : 5,
	        slowPeriod        : 8,
	        signalPeriod      : 3,
	        SimpleMAOscillator: false,
	        SimpleMASignal    : false
	}));

	console.log('RSI', ta.RSI.calculate({period: 14, values: values.close}));

	console.log('CCI', ta.CCI.calculate({...values, 14}));
});

let message = 'hi';

chatIds.forEach(chatId => {
//	request('https://api.telegram.org/bot745759458:AAHtUX6YTX7yxmOIdD_HtSDq7z7IPhL2sh4/sendMessage?chat_id='+chatId+'&text='+message);
})
}, 15000);
