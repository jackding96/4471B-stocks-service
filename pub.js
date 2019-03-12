const rp = require('request-promise');

function fetchStocks(){
  return rp('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo')
    .then(res => res)
    .catch(err => err);
}

setInterval(fetchStocks, 1000);