var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter");


//
var entered_username = "";


//DB Setup
var mongoose = require('mongoose');
var url = "mongodb://7princekumar:hellofriend1@ds121251.mlab.com:21251/onedirectdb"; //in-case, env is not set up.
mongoose.connect(url);
const beautifyUnique = require('mongoose-beautiful-unique-validation');


//SCHEMA
var tweetSchema = new mongoose.Schema({
    tweet_owner_name:  String,
    created_at:        String,
    tweet_id:          String,
    tweet_content_url: {
        type: String,
        unique: true
    }
});


//MODELS


//TWITTER-OAUTH
var OAuth = require('oauth');
var oauth = new OAuth.OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      process.env.TWITTER_CONSUMER_KEY,
      process.env.TWITTER_CONSUMER_SECRET,
      '1.0A',
      null,
      'HMAC-SHA1'
    );



//SETUP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "One-Direct Assignment Project",
    resave: false,
    saveUninitialized: false
}));



//Configure stratergy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://sit-a7princekumar.c9users.io/auth/twitter/callback",
  },
    function(token, tokenSecret, profile, cb) { 
        var twitter_username = profile.username;
        //validate
        if(entered_username.toLowerCase() != twitter_username.toLowerCase()){
            console.log("Given username did not match. Try logging out from twitter first.");
        }else{
            var Table = mongoose.model(twitter_username, tweetSchema, twitter_username); //collection-name, schema, forced-collection-name
            // console.log(profile);
            var count = 10; //max 200
            oauth.get(
                'https://api.twitter.com/1.1/statuses/home_timeline.json?tweet_mode=extended&count='+count,
                token, //test user token
                tokenSecret, //test user secret            
                function (e, data, res){
                    if (e) console.error(e); 
                    
                    var data_length = JSON.parse(data).length;
                    for(var i=0; i<data_length; i++){
                        if((JSON.parse(data)[i].entities.urls).length != 0){
    
                            var newTweet = new Table({
                                tweet_owner_name:  (JSON.parse(data))[i].user['name'],
                                created_at:        (JSON.parse(data))[i].created_at,
                                tweet_id:          (JSON.parse(data))[i].user['id'],
                                tweet_content_url: ((JSON.parse(data))[i].entities['urls'][0])['expanded_url']
                            });
                            
                            newTweet.save()
                                .then(() => console.log('Saved new-data!'))
                                .catch(err => {console.log("Duplicate data, not saved!"); });
                        }
                    }
                });    
        }
        
        return cb(null, profile);
    }
));


//SETUP Passport
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, cb){
   cb(null, user); 
});
passport.deserializeUser(function(user, cb){
   cb(null, user); 
});


//Routes
//HOME
app.get("/", function(req, res){
    res.render("home");
});


//Authenticates app to use users' data
app.get('/auth/twitter',
  passport.authenticate('twitter'));


//handle authentication-callback
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


//handle user-input
app.post("/", function(req, res){
    entered_username = req.body.entered_username;
    console.log("Username: "+entered_username);
    res.redirect('/auth/twitter');
});



app.get("/logout", function(req, res){
    req.logout();
    req.session.destroy();
    res.redirect('/');
});


//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});