var express            = require("express");
var bodyParser         = require("body-parser");
var morgan             = require("morgan");

var app                = express();


app.set("port", process.env.PORT || 3000);


app.use(morgan('dev') ); // Log every request to console
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(bodyParser.json());


app.use(express.static(__dirname + './../public/'));

app.listen(app.get("port"), function () {
  console.log("Express server listening on port " + app.get("port"));
});
