const express = require('express');
const session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const dashboard = require('./controllers/dashboard');
var login = require('./controllers/login');
var company = require('./controllers/company');
var Net=require('net');
var server = express();
var router = express.Router();

server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'ejs');
server.use('/assets', express.static('assets'));
server.use(session({
    secret: 'acums undefined',
    resave: false,
    saveUninitialized: true,
}));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
    extended: true
}));

server.use('/', router);

login(router);
dashboard(router);
company(router);
router.get('/', function (req, res, next) {
    res.redirect('/dashboard');
});

server.listen('3000');