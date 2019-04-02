// api key = 5YUEPS6GZGGKOHUZ

const rp = require('request-promise');

var express = require('express')
var app = express()

const port = process.env.PORT || 3000;
const fetchInterval = parseInt(process.env.FETCH_INTERVAL_MS, 10) || 1000;

var admin = require("firebase-admin");
var serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cs4471-architecture.firebaseio.com"
});

const db = admin.firestore();
var docRef = db.collection('services').doc('stocks');

function fetchStocks(ref){
  return rp('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=5YUEPS6GZGGKOHUZ')
    .then(res => {
      jsonRes = JSON.parse(res);
      jsonRes.timestamp = Date.now();
      console.log(jsonRes);
      console.log(`publishing fresh data at ${jsonRes.timestamp}`);
      ref.set(jsonRes);
    })
    .catch(err => err);
}

setInterval(fetchStocks, fetchInterval, docRef);

// respond with "hello world" when a GET request is made to the homepage
app.get('/heartbeat', function (req, res) {
  res.sendStatus(200);
})

app.listen(port, () => console.log(`Stocks service running on port ${port}!`))