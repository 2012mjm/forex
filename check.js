const ta = require("technicalindicators");
const request = require("request");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "mjm3d_forex",
  password: "uz99fa@S,muQ",
  database: "mjm3d_forex"
  //port: '3388'
});
connection.connect();

let period = 8;
const chatIds = ["114463063"];

setInterval(() => {
  connection.query(
    "SELECT * FROM `quotes` WHERE `symbol` LIKE 'EURUSD' order by id desc limit 1000",
    function(error, results, fields) {
      results = results.reverse();

      const sec15 = fifteenSeconds(results);
      const min1 = oneMinute(results);
      const min5 = fiveMinutes(results);

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

      let rsi15sec = ta.RSI.calculate({ period: 14, values: sec15.close });
      let rsi1min = ta.RSI.calculate({ period: 14, values: min1.close });
      let rsi5min = ta.RSI.calculate({ period: 14, values: min5.close });

      let bb15sec = ta.BB.calculate({
        period: 20,
        stdDev: 2,
        values: sec15.close
      });
      let bb1min = ta.BB.calculate({
        period: 20,
        stdDev: 2,
        values: min1.close
      });
      let bb5min = ta.BB.calculate({
        period: 20,
        stdDev: 2,
        values: min5.close
      });

      // let cci15sec = ta.CCI.calculate({ ...sec15, period: 20 });
      // let cci1min = ta.CCI.calculate({ ...min1, period: 20 });
      // let cci5min = ta.CCI.calculate({ ...min5, period: 20 });

      // console.log("SMA 15 sec:", sma15sec.slice(-1)[0]);
      // console.log("SMA 1 min:", sma1min.slice(-1)[0]);
      // console.log("SMA 5 min:", sma5min.slice(-1)[0]);

      // console.log("MACD 15 sec:", macd15sec.slice(-1)[0]);
      // console.log("MACD 1 min:", macd1min.slice(-1)[0]);
      // console.log("MACD 5 min:", macd5min.slice(-1)[0]);

      console.log("RSI 15 sec:", rsi15sec.slice(-1)[0]);
      console.log("RSI 1 min:", rsi1min.slice(-1)[0]);
      console.log("RSI 5 min:", rsi5min.slice(-1)[0]);

      console.log("BB 15 sec:", bb15sec.slice(-1)[0]);
      console.log("BB 1 min:", bb1min.slice(-1)[0]);
      console.log("BB 5 min:", bb5min.slice(-1)[0]);

      console.log("\n\n");

      if (
        (rsi15sec.slice(-1)[0] < 30 &&
          rsi1min.slice(-1)[0] < 30 &&
          rsi5min.slice(-1)[0] < 30) ||
        (rsi15sec.slice(-1)[0] > 70 &&
          rsi1min.slice(-1)[0] > 70 &&
          rsi5min.slice(-1)[0] > 70)
      ) {
        let message = `RSI 15 sec: ${rsi15sec.slice(-1)[0]}\nRSI 1 min: ${rsi1min.slice(-1)[0]}\nRSI 5 min: ${rsi5min.slice(-1)[0]}`;
        chatIds.forEach(chatId => {
          request(
            "https://api.telegram.org/bot745759458:AAHtUX6YTX7yxmOIdD_HtSDq7z7IPhL2sh4/sendMessage?chat_id=" +
              chatId +
              "&text=" +
              message
          );
        });
      }

      // console.log("CCI 15 sec:", cci15sec.slice(-1)[0]);
      // console.log("CCI 1 min:", cci1min.slice(-1)[0]);
      // console.log("CCI 5 min:", cci5min.slice(-1)[0]);
    }
  );
}, 15000);

const fifteenSeconds = results => {
  let values = { open: [], close: [], high: [], low: [] };
  results.forEach(result => {
    values.open.push(result.open);
    values.close.push(result.close);
    values.high.push(result.max);
    values.low.push(result.min);
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
