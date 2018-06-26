var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Routes
app.get("/", function(req, res){
    res.render("home");
});

app.post("/", function(req, res){
    var twitter_user_id = req.body.twitter_user_id;
    console.log(twitter_user_id);
});

//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});