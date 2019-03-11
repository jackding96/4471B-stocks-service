const rp = require('request-promise');
const redis = require('redis');

const options = {port: 8080};
const pub = redis.createClient(options);

function fetchStocks(){
  return rp('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo')
    .then(res => pub.publish("stocks", res))
    .catch(err => err);
}

setInterval(fetchStocks, 1000);