const rp = require('request-promise');

var express = require('express')
var app = express()

const port = process.env.PORT || 3000;
const fetchInterval = parseInt(process.env.FETCH_INTERVAL_MS, 10) || 60000;

var admin = require("firebase-admin");
var serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cs4471-architecture.firebaseio.com"
});

const db = admin.firestore();
var docRef = db.collection('services').doc('stocks');

function fetchData(ref){
  const stocks = ['FB', 'AMZN', 'AAPL', 'NFLX', 'GOOG'];
  const promises = [];

  for (let i = 0; i < stocks.length; i++) {
    promises[i] = rp(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${stocks[i]}&apikey=3SYO8XPS0TSLACNB`);
  }

  Promise.all(promises)
    .then(results => {
      jsonResults = results.map(r => {
        j = JSON.parse(r);
        j.timestamp = Date.now();
        return j;
      })
      // Only writes to firebase if not a rate limit error message
      if (!jsonResults[0].Note) {
        ref.set({
          'res': jsonResults
        });
        console.log(`publishing fresh data at ${Date.now()}`);
      } else { console.log('rate limited'); }
    })
    .catch(err => err);
}

setInterval(fetchData, fetchInterval, docRef);

app.get('/heartbeat', function (req, res) {
  res.sendStatus(200);
})

app.listen(port, () => console.log(`Stocks service running on port ${port}!`))