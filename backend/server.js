/* capstone server.js */

// Require packages
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
//var expressJwt = require("express-jwt");
var mongoose = require("mongoose");
var path = require('path');

// Config environment variables
// var config = require("./config");
var port = process.env.PORT || 7000;

// Require routes

// Create Server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger("dev"));

// passport
// app.use(passport.initialize());
// require('./app/routes.js')(app, passport);


// Connect to Mongoose
//var database = path.join(config.db_host.config.db_name);
/*mongoose.connect("mongodb://" + config.db_user + ":" + config.db_pass + "@" + database, function(err) {
    if (err) console.log("Error connecting to MongoDB: ", err.message)
    else console.log("Connected to MongoDB " + database);
});*/

// Serve up frontend files
app.use(express.static(path.join(__dirname, '..', '/frontend')));

// Routes requiring authentication
//app.use("/api", expressJwt({secret:config.secret}));

// Routes without authentication
//app.use("/auth", require("./routes/authRoutes");

// Routes without authentication

app.listen(port, function() {console.log("Server is listening on port", port)});


