var express = require("express");
var hbs = require("express-handlebars");
var bodyParser = require("body-parser");
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var session = require('express-session');

var WaiterRoute = require("./waiter");
const mongoURL = process.env.MONGO_DB_URL || "mongodb://localhost/shifts";
var port = 3002;

let waiterRoute = WaiterRoute();

var app = express();
app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}))
app.use(cookieParser('keyboard cat'));
// app.use(session({ cookie: { maxAge: 60000 }}));
app.use(flash());

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: false }));
app.engine( 'hbs', hbs( { extname: 'hbs', defaultLayout: 'main'}))
app.set( 'view engine', 'hbs' );

app.get('/', waiterRoute.loginScreen);
app.post('/', waiterRoute.login)

app.get('/waiter/:username',waiterRoute.getShift);

app.post('/waiter/:username', waiterRoute.addedDays)

app.get('/days', waiterRoute.daysWithWaiters)

app.listen(port, function () {
    console.log('Example app listening on port ' + port)
});
