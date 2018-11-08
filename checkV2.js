const ta = require("technicalindicators");
const request = require("request");
const tgBot = require("node-telegram-bot-api");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "mjm3d_forex",
  password: "uz99fa@S,muQ",
  database: "mjm3d_forex"
  //port: '3388'
});
connection.connect();

const tg = new tgBot("745759458:AAHtUX6YTX7yxmOIdD_HtSDq7z7IPhL2sh4", {
  polling: true
});

let period = 8;
const chatIds = ["114463063", "614887041"];
const QUOTE = [
  "EURUSD",
  "GBPUSD",
  "EURCHF",
  "EURGBP",
  "EURNZD",
  "AUDJPY",
  "GBPAUD",
  "GBPCAD",
  "GBPNZD",
  "NZDUSD",
  "EURJPY",
  "USDJPY",
  "USDCHF",
  "GBPJPY"
];

setInterval(() => {
  connection.query(
    "SELECT * FROM `quotes` ORDER BY symbol DESC, id DESC LIMIT 350",
    function(error, results, fields) {
      results = results.reverse();

      const sec15 = fifteenSeconds(results);

//       SELECT COALESCE(`id`) id, symbol, COALESCE(`date`) `date`,
// MIN(`min`) as `min`, MAX(`max`) as `max`, COALESCE(`open`) as `open`, SUBSTRING_INDEX(GROUP_CONCAT(`close`), ',', -1) as `close`
// FROM (SELECT * FROM `quotes` ORDER BY id DESC LIMIT 1500) as t
// GROUP BY symbol, DATE_FORMAT(`date`, '%Y-%m-%d %H:%i')
// ORDER BY symbol, id DESC

      //const min1 = oneMinute(results);
      //const min5 = fiveMinutes(results);

      // let sma15sec = ta.SMA.calculate({ period: 14, values: sec15.close });
      // let sma1min = ta.SMA.calculate({ period: 14, values: min1.close });
      // let sma5min = ta.SMA.calculate({ period: 14, values: min5.close });

      // let macd15sec = ta.MACD.calculate({
      //   values: sec15.close,
      //   fastPeriod: 5,
      //   slowPeriod: 8,
      //   signalPeriod: 3,
      //   SimpleMAOscillator: false,
      //   SimpleMASignal: false
      // });

      // let macd1min = ta.MACD.calculate({
      //   values: min1.close,
      //   fastPeriod: 5,
      //   slowPeriod: 8,
      //   signalPeriod: 3,
      //   SimpleMAOscillator: false,
      //   SimpleMASignal: false
      // });

      // let macd5min = ta.MACD.calculate({
      //   values: min5.close,
      //   fastPeriod: 5,
      //   slowPeriod: 8,
      //   signalPeriod: 3,
      //   SimpleMAOscillator: false,
      //   SimpleMASignal: false
      // });

      // let rsi15sec = ta.RSI.calculate({ period: 14, values: sec15.close });
      // let rsi1min = ta.RSI.calculate({ period: 14, values: min1.close });
      // let rsi5min = ta.RSI.calculate({ period: 14, values: min5.close });

      // let bb15sec = bollingerBands(sec15.close);
      // let bb1min = bollingerBands(min1.close);
      // let bb5min = bollingerBands(min5.close);

      // let psar15sec = parabolicSAR(sec15.low, sec15.high);
      // let psar1min = parabolicSAR(min1.low, min1.high);
      // let psar5min = parabolicSAR(min5.low, min5.high);

      // let cci15sec = ta.CCI.calculate({ ...sec15, period: 20 });
      // let cci1min = ta.CCI.calculate({ ...min1, period: 20 });
      // let cci5min = ta.CCI.calculate({ ...min5, period: 20 });

      // console.log("SMA 15 sec:", sma15sec.slice(-1)[0]);
      // console.log("SMA 1 min:", sma1min.slice(-1)[0]);
      // console.log("SMA 5 min:", sma5min.slice(-1)[0]);

      // console.log("MACD 15 sec:", macd15sec.slice(-1)[0]);
      // console.log("MACD 1 min:", macd1min.slice(-1)[0]);
      // console.log("MACD 5 min:", macd5min.slice(-1)[0]);

      QUOTE.forEach(item => {
        let rsi15sec = ta.RSI.calculate({ period: 14, values: sec15[item].close });
        console.log("RSI 15 sec:", rsi15sec.slice(-1)[0]);
      })
      // console.log("RSI 1 min:", rsi1min.slice(-1)[0]);
      // console.log("RSI 5 min:", rsi5min.slice(-1)[0]);

      // console.log("BB 15 sec:", bb15sec, sec15.close.slice(-1)[0]);
      // console.log("BB 1 min:", bb1min, min1.close.slice(-1)[0]);
      // console.log("BB 5 min:", bb5min, min5.close.slice(-1)[0]);

      // console.log("PSAR 15 sec:", psar15sec, sec15.close.slice(-1)[0]);
      // console.log("PSAR 1 min:", psar1min, min1.close.slice(-1)[0]);
      // console.log("PSAR 5 min:", psar5min, min5.close.slice(-1)[0]);

      console.log("\n\n");

      // if (
      //   (rsi15sec.slice(-1)[0] < 30 &&
      //     rsi1min.slice(-1)[0] < 30 &&
      //     rsi5min.slice(-1)[0] < 30) ||
      //   (rsi15sec.slice(-1)[0] > 70 &&
      //     rsi1min.slice(-1)[0] > 70 &&
      //     rsi5min.slice(-1)[0] > 70)
      // ) {
      //   let message = `تایم فریم ۱۵ ثانیه‌ای\n`;
      //   message += `آر اس آی: ${rsi15sec.slice(-1)[0]}\n`;
      //   message += `باند بولینگر: ${bb15sec.status}\n`;
      //   message += `پارابولیک: ${psar15sec.status}\n\n`;
      //   message += `تایم فریم یک دقیقه‌ای\n`;
      //   message += `آر اس آی: ${rsi1min.slice(-1)[0]}\n`;
      //   message += `باند بولینگر: ${bb1min.status}\n`;
      //   message += `پارابولیک: ${psar1min.status}\n\n`;
      //   message += `تایم فریم پنج دقیقه‌ای\n`;
      //   message += `آر اس آی: ${rsi5min.slice(-1)[0]}\n`;
      //   message += `باند بولینگر: ${bb5min.status}\n`;
      //   message += `پارابولیک: ${psar5min.status}\n`;

      //   chatIds.forEach(chatId => {
      //     tg.sendMessage(chatId, message);
      //   });
      // }

      // console.log("CCI 15 sec:", cci15sec.slice(-1)[0]);
      // console.log("CCI 1 min:", cci1min.slice(-1)[0]);
      // console.log("CCI 5 min:", cci5min.slice(-1)[0]);
    }
  );
}, 15000);

const fifteenSeconds = results => {
  let values = { open: [], close: [], high: [], low: [] };
  QUOTE.forEach(item => {
    values.open[item] = [];
    values.close[item] = [];
    values.high[item] = [];
    values.low[item] = [];
  });
  results.forEach(result => {
    values.open[result.symbol].push(result.open);
    values.close[result.symbol].push(result.close);
    values.high[result.symbol].push(result.max);
    values.low[result.symbol].push(result.min);
  });
  return values;
};

const oneMinute = results => {
  let i = 0;
  let min = [];
  let max = [];
  let values = { open: [], close: [], high: [], low: [] };

  results.forEach(result => {
    if (i % 4 == 0) {
      values.open.push(result.open);
      min = [];
      max = [];
      min.push(result.min);
      max.push(result.max);
    } else if ((i + 1) % 4 == 0) {
      values.close.push(result.close);
      min.push(result.min);
      max.push(result.max);
      values.high.push(Math.min(...min));
      values.low.push(Math.max(...max));
    } else {
      min.push(result.min);
      max.push(result.max);
    }

    i++;
  });
  return values;
};

const fiveMinutes = results => {
  let i = 0;
  let min = [];
  let max = [];
  let values = { open: [], close: [], high: [], low: [] };

  results.forEach(result => {
    if (i % 20 == 0) {
      values.open.push(result.open);
      min = [];
      max = [];
      min.push(result.min);
      max.push(result.max);
    } else if ((i + 1) % 20 == 0) {
      values.close.push(result.close);
      min.push(result.min);
      max.push(result.max);
      values.high.push(Math.min(...min));
      values.low.push(Math.max(...max));
    } else {
      min.push(result.min);
      max.push(result.max);
    }

    i++;
  });
  return values;
};

const bollingerBands = values => {
  let result = ta.BollingerBands
    .calculate({
      period: 20,
      stdDev: 2,
      values
    })
    .slice(-1)[0];

  const newClose = values.slice(-1)[0];

  if (newClose >= result.upper) {
    result.status = "upper";
  } else if (newClose <= result.lower) {
    result.status = "lower";
  } else if (newClose > result.middle) {
    result.status = "top middle";
  } else if (newClose < result.middle) {
    result.status = "down middle";
  } else {
    result.status = null;
  }
  return result;
};

const parabolicSAR = (low, high) => {
  let result = ta.PSAR
    .calculate({
      step: 0.02,
      max: 0.2,
      high,
      low
    })
    .slice(-1)[0];

  const newLow = low.slice(-1)[0];
  const newHigh = high.slice(-1)[0];

  if (newLow > result || newHigh > result) {
    result = { value: result, status: "down" };
  } else if (newLow < result || newHigh < result) {
    result = { value: result, status: "top" };
  } else {
    result = { value: result, status: null };
  }
  return result;
};
