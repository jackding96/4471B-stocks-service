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
var docRef = db.collection('services').doc('currency');

async function fetchData(ref){
  return rp('https://api.exchangeratesapi.io/latest?base=USD&fbclid=IwAR0xDcwkl0tu2io99pyeQLsmyOLaX5b6FsZ9zRG4IZ-JP-0ThMEMWs3xKlk')
    .then(res => {
      jsonRes = JSON.parse(res);
      // console.log(jsonRes);
      jsonRes.timestamp = Date.now();
      // console.log(`publishing fresh data at ${jsonRes.timestamp}`);
      ref.set(jsonRes);
      return jsonRes;
    })
    .catch(err => err);
}

setInterval(fetchData, fetchInterval, docRef);

app.get('/heartbeat', function (req, res) {
  res.sendStatus(200);
})

app.listen(port, () => console.log(`Currency service running on port ${port}!`))

module.exports = {
  fetchData
};