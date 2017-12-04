//Twitte keys
var twitterKeys = {
  consumer_key: "<8nNRG0ZzswQOfus0CdvhmBPyo>",
  consumer_secret: "<gKuiKJnRzrs5lFx0c8vvDuvuNRCZZJ9lLxnINQTofvjuYWRrPl>",
  access_token_key: "<935653723229048832-yT3R6AZa0LUPxs27nGsDj3gncI2A742>",
  access_token_secret: "<lVSoOuVtUX4po2SvTrYTHi1u3xd4stbfLYy8jG7NeJuYK>"
}

//Spotify keys
var spotifyKeys = {
  id: "53564167998c47c6b10e4fe943b190c7",
  secret: "0df0f3c2b00443acbaa0da08b4fb4005"
}

client.get('search/tweets', { q: 'node.js' }, function (error, tweets, response) {
  console.log(tweets);
});

//exporting the keys
module.exports = twitterKeys;
module.exports = spotifyKeys;