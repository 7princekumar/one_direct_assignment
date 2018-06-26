var express = require("express");
var app = express();

app.set("view engine", "ejs");

//Routes
app.get("/", function(req, res){
    res.render("home");
});

//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});