var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan'); //mostra un log della chiamal'api
var cors = require('cors')
var app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/Esame');
var users = require('./routes/users');
var transactions = require('./routes/transactions');
app.use(cors())
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use('/', users);
app.use('/transactions', transactions);




var port = 3001;
app.listen(port, ()=>
{console.log("server start at port:", port)})
module.exports = app;
