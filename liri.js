
var fs = require('fs');
var request = require('request');
var spotify = require('spotify');
var Twitter = require('twitter');
var readline = require('readline');
var twitterKeys = require('./keys.js').twitterKeys;

function showTweets(){

  var screenName ='biggiehnj';
  
  var client = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret 
  });
   
  var params = {screen_name:'biggiehnj', count:21};

  client.get('statuses/user_timeline', params, function(error, tweets, response) {

    var output = '';
    if (error) return console.log(error);
  
      tweets.forEach(function(tweet){
        output += screenName+': ' + tweet.text+" Tweeted on: "+tweet.created_at+'\n';
      });

      log('myTweets',null,output);
    
  });

  
}

function showSongInfo(songName){
  var song;
  (songName) ? song = songName : song = 'The Sign, Ace of Base';
  var queryString = song + '&limit=1&offset=0';

  spotify.search({ type: 'track', query: queryString }, function(err, data) {
      var output = '';
      if ( err ) {
          return console.log('Uh oh: ' + err);
       }

    output += 'Song Name: '+data.tracks.items[0].name+'\n';
    output += 'Artists: '+data.tracks.items[0].artists[0].name+'\n';
    output += 'Album: '+data.tracks.items[0].album.name+'\n';
    output += 'Preview link: '+data.tracks.items[0].preview_url+'\n';
    
    log('spotify-this-song',songName,output);
  });
}
 

function showMovieInfo(movieName){

  var movie;
  (movieName)? movie = movieName : movie= 'Mr. Nobody.';

  request('http://www.omdbapi.com/?t='+movie+'&y=&plot=short&tomatoes=true&r=json','utf8',function(err,response,body){
    var output = '';

    if(err) {
      return console.log('Cannot find from omdb ' +err);
    }
      body = JSON.parse(body);

      output += 'Title of the movie: '+body.Title+'\n';
    output += 'Release Year : '+body.Year+'\n';
    output += 'IMDB Rating : '+body.imdbRating+'\n';
    output += 'Country of production:'+body.Country+'\n';
    output += 'Language: '+body.Language+'\n';
    output += 'Plot: '+body.Plot+'\n';
    output += 'Actors: '+body.Actors+'\n';
    output += 'Rotten Tomatoes Rating: '+body.tomatoRating+'\n';
    output += 'Rotten Tomatoes URL: '+body.tomatoURL+'\n';

    log('movie-this',movieName,output);
  });

}


function randomCommand(){

  fs.readFile('./random.txt','utf8', function(err, data){
    if (err) throw err;

    var tempArgArray = data.split(',');
    var command = tempArgArray[0];
    var arg = tempArgArray[1];
      liri(command, arg);
  });

  log('do-what-it-says','','');

}

function log(command,arg,output){
  var str = '';
  
  if(output){ 
    console.log(output);
    }
  str += command+' '+arg+'\n';
  str += output;

  if(output){
    str += '---------------------------------------------'+'\n';
  }
  
  fs.appendFile('./log.txt',str, function(err,data){
    if(err) return console.log(err);
    });
}


function liri(command,arg){

    switch(command){

    case 'myTweets':
        showTweets();
        break;

    case 'spotify-this-song':
        showSongInfo(arg); 
        break;

    case 'movie-this':
        showMovieInfo(arg);
        break;

    case 'do-what-it-says':
        randomCommand();
        break;
    case  undefined:

       var output = 'Not sure what you mean.  Please try movie-this, myTweets or spotify-this-song'+'\n';
       log(command,arg,output);
       break;

    default :
       var output = 'Not sure what you mean. Please try movie-this, myTweets or spotify-this-song'+'\n';
       log(command,arg,output);
       break; 
  }
}


liri(process.argv[2], process.argv.slice(3,process.argv.length).join(' '));