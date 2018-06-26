var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter");


//TWITTER
var Twitter = require('twitter');



//SETUP
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "One-Direct Assignment Project",
    resave: false,
    saveUninitialized: false
}));

//SETUP Passport
app.use(passport.initialize());
app.use(passport.session());


//Configure stratergy
passport.use(new TwitterStrategy({
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "https://sit-a7princekumar.c9users.io/auth/twitter/callback"
  },
    function(token, tokenSecret, profile, cb) { 
        var client = new Twitter({
           consumer_key: process.env.TWITTER_CONSUMER_KEY,
           consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
           access_token_key: token,
           access_token_secret: tokenSecret
        });
     
        // var params = {screen_name: 'nodejs'};
        client.get('statuses/user_timeline', function(error, tweets, response) {
            if (!error) {
                for(var i=0; i<tweets.length; i++){
                    console.log("["+(i+1)+"]"+tweets[i].text);
                    console.log("--------------------------");
                }
            }
        });
        
        // return cb( null, profile );
    }
));





//Routes
//HOME
app.get("/", function(req, res){
    res.render("home");
});


//Authenticates app to use users' data
app.get('/auth/twitter',
  passport.authenticate('twitter'));


//handle authentication-callback
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  }
);


//handle user-input
app.post("/", function(req, res){
    var twitter_user_id = req.body.twitter_user_id;
    console.log("Username: "+twitter_user_id);
    
});






//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});