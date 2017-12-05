// Keys and stuff

const keys = require("./keys.js");

const userInput = process.argv[2];
var userChoice = process.argv.slice(3).join(" ");

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

//Twitter function
function showTweets() {

  //Sets up a reusable instance for using Twitter API through node
  var client = new Twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
  });

  //Saves screen name and tweet count parameters we want out of the API response
  var params = {
    screen_name: 'SladdenNicholas',
    count: 20,
  };

  //Uses node Twitter package to call the API and passes parameters
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (!error) {
      for (var i = 0; i < tweets.length; i++) {

        //Logs the 20 most recent tweets to the terminal
        console.log(`Tweet:      ${tweets[i].text}      //Created: ${tweets[i].created_at}`);

        //Appends the data to log file
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

//Spotify Function
function spotifySong(userChoice) {

  //Sets up a reusable instance for using Spotify API through node
  var spotify = new Spotify({
    id: keys.spotifyKeys.id,
    secret: keys.spotifyKeys.secret,
  });

  //default search
  if (!userChoice) {
    userChoice = "The Sign Ace of Base";
  }

  //Calls the Spotify API with the search criteria taken from terminal
  spotify.search({
    type: 'track',
    query: userChoice,
  }, function (err, data) {
    if (err) {
      console.log(err);
    } else {

      //Logs the desired response to the Terminal
      console.log(`Artist: ${data.tracks.items[0].artists[0].name}
      \nSong's Name: ${data.tracks.items[0].name}
      \nPreview Link: ${data.tracks.items[0].preview_url}
      \nAlbum: ${data.tracks.items[0].album.name}`);


      //Appends the data to log file
      fs.appendFile("log.txt", `\n\n\nSong Search -- ${Date(Date.now()).toString()}
      \n------------------
      \nArtist: ${data.tracks.items[0].artists[0].name}
      \nSong's Name: ${data.tracks.items[0].name}
      \nPreview Link: ${ data.tracks.items[0].preview_url}
      \nAlbum: ${ data.tracks.items[0].album.name}`, "utf8", (err) => {
          if (err) throw err;
          console.log(`Song Search saved to "log.txt"`);
        });
    };
  });
};

//OMDB function
function movieThis(userChoice) {

  //default search
  if (!userChoice) {
    userChoice = "Mr Nobody";
  }

  //Sets the query URL + the search critera to pass through request node package to access OMDB API
  var queryUrl = `http://www.omdbapi.com/?t=${userChoice}&y=&plot=short&apikey=40e9cece`;

  request(queryUrl, function (error, response, body) {

    if (!error && response.statusCode === 200) {

      //Logs the desired response to the Terminal
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

      //Appends the data to log file
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

//Silly function that would never get used
function doCommand() {

  //Reads random.txt file for its contents
  fs.readFile("random.txt", "UTF8", function (error, data) {

    if (error) {
      console.log(error);
    }
    //logs the contents of the file to the Terminal
    console.log(data);

    var dataArr = data.split(",");
    var command = dataArr[0];
    var choice = dataArr[1];

    //Takes whatever "command" is in the file and runs one of the functions accordingly
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

  fs.appendFile("log.txt", `\n\n\nStupid Command Search -- ${Date(Date.now()).toString()}`, "utf8", (err) => {
    if (err) throw err;
    console.log(`I noted that I ran this stupid function in my log file`);

  });
};