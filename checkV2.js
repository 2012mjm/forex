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

// config.telegram_chat_ids

setInterval(() => {
  connection.query(
    "SELECT * FROM `quotes` ORDER BY id DESC LIMIT 350",
    (error, results, fields) => {
      results = results.reverse();
      const sec15 = filter(results);

      console.log("type", sec15.type);

      connection.query(
        "SELECT COALESCE(`id`) id, symbol, COALESCE(`date`) `date`, \
        MIN(`min`) as `min`, MAX(`max`) as `max`, COALESCE(`open`) as `open`, SUBSTRING_INDEX(GROUP_CONCAT(`close`), ',', -1) as `close` \
        FROM (SELECT * FROM `quotes` ORDER BY id DESC LIMIT 1500) as t \
        GROUP BY symbol, DATE_FORMAT(`date`, '%Y-%m-%d %H:%i') \
        ORDER BY symbol, id DESC",
        (error, results, fields) => {
          results = results.reverse();
          const min1 = filter(results);

          config.quote_symbols.forEach(item => {
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
  let values = { open: [], close: [], high: [], low: [], type: [] };
  config.quote_symbols.forEach(item => {
    values.open[item] = [];
    values.close[item] = [];
    values.high[item] = [];
    values.low[item] = [];
    values.type[item] = [];
  });
  results.forEach(result => {
    values.open[result.symbol].push(result.open);
    values.close[result.symbol].push(result.close);
    values.high[result.symbol].push(result.max);
    values.low[result.symbol].push(result.min);
    values.type[result.symbol].push(
      result.open > result.close ? "sell" : "buy"
    );
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
