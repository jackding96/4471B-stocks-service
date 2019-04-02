// api key = 5YUEPS6GZGGKOHUZ

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
var docRef = db.collection('services').doc('currency');

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

app.listen(port, () => console.log(`Currency service running on port ${port}!`))