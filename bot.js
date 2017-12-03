const Poloniex = require('poloniex-api-node');
let poloniex = new Poloniex();
var path = require('path');
var CronJob = require('cron').CronJob;
var mysql_modul = require(path.join(__dirname, 'module', 'mysql_modul'));

var job = new CronJob('*/1 * * * * *', () => {
  poloniex.returnTicker().then((ticker) => {
    mysql_modul.insert_ticker(ticker.ETH_ZEC.lowestAsk, (err, suc)=>{
      if(err){
        console.error(err);
      } else {
        console.log(ticker.ETH_ZEC.lowestAsk);
      }
    });
  }).catch((err) => {
    console.log(err.message);
  });
}, null, true);
