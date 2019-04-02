// api key = d12785c03da84996b66ef94395e58547

const rp = require('request-promise');

var express = require('express')
var app = express()
const port = 3000

var admin = require("firebase-admin");
var serviceAccount = require("./firebase-credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://cs4471-architecture.firebaseio.com"
});

const db = admin.firestore();
var docRef = db.collection('services').doc('news');

function fetchStocks(ref){
  return rp('https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=MSFT&apikey=demo')
    .then(res => {
      jsonRes = JSON.parse(res);
      jsonRes.timestamp = Date.now();
      console.log(`publishing fresh data at ${jsonRes.timestamp}`);
      ref.set(jsonRes);
    })
    .catch(err => err);
}

setInterval(fetchStocks, 1000, docRef);

// respond with "hello world" when a GET request is made to the homepage
app.get('/heartbeat', function (req, res) {
  res.sendStatus(200);
})

app.listen(port, () => console.log(`News service running on port ${port}!`))