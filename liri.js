//Accessing Twitter and Spotify API keys from keys.js
var keys = require("./keys");

//Accessing the request node module
var request = require("request");

var params = { screen_name: 'nodejs' };
client.get('statuses/user_timeline', params, function (error, tweets, response) {
  if (!error) {
    console.log(tweets);
  }
});