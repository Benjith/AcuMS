var express = require('express');  
var path = require('path');  
var app = express();  
var router = express.Router();

app.set('views', path.join(__dirname, 'views'));  
app.set('view engine', 'ejs');

app.use(router);  
app.use(express.static(path.join(__dirname, 'public')));

router.all('/', function (req, res, next) {  
  console.log('Someone made a request!');
  next();
});

router.get('/', function (req, res) {  
  res.render('login');
});

app.listen(8011);  
module.exports = app; 