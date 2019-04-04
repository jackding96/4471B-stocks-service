const stocks = require('./stocks');

var admin = require("firebase-admin");
const db = admin.firestore();
var docRef = db.collection('services').doc('stocks');

test('Test data fetch', async () => {
  expect(await stocks.fetchData(docRef)).toHaveProperty('res');
});