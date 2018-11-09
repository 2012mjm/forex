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
            // if (countIf(sec15.type[item], "buy") >= 15) {
            //   console.log(`${item} -> best buy`);
            // } else if (countIf(sec15.type[item], "sell") >= 15) {
            //   console.log(`${item} -> best sell`);
            // }

            console.log(item, candleStickPattern(min1, item));
            console.log("\n");

            // let rsi15sec = ta.RSI.calculate({
            //   period: 14,
            //   values: sec15.close[item]
            // });
            // let rsi1min = ta.RSI.calculate({
            //   period: 14,
            //   values: min1.close[item]
            // });
            // console.log(`${item} -> RSI 15 sec:`, rsi15sec.slice(-1)[0]);
            // console.log(`${item} -> RSI 1 min:`, rsi1min.slice(-1)[0]);
          });
        }
      );

      console.log("\n\n");
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

const countIf = (array, value) => {
  return array.filter(x => x == value).length;
};

const candleStickPattern = (values, symbol) => {
  let result = [];
  const val1 = {
    open: values.open[symbol].slice(-1),
    high: values.high[symbol].slice(-1),
    close: values.close[symbol].slice(-1),
    low: values.low[symbol].slice(-1)
  };
  const val2 = {
    open: values.open[symbol].slice(-2),
    high: values.high[symbol].slice(-2),
    close: values.close[symbol].slice(-2),
    low: values.low[symbol].slice(-2)
  };
  const val3 = {
    open: values.open[symbol].slice(-3),
    high: values.high[symbol].slice(-3),
    close: values.close[symbol].slice(-3),
    low: values.low[symbol].slice(-3)
  };
  const val5 = {
    open: values.open[symbol].slice(-5),
    high: values.high[symbol].slice(-5),
    close: values.close[symbol].slice(-5),
    low: values.low[symbol].slice(-5)
  };

  if (ta.abandonedbaby(val3)) {
    result.push("Abandoned Baby");
  }
  if (ta.bearishengulfingpattern(val2)) {
    result.push("Bearish Engulfing");
  }
  if (ta.bullishengulfingpattern(val2)) {
    result.push("Bullish Engulfing");
  }
  if (ta.darkcloudcover(val2)) {
    result.push("Dark Cloud Cover");
  }
  if (ta.downsidetasukigap(val3)) {
    result.push("Downside Tasuki Gap");
  }
  if (ta.doji(val1)) {
    result.push("Doji");
  }
  if (ta.dragonflydoji(val1)) {
    result.push("Dragon Fly Doji");
  }
  if (ta.gravestonedoji(val1)) {
    result.push("Gravestone Doji");
  }
  if (ta.bullishharami(val2)) {
    result.push("Bullish Harami");
  }
  if (ta.bearishharami(val2)) {
    result.push("Bearish Harami");
  }
  if (ta.bearishharamicross(val2)) {
    result.push("Bearish Harami Cross");
  }
  if (ta.bullishharamicross(val2)) {
    result.push("Bullish Harami Cross");
  }
  if (ta.bullishmarubozu(val1)) {
    result.push("Bullish Marubozu");
  }
  if (ta.bearishmarubozu(val1)) {
    result.push("Bearish Marubozu");
  }
  if (ta.eveningdojistar(val3)) {
    result.push("Evening Doji Star");
  }
  if (ta.eveningstar(val3)) {
    result.push("Evening Star");
  }
  if (ta.piercingline(val2)) {
    result.push("Piercing Line");
  }
  if (ta.bullishspinningtop(val1)) {
    result.push("Bullish Spinning Top");
  }
  if (ta.bearishspinningtop(val1)) {
    result.push("Bearish Spinning Top");
  }
  if (ta.morningdojistar(val3)) {
    result.push("Morning Doji Star");
  }
  if (ta.morningstar(val3)) {
    result.push("Morning Star");
  }
  if (ta.threeblackcrows(val3)) {
    result.push("Three Black Crows");
  }
  if (ta.threewhitesoldiers(val3)) {
    result.push("Three White Soldiers");
  }
  if (ta.bullishhammer(val1)) {
    result.push("Bullish Hammer");
  }
  if (ta.bearishhammer(val1)) {
    result.push("Bearish Hammer");
  }
  if (ta.bullishinvertedhammer(val1)) {
    result.push("Bullish Inverted Hammer");
  }
  if (ta.bearishinvertedhammer(val1)) {
    result.push("Bearish Inverted Hammer");
  }
  if (ta.hammerpattern(val5)) {
    result.push("Hammer");
  }
  if (ta.hammerpatternunconfirmed(val5)) {
    result.push("Hammer (Unconfirmed)");
  }
  if (ta.hangingman(val5)) {
    result.push("Hanging Man");
  }
  if (ta.hangingmanunconfirmed(val5)) {
    result.push("Hanging Man (Unconfirmed)");
  }
  if (ta.shootingstar(val5)) {
    result.push("Shooting Star");
  }
  if (ta.shootingstarunconfirmed(val5)) {
    result.push("Shooting Star (Unconfirmed)");
  }
  if (ta.tweezertop(val5)) {
    result.push("Tweezer Top");
  }
  if (ta.tweezerbottom(val5)) {
    result.push("Tweezer Bottom");
  }

  return result;
};
