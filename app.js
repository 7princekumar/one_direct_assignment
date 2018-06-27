var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter");

//DB Setup
var mongoose = require('mongoose');
var url = "mongodb://7princekumar:hellofriend1@ds121251.mlab.com:21251/onedirectdb"; //in-case, env is not set up.
mongoose.connect(url);

//SCHEMA
var tweetSchema = new mongoose.Schema({
    tweet_owner_name:       String,
    created_at:        String,
    tweet_id:          String,
    tweet_content_url: String,
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
        var Table = mongoose.model(twitter_username, tweetSchema, twitter_username); //collection-name, schema, forced-collection-name
        // console.log(profile);
        var count = 50;
        oauth.get(
            'https://api.twitter.com/1.1/statuses/home_timeline.json?tweet_mode=extended&count='+count,
            token, //test user token
            tokenSecret, //test user secret            
            function (e, data, res){
                if (e) console.error(e); 
                
                var data_length = JSON.parse(data).length;
                for(var i=0; i<data_length; i++){
                    if((JSON.parse(data)[i].entities.urls).length != 0){
                        // console.log(i+":::"+JSON.parse(data)[i].entities.urls[0].expanded_url);
                        // console.log(JSON.parse(data)[i]);
                        Table.findOne({tweet_id: JSON.parse(data)[i].id_str}, function(err, found_tweet) {
                            if(err){
                                console.log(err);
                            }else{
                                //insert if not
                                if(!found_tweet){
                                    console.log("Not found");
                                }
                            }
                        });
                        
                        
                        Table.create({
                            tweet_owner_name:  JSON.parse(data)[i].user.name,
                            created_at:        JSON.parse(data)[i].created_at,
                            tweet_id:          JSON.parse(data)[i].id_str,
                            tweet_content_url: JSON.parse(data)[i].entities.urls[0].expanded_url,
                        }, function(err, saved_tweet){
                            if(err){
                                console.log(err);
                            }else{
                                console.log("****");
                                console.log(saved_tweet);   
                            }
                        });
                    }
                }
            });    
        
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
    var twitter_user_id = req.body.twitter_user_id;
    console.log("Username: "+twitter_user_id);
    
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