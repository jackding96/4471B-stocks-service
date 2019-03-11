const redis = require('redis');

const options = {port: 8080};
sub = redis.createClient(options);

sub.subscribe("stocks");

sub.on("message", function (channel, message) {
  console.log("sub channel " + channel + ": " + message);
});