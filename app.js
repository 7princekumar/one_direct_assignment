var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter");


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
        var screen_name = profile.username;
        var count = 100;
        oauth.get(
            'https://api.twitter.com/1.1/statuses/home_timeline.json?tweet_mode=extended&screen_name=' + screen_name + '&count='+count,
            token, //test user token
            tokenSecret, //test user secret            
            function (e, data, res){
                if (e) console.error(e);  
                var data_length = JSON.parse(data).length;
                for(var i=0; i<data_length; i++){
                    if((JSON.parse(data)[i].entities.urls).length != 0){
                        console.log(i+":::"+JSON.parse(data)[i].entities.urls[0].expanded_url);
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






//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});