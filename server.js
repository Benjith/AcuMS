const express = require('express');
const session = require('express-session');
const dashboard = require('./controllers/dashboard');
var login = require('./controllers/login');
var server = express();

server.set('view engine', 'ejs');
server.use('/assets', express.static('assets'));
server.use(session({
    secret: 'acums_undefined',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: true
    }
}));

login(server);
var sess;
server.get('*', function (req, res) {
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.email) {
        next();
    } else {
        res.redirect('/login');
    }
});
dashboard(server);

server.listen(8011);