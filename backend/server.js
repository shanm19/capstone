/* capstone server.js */

// Require packages
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");
//var expressJwt = require("express-jwt");
var path = require("path");
var mongoose = require("mongoose");
var cors = require("cors");
// Config environment variables
//var config = require("./config");
var port = process.env.PORT || 8080;

// Require routes

// Create Server
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(logger("dev"));
app.use(cors());
// Connect to Mongoose
//var database = path.join(config.db_host.config.db_name);
/*mongoose.connect("mongodb://" + config.db_user + ":" + config.db_pass + "@" + database, function(err) {
    if (err) console.log("Error connecting to MongoDB: ", err.message)
    else console.log("Connected to MongoDB " + database);
});*/
mongoose.connect('mongodb://localhost/reddit', function () {
    console.log("Mongoose a go-go!");
});

// Serve up frontend files
app.use(express.static(path.join(__dirname, "..", "/frontend")));

// Routes requiring authentication
//app.use("/api", expressJwt({secret:config.secret}));
//app.use("/api/user", require("./routes/userRouteProtected"));
//app.use("/api/admin", require("./routes/adminRoute"));
//app.use("/api/post", require("./routes/postRouteProtected"));
//app.use("/api/subreddit", require("./routes/subredditRouteProtected"));
//app.use("/api/comment", require("./routes/commentRouteProtected"));

// Routes without authentication
//app.use("/auth", require("./routes/authRoute"));
app.use("/post", require("./routes/postRoute"));
//app.use("/subreddit", require("./routes/subredditRoute"));
//app.use("/comment", require("./routes/commentRoute"));

app.listen(port, function() {console.log("Server is listening on port", port)});


