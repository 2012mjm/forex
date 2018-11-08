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
    "SELECT * FROM `quotes` ORDER BY id DESC LIMIT 350",
    (error, results, fields) => {
      results = results.reverse();
      const sec15 = filter(results);

      connection.query(
        "SELECT COALESCE(`id`) id, symbol, COALESCE(`date`) `date`, \
        MIN(`min`) as `min`, MAX(`max`) as `max`, COALESCE(`open`) as `open`, SUBSTRING_INDEX(GROUP_CONCAT(`close`), ',', -1) as `close` \
        FROM (SELECT * FROM `quotes` ORDER BY id DESC LIMIT 1500) as t \
        GROUP BY symbol, DATE_FORMAT(`date`, '%Y-%m-%d %H:%i') \
        ORDER BY symbol, id DESC",
        (error, results, fields) => {
          results = results.reverse();
          const min1 = filter(results);

          QUOTE.forEach(item => {
            let rsi15sec = ta.RSI.calculate({
              period: 14,
              values: sec15.close[item]
            });
            let rsi1min = ta.RSI.calculate({
              period: 14,
              values: min1.close[item]
            });
            console.log(`${item} -> RSI 15 sec:`, rsi15sec.slice(-1)[0]);
            console.log(`${item} -> RSI 1 min:`, rsi1min.slice(-1)[0]);
          });

          console.log("\n\n");
        }
      );
    }
  );
}, 15000);

const filter = results => {
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
