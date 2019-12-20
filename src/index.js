const express = require('express');
const app = express();
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

// Setting
app.set('views', path.join(__dirname, 'views'));
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 4000);
require('./passport/local-auth');

// Middlesware
app.use(morgan('dev'));
app.use(express.urlencoded({
    extended: false
}));
app.use(session({
    secret: 'mysecret',
    resave: false,
    saveUninitialized: false
}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

// Import ROUTES
app.use(require('./routes/index'));

// Starting
app.listen(app.get('port'), () => {
    console.log(`Server ON ${app.get('port')}`);
});