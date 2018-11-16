const config = require("./config");

const ta = require("technicalindicators");
const request = require("request");
const tgBot = require("node-telegram-bot-api");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: config.database_host,
  user: config.database_username,
  password: config.database_password,
  database: config.database_name
  // port: config.database_port
});
connection.connect();

const tg = new tgBot(config.telegram_bot_api, {
  polling: true
});

const main = () => {
  let date = dateTimeZone('+3.5'); // Asia/Tehran
  if (date.getDay() === 0 || date.getDay() === 6) return undefined;

  connection.query(
    "SELECT * FROM `quotes` ORDER BY id DESC LIMIT 7500",
    (error, results, fields) => {
      results = results.reverse();

      /** ************* filter ************* */
      const sec15 = fifteenSeconds(results);
      const min1 = filterMinutes(results, 4);
      const min5 = filterMinutes(results, 20);

      let message = "";
      config.quote_symbols.forEach(symbol => {
        /** ************* RSI ************* */
        let rsi15sec = ta.RSI.calculate({
          period: 14,
          values: sec15.close[symbol]
        });
        let rsi1min = ta.RSI.calculate({
          period: 14,
          values: min1.close[symbol]
        });
        let rsi5min = ta.RSI.calculate({
          period: 14,
          values: min5.close[symbol]
        });

        /** ************* Bollinger Bands ************* */
        // let bb15sec = bollingerBands(sec15.close[symbol]);
        // let bb1min = bollingerBands(min1.close[symbol]);
        // let bb5min = bollingerBands(min5.close[symbol]);

        // /** ************* Parabolic SAR ************* */
        // let psar15sec = parabolicSAR(sec15.low[symbol], sec15.high[symbol]);
        // let psar1min = parabolicSAR(min1.low[symbol], min1.high[symbol]);
        // let psar5min = parabolicSAR(min5.low[symbol], min5.high[symbol]);

        /** ************* MACD ************* */
        // const macdParams = {
        //   fastPeriod: 12,
        //   slowPeriod: 26,
        //   signalPeriod: 9,
        //   SimpleMAOscillator: false,
        //   SimpleMASignal: false
        // };
        // let macd15sec = ta.MACD.calculate({
        //   ...macdParams,
        //   values: sec15.close[symbol]
        // });
        // let macd1min = ta.MACD.calculate({
        //   ...macdParams,
        //   values: min1.close[symbol]
        // });
        // let macd5min = ta.MACD.calculate({
        //   ...macdParams,
        //   values: min5.close[symbol]
        // });

        /** ************* IF ************* */
        if (
          (rsi15sec.slice(-1)[0] < 30 &&
            rsi1min.slice(-1)[0] < 30 &&
            rsi5min.slice(-1)[0] < 30) ||
          (rsi15sec.slice(-1)[0] > 70 &&
            rsi1min.slice(-1)[0] > 70 &&
            rsi5min.slice(-1)[0] > 70)
        ) {
          message += `${config.symbols_flag[symbol]} ${symbol}\n`;
          message += `⌚️ ${new Date(`${sec15.date[symbol].slice(-1)[0]} UTC`).toLocaleString("en-US", {timeZone: "Asia/Tehran"})}\n`

          if (rsi15sec.slice(-1)[0] < 30) {
            message += "🔻 مقدار RSI زیر ۳۰\n\n";
          } else {
            message += "🔺 مقدار RSI بالای ۷۰\n\n";
          }

          // message += `15 SEC\n`;
          // message += `آر اس آی: ${rsi15sec.slice(-1)[0]}\n`;
          // message += `باند بولینگر: ${bb15sec.status}\n`;
          // message += `پارابولیک: ${psar15sec.status}\n\n`;
          // message += `1 MIN\n`;
          // message += `آر اس آی: ${rsi1min.slice(-1)[0]}\n`;
          // message += `باند بولینگر: ${bb1min.status}\n`;
          // message += `پارابولیک: ${psar1min.status}\n\n`;
          // message += `5 MIN\n`;
          // message += `آر اس آی: ${rsi5min.slice(-1)[0]}\n`;
          // message += `باند بولینگر: ${bb5min.status}\n`;
          // message += `پارابولیک: ${psar5min.status}\n`;
        }
      });

      /** ************* SEND TO TELEGRAM ************* */
      if (message !== "") {
        config.telegram_chat_ids.forEach(chatId => {
          tg.sendMessage(chatId, message);
        });
      }
    }
  );
};
main();
setInterval(main, 15000);

const fifteenSeconds = results => {
  let values = { open: [], close: [], high: [], low: [], type: [], date: [] };
  config.quote_symbols.forEach(symbol => {
    values.open[symbol] = [];
    values.close[symbol] = [];
    values.high[symbol] = [];
    values.low[symbol] = [];
    values.type[symbol] = [];
    values.date[symbol] = [];
  });
  results.forEach(result => {
    values.open[result.symbol].push(result.open);
    values.close[result.symbol].push(result.close);
    values.high[result.symbol].push(result.max);
    values.low[result.symbol].push(result.min);
    values.date[result.symbol].push(result.date);
    values.type[result.symbol].push(
      result.open > result.close ? "sell" : "buy"
    );
  });
  return values;
};

const filterMinutes = (results, sliceCount = 4) => {
  let i = 0;
  let min = [];
  let max = [];
  let list = [];
  let values = { open: [], close: [], high: [], low: [], type: [] };

  config.quote_symbols.forEach(symbol => {
    list[symbol] = [];
    values.open[symbol] = [];
    values.close[symbol] = [];
    values.high[symbol] = [];
    values.low[symbol] = [];
    values.type[symbol] = [];
  });

  results.forEach(result => {
    list[result.symbol].push(result);
  });

  config.quote_symbols.forEach(symbol => {
    list[symbol].forEach(item => {
      if (i % sliceCount == 0) {
        values.open[symbol].push(item.open);
        min = [];
        max = [];
        min.push(item.min);
        max.push(item.max);
      } else if ((i + 1) % sliceCount == 0) {
        values.close[symbol].push(item.close);
        min.push(item.min);
        max.push(item.max);
        values.high[symbol].push(Math.min(...min));
        values.low[symbol].push(Math.max(...max));
        values.type[symbol].push(item.open > item.close ? "sell" : "buy");
      } else {
        min.push(item.min);
        max.push(item.max);
      }
      i++;
    });
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
    result.status = "خیلی بالا";
  } else if (newClose <= result.lower) {
    result.status = "خیلی پایین";
  } else if (newClose > result.middle) {
    result.status = "وسط به بالا";
  } else if (newClose < result.middle) {
    result.status = "وسط به پایین";
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
    result = { value: result, status: "زیرش" };
  } else if (newLow < result || newHigh < result) {
    result = { value: result, status: "روش" };
  } else {
    result = { value: result, status: null };
  }
  return result;
};

function dateTimeZone(offset) {
  d = new Date();
  utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc + 3600000 * offset);
};
