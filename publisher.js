const rp = require('request-promise');

var admin = require("firebase-admin");

var serviceAccount = require("firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cs4471-architecture.firebaseio.com"
});

function fetchStocks(){
  return rp('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo')
    .then(res => res)
    .catch(err => err);
}

setInterval(fetchStocks, 1000);