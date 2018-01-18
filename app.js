var express = require('express');
var http = require('http');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index=require('./routes/index');
var home=require('./routes/home');
var signup=require('./routes/signup');
var profile=require('./routes/profile');
var session=require('client-sessions');

var routes = require('./routes');

var app = express();


app.use(session({

    cookieName: 'session',
    secret: 'cmpe273_test_string',
    duration: 30 * 60 * 1000,    //setting the time for active session
    activeDuration: 5 * 60 * 1000,  })); // setting time for the session to be active when the window is open // 5 minutes set currently



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//app.get('/signup',index.signup);
app.get('/',index.index);

app.post('/trylogin',index.trylogin);
app.get('/home',home.home);
app.get('/fetchTweets',home.fetchTweets);
app.get('/getCounts',home.getCountsTFF);

app.post('/setDynamicValuesToProfile', profile.setDynamicValuesToProfile);
app.get('/redirectToProfile', profile.redirectToProfile);
app.get('/fetchProfileInfo', profile.fetchProfileInfo);

app.post('/setSearchValue',home.setSearchValue);
app.get('/openHashPage',home.openHashPage);
app.get('/fetchHashTweets',home.fetchHashTweets);
app.get('/openSearchPage',home.openSearchPage);
app.get('/searchUserName',home.fetchUserWithSearch);

app.post('/followUser',home.followUser);

app.get('/fetchFollowingList',profile.fetchFollowingList);
app.get('/fetchFollowersList',profile.fetchFollowersList);

app.post('/insertTweet',home.insertTweet);

app.get('/signout',index.signout);

app.get('/signup',signup.signup);
app.post('/register',signup.register);


module.exports = app;
