const express = require('express');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/referral');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const Token = require('./models/Token');
var CoinPayments = require('coinpayments');


const app = express(); // initialize express into app
app.use(cors()); // enabling all cors
app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

// body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// const db = mongoose.connection;

// passport middleware
app.use(passport.initialize());

// passport config
require('./config/passwort')(passport);

const users = require('./routes/users');
const payments = require('./routes/payments');

// use of routes
app.use('/api/users', users);
app.use('/api/payments', payments);

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('hello'));

app.listen(port, () => {
    console.log(`Server running on ${port}`)
});