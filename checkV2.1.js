const config = require("./config");

const ta = require("technicalindicators");
const request = require("request");
// const tgBot = require("node-telegram-bot-api");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: config.database_host,
  user: config.database_username,
  password: config.database_password,
  database: config.database_name
  // port: config.database_port
});
connection.connect();

// const tg = new tgBot(config.telegram_bot_api, {
//   polling: true
// });

const main = () => {
  connection.query(
    "SELECT * FROM `quotes` ORDER BY id DESC LIMIT 350",
    (error, results, fields) => {
      results = results.reverse();
      const sec15 = filter(results);

      connection.query(
        "SELECT COALESCE(`id`) id, symbol, COALESCE(`date`) `date`, \
        MIN(`min`) as `min`, MAX(`max`) as `max`, COALESCE(`open`) as `open`, SUBSTRING_INDEX(GROUP_CONCAT(`close`), ',', -1) as `close` \
        FROM (SELECT * FROM `quotes` ORDER BY id DESC LIMIT 7500) as t \
        GROUP BY symbol, DATE_FORMAT(`date`, '%Y-%m-%d %H:%i') \
        ORDER BY symbol, id DESC",
        (error, results, fields) => {
          results = results.reverse();
          const min1 = filter(results);
          const min5 = filter5min(results);

          console.log(min5);

          config.quote_symbols.forEach(symbol => {
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

            let bb15sec = bollingerBands(sec15.close[symbol]);
            let bb1min = bollingerBands(min1.close[symbol]);
            let bb5min = bollingerBands(min5.close[symbol]);

            let psar15sec = parabolicSAR(sec15.low[symbol], sec15.high[symbol]);
            let psar1min = parabolicSAR(min1.low[symbol], min1.high[symbol]);
            let psar5min = parabolicSAR(min5.low[symbol], min5.high[symbol]);
          });

          if (
            (rsi15sec.slice(-1)[0] < 30 &&
              rsi1min.slice(-1)[0] < 30 &&
              rsi5min.slice(-1)[0] < 30) ||
            (rsi15sec.slice(-1)[0] > 70 &&
              rsi1min.slice(-1)[0] > 70 &&
              rsi5min.slice(-1)[0] > 70)
          ) {
            let message = `${symbol}\n\n`;

            if (rsi15sec.slice(-1)[0] < 30) {
              message += "مقدار RSI زیر ۳۰\n\n";
            } else {
              message += "مقدار RSI بالای ۷۰\n\n";
            }

            message += `15 SEC\n`;
            message += `آر اس آی: ${rsi15sec.slice(-1)[0]}\n`;
            message += `باند بولینگر: ${bb15sec.status}\n`;
            message += `پارابولیک: ${psar15sec.status}\n\n`;
            message += `1 MIN\n`;
            message += `آر اس آی: ${rsi1min.slice(-1)[0]}\n`;
            message += `باند بولینگر: ${bb1min.status}\n`;
            message += `پارابولیک: ${psar1min.status}\n\n`;
            message += `5 MIN\n`;
            message += `آر اس آی: ${rsi5min.slice(-1)[0]}\n`;
            message += `باند بولینگر: ${bb5min.status}\n`;
            message += `پارابولیک: ${psar5min.status}\n`;

            // config.telegram_chat_ids.forEach(chatId => {
            //   tg.sendMessage(chatId, message);
            // });
          }
        }
      );
    }
  );
};
main();
setInterval(main, 15000);

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

const filter5min = results => {

  let i = 0;
  let min = [];
  let max = [];
  let values = { open: [], close: [], high: [], low: [], type: [] };
  let list = [];
  config.quote_symbols.forEach(item => {
    list[item] = [];
    values.open[item] = [];
    values.close[item] = [];
    values.high[item] = [];
    values.low[item] = [];
    values.type[item] = [];
  });

  results.forEach(result => {
    list[result.symbol].push(result);
  })

  console.log(list)

  // list.forEach(item => {
  //   if (i % 5 == 0) {
  //     values.open.push(result.open);
  //     min = [];
  //     max = [];
  //     min.push(result.min);
  //     max.push(result.max);
  //   } else if ((i + 1) % 5 == 0) {
  //     values.close.push(result.close);
  //     min.push(result.min);
  //     max.push(result.max);
  //     values.high.push(Math.min(...min));
  //     values.low.push(Math.max(...max));
  //   } else {
  //     min.push(result.min);
  //     max.push(result.max);
  //   }

  //   i++;
  // });
  // return values;

  // results.forEach(result => {
  //   values.open[result.symbol].push(result.open);
  //   values.close[result.symbol].push(result.close);
  //   values.high[result.symbol].push(result.max);
  //   values.low[result.symbol].push(result.min);
  //   values.type[result.symbol].push(
  //     result.open > result.close ? "sell" : "buy"
  //   );
  // });
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
