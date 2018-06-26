var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//TWITTER
var Twit = require("twit");
var config = require('./config');
var T = new Twit(config);


//Routes
app.get("/", function(req, res){
    res.render("home");
});

app.post("/", function(req, res){
    var twitter_user_id = req.body.twitter_user_id;
    console.log("Username: "+twitter_user_id);
    
    T.get('followers/ids', { screen_name: twitter_user_id },  function (err, data, response) {
        if(err){
            console.log(err.message);
            console.log("Invalid username. Try a different one.");
        }else{
            console.log(data);
        }
    });
});

//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});