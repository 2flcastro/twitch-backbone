var express = require('express'),
    path = require('path'),
    morgan = require('morgan'),
    bodyParser = require('body-parser');
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    hbs = require('hbs');

var mainRoutes = require('./routes/main');
    twitchRoutes = require('./routes/twitch');

var app = express();

// Connect to mongoose
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/twitch-backbone');
mongoose.connection.on('open', function() {
  console.log('Connected to mongodb');
});


// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');


// App setup
app.set('port', process.env.PORT || 3000);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'dist')));


// Routes setup
app.use('/', mainRoutes);
app.use('/twitch-api', twitchRoutes);


// Catch 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render error page
  res.status(err.status || 500);
  err.status === 404 ? res.render('404') : res.render('error');
});

process.on('exit', function() {
  mongoose.disconnect();
});

app.listen(app.get('port'), function() {
  console.log('Express running...');
  console.log('Env: ' + app.get('env'));
  console.log('Port: ' + app.get('port'));
});

module.exports = app;
