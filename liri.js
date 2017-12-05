// Keys and stuff

const keys = require("./keys.js");

const userInput = process.argv[2];
const userChoice = process.argv.slice(3).join(" ");

const Twitter = require("twitter");
const Spotify = require('node-spotify-api');

const request = require("request");
const fs = require('fs');

// Switch case for node commands

switch (userInput) {
  case "my-tweets":
    showTweets();
    break;

  case "spotify-this-song":
    spotifySong(userChoice);
    break;

  case "movie-this":
    movieThis(userChoice);
    break;

  case "do-what-it-says":
    doCommand();
    break;
};

// Command functions

function showTweets() {

  //Uses
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  var params = {
    screen_name: 'SladdenNicholas',
    count: 20,
  };

  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {
        console.log(`Tweet:      ${tweets[i].text}      //Created: ${tweets[i].created_at}`);

        fs.appendFile("log.txt", `\n\n\nTwitter Search -- ${Date(Date.now()).toString()}
        \n------------------
        \nTweet:      ${tweets[i].text}      //Created: ${tweets[i].created_at}`, "utf8", (err) => {
          if (err) throw err;

        });
      }
    } else {
      console.log(error);
    };

    console.log(`Twitter Search saved to "log.txt"`);
  });



};

function spotifySong(userChoice) {

  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret,
  });

  if (!userChoice) {
    userChoice = "The Sign Ace of Base";
  }

  spotify.search({
    type: 'track',
    query: userChoice,
  }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
    } else {
      console.log(`Artist: ${data.tracks.items[0].artists[0].name}
      \nSong's Name: ${data.tracks.items[0].name}
      \nPreview Link: ${data.tracks.items[0].preview_url}
      \nAlbum: ${data.tracks.items[0].album.name}`);

      fs.appendFile("log.txt", `\n\n\nSong Search -- ${Date(Date.now()).toString()}
      \n------------------
      \nArtist: ${data.tracks.items[0].artists[0].name}
      \nSong's Name: ${data.tracks.items[0].name}
      \nPreview Link: ${ data.tracks.items[0].preview_url }
      \nAlbum: ${ data.tracks.items[0].album.name}`, "utf8", (err) => {
        if (err) throw err;
        console.log(`Song Search saved to "log.txt"`);
      });
    };
  });
};

function movieThis(userChoice) {

  if (!userChoice) {
    userChoice = "Mr Nobody";
  }

  var queryUrl = `http://www.omdbapi.com/?t=${userChoice}&y=&plot=short&apikey=40e9cece`;

  console.log(queryUrl);

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      console.log(`---------YOUR MOVIE!---------------------
      \nTitle: ${JSON.parse(body).Title}
      \nRelease Year: ${JSON.parse(body).Year}
      \n${JSON.parse(body).Ratings[0].Source} Rating: ${JSON.parse(body).Ratings[0].Value}
      \n${JSON.parse(body).Ratings[1].Source} Rating: ${JSON.parse(body).Ratings[1].Value}
      \n${JSON.parse(body).Ratings[2].Source} Rating: ${JSON.parse(body).Ratings[2].Value}
      \nCountry Produced: ${JSON.parse(body).Country}
      \nPlot: ${JSON.parse(body).Plot}
      \nActors: ${JSON.parse(body).Actors}
      \n------------------------------------------------------------`);

      fs.appendFile("log.txt", `\n\n\nMovie Search -- ${Date(Date.now()).toString()}
      \n------------------
      \nTitle: ${JSON.parse(body).Title}
      \nRelease Year: ${JSON.parse(body).Year}
      \n${JSON.parse(body).Ratings[0].Source} Rating: ${JSON.parse(body).Ratings[0].Value}
      \n${JSON.parse(body).Ratings[1].Source} Rating: ${JSON.parse(body).Ratings[1].Value}
      \n${JSON.parse(body).Ratings[2].Source} Rating: ${JSON.parse(body).Ratings[2].Value}
      \nCountry Produced: ${JSON.parse(body).Country}
      \nPlot: ${JSON.parse(body).Plot}
      \nActors: ${JSON.parse(body).Actors}`, "utf8", (err) => {
        if (err) throw err;
        console.log(`Movie Search saved to "log.txt"`);
      });
    } else {
      console.log(error);
    }
  });
};

function doCommand() {
  fs.readFile("random.txt", "UTF8", function (error, data) {

    if (error) {
      console.log(error);
    }
    console.log(data);

    var dataArr = data.split(",");
    var command = dataArr[0];
    var choice = dataArr[1];

    if (command === "spotify-this-song") {
      userChoice = choice;
      spotifySong(userChoice);
    } else if (command === "movie-this") {
      userChoice = choice;
      movieThis();
    } else if (command === "my-tweets") {
      showTweets();
    }
  });
};