var fs = require('fs');
var Twitter = require('twitter');
var keys = require('./keys.js')
var spotify = require('spotify');
var request = require('request');

 
var action = process.argv[2];
var value = process.argv[3];
var logData = "";


function processArgs() {
switch(action){
    case 'my-tweets':
        getTweets();
        break;
    case 'spotify-this-song':
        searchSpotify();
        break;
    case 'movie-this':
        searchMovie();
        break;
    case 'do-what-it-says':
        readFileExecute();
        break;
  }
}

processArgs();

function getTweets() { 

var twitter = new Twitter(keys.twitterKeys);
twitter.get('statuses/user_timeline', {screen_name: 'biggiehnj', count: 20}, function(err, tweets, response){
  if (!err && response.statusCode == 200) {
    console.log("------------------------------------------");
    console.log(" " + " " + "These are my last 20 tweets" + " " + " ")
    console.log("------------------------------------------");
    for (var i = 0; i < tweets.length; i++) {
      console.log(tweets[i].created_at + " " + tweets[i].text)
      logData = [tweets[i].created_at + " " + tweets[i].text + "," + " "];
    writeLog();
    }
  }
});
}

function searchSpotify() {
var value = process.argv[3] || "i want it that way";
spotify.search({ type: 'track', query: value }, function(err, data) {
    if (!err) {
      console.log("------------------------------------------");
      console.log(" " + " " + "These are the results from Spotify" + " " + " ")
      console.log("------------------------------------------");
      console.log('Artist(s): ' + data.tracks.items[0].artists[0].name)
        console.log('Song Name: ' + data.tracks.items[0].name);
        console.log('Preview Link: ' + data.tracks.items[0].preview_url);
        console.log('Album: ' + data.tracks.items[0].album.name);
        logData = {Artists: data.tracks.items[0].artists[0].name, songName: data.tracks.items[0].name, previewLink: data.tracks.items[0].preview_url, Album: data.tracks.items[0].album.name};
    writeLog();
    }
 });
}


function searchMovie() {
  var value = process.argv[3] || "Mr. Nobody";
  var options =  { 
    url: 'http://www.omdbapi.com/',
    qs: {
      t: value,
      plot: 'short',
      r: 'json',
      tomatoes: true
    }
  }
  request(options, function(err, response, body) {
  if (!err && response.statusCode == 200) {
    body = JSON.parse(body);
    console.log("------------------------------------------");
      console.log(" " + " " + "The are the OMDB Results" + " " + " ")
      console.log("------------------------------------------");
    console.log("Title: " + body.Title);
    console.log("Year: " + body.Year);
    console.log("IMDB Rating: " + body.imdbRating);
    console.log("Country: " + body.Country);
    console.log("Language: " + body.Language);
    console.log("Plot: " + body.Plot);
    console.log("Actors :" + body.Actors);
    console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
    console.log("Rotten Tomatoes URL: " + body.tomatoURL);
    logData = {Title: body.Title, Year: body.Year, ImdbRating: body.imdbRating, Country: body.Country, Language: body.Language, Plot: body.Plot, Actors: body.Actors, rottenTomatoesRating: body.tomatoRating, rottenTomatoesUrl: body.tomatoURL};
    writeLog();

}
})
}


function readFileExecute() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (!error) {
      var textArgs = data.split(',');
          action = textArgs[0];
    value = textArgs[1];
    processArgs();
    }

  })
};

function writeLog() {
  fs.appendFile('log.txt', JSON.stringify(logData, null, "\t"), (err) => {
    if ( err ) {
        console.log('Error occurred: ' + err);
        return;
    }
})
}