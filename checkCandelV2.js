const config = require("./config");

const ta = require("technicalindicators");
const request = require("request");

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: config.database_host,
  user: config.database_username,
  password: config.database_password,
  database: config.database_name
  // port: config.database_port
});
connection.connect();

setInterval(() => {
  connection.query(
    "SELECT * FROM `quotes` ORDER BY id DESC LIMIT 260",
    (error, results, fields) => {

      results = results.reverse();
      const sec15 = filter(results);


      // let time = (Date.parse(sec15.date['EURUSD'].slice(-1)[0]) / 1000 + 12600) * 1000;
      console.log(sec15.open['EURUSD'].slice(-1)[0], sec15.close['EURUSD'].slice(-1)[0]);

      console.log(candleStickPattern(sec15, 'EURUSD'));
      console.log("\n");
    }
  );
}, 15000);

const filter = results => {
  let values = { open: [], close: [], high: [], low: [], type: [], date: [] };
  config.quote_symbols.forEach(item => {
    values.open[item] = [];
    values.close[item] = [];
    values.high[item] = [];
    values.low[item] = [];
    values.type[item] = [];
    values.date[item] = [];
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

const candleStickPattern = (values, symbol) => {
  let result = [];
  let bullish = (bearish = 0);
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
    bearish++;
  }
  if (ta.bullishengulfingpattern(val2)) {
    result.push("Bullish Engulfing");
    bullish++;
  }
  if (ta.darkcloudcover(val2)) {
    result.push("Dark Cloud Cover");
    bearish++;
  }
  if (ta.downsidetasukigap(val3)) {
    result.push("Downside Tasuki Gap");
    bearish++;
  }
  if (ta.doji(val1)) {
    result.push("Doji");
  }
  if (ta.dragonflydoji(val1)) {
    result.push("Dragonfly Doji");
    bullish++;
  }
  if (ta.gravestonedoji(val1)) {
    result.push("Gravestone Doji");
    bearish++;
  }
  if (ta.bullishharami(val2)) {
    result.push("Bullish Harami");
    bullish++;
  }
  if (ta.bearishharami(val2)) {
    result.push("Bearish Harami");
    bearish++;
  }
  if (ta.bullishharamicross(val2)) {
    result.push("Bullish Harami Cross");
    bullish++;
  }
  if (ta.bearishharamicross(val2)) {
    result.push("Bearish Harami Cross");
    bearish++;
  }
  if (ta.bullishmarubozu(val1)) {
    result.push("Bullish Marubozu");
    bullish++;
  }
  if (ta.bearishmarubozu(val1)) {
    result.push("Bearish Marubozu");
    bearish++;
  }
  if (ta.eveningdojistar(val3)) {
    result.push("Evening Doji Star");
    bearish++;
  }
  if (ta.eveningstar(val3)) {
    result.push("Evening Star");
    bearish++;
  }
  if (ta.piercingline(val2)) {
    result.push("Piercing Line");
  }
  if (ta.bullishspinningtop(val1)) {
    result.push("Bullish Spinning Top");
    bullish++;
  }
  if (ta.bearishspinningtop(val1)) {
    result.push("Bearish Spinning Top");
    bearish++;
  }
  if (ta.morningdojistar(val3)) {
    result.push("Morning Doji Star");
    bullish++;
  }
  if (ta.morningstar(val3)) {
    result.push("Morning Star");
    bullish++;
  }
  if (ta.threeblackcrows(val3)) {
    result.push("Three Black Crows");
    bearish++;
  }
  if (ta.threewhitesoldiers(val3)) {
    result.push("Three White Soldiers");
    bullish++;
  }
  if (ta.hammerpattern(val5)) {
    result.push("Hammer");
    bullish++;
  }
  if (ta.hammerpatternunconfirmed(val5)) {
    result.push("Hammer (Unconfirmed)");
  }
  if (ta.hangingman(val5)) {
    result.push("Hanging Man");
    bearish++;
  }
  if (ta.hangingmanunconfirmed(val5)) {
    result.push("Hanging Man (Unconfirmed)");
  }
  if (ta.shootingstar(val5)) {
    result.push("Shooting Star");
    bearish++;
  }
  if (ta.shootingstarunconfirmed(val5)) {
    result.push("Shooting Star (Unconfirmed)");
  }
  if (ta.tweezertop(val5)) {
    result.push("Tweezer Top");
    bearish++;
  }
  if (ta.tweezerbottom(val5)) {
    result.push("Tweezer Bottom");
    bullish++;
  }

  return { result, bullish, bearish };
};
