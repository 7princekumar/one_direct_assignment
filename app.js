var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var passport = require("passport");
var TwitterStrategy = require("passport-twitter");


//TWITTER
var Twit = require("twit");
var config = require('./config');
var T = new Twit(config);





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
    console.log("TOKEN: "+token);
    console.log("TOKEN SECRET: "+tokenSecret);
    console.log("--------------------------");
    console.log(profile._json);
    console.log("--------------------------");
    return cb( null, profile );
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
    
    T.get('statuses/home_timeline', function(err, data, response){
        if(err){
            console.log(err.message);
        }else{
            // for(var i=0; i<data.length; i++){
            //     console.log(data[i].text);       
            // }
            console.log("Timeline received.");
        }
    });
});






//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});