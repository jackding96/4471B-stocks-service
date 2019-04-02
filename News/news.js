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
var docRef = db.collection('services').doc('news');

function fetchData(ref){
  return rp('https://newsapi.org/v2/top-headlines?country=us&apiKey=d12785c03da84996b66ef94395e58547')
    .then(res => {
      jsonRes = JSON.parse(res);
      console.log(jsonRes);
      jsonRes.timestamp = Date.now();
      console.log(`publishing fresh data at ${jsonRes.timestamp}`);
      ref.set(jsonRes);
    })
    .catch(err => err);
}

setInterval(fetchData, fetchInterval, docRef);

// respond with "hello world" when a GET request is made to the homepage
app.get('/heartbeat', function (req, res) {
  res.sendStatus(200);
})

app.listen(port, () => console.log(`News service running on port ${port}!`))