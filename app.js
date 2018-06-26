var express = require("express");
var app = express();

//Routes
app.get("/", function(req, res){
    res.send("Hello");
});

//listener
app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server Started!");
});