const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const exphbs = require('express-handlebars');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const { Cookie } = require('express-session');
const MongoStore = require('connect-mongo');
//Load config file
dotenv.config({ path: './config/config.env'});

//Load passport config
require('./config/passport')(passport);

//Connect to database
connectDB();

const app = express();

//body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Logging middleware
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Handlebars helpers
const {formatDate, stripTags, truncate} = require('./helpers/hbs');
//Handlebars Middleware
app.engine('.hbs', exphbs.engine({
    helpers: {
        formatDate,
        stripTags,
        truncate
    },
    defaultLayout: 'main',
    extname: '.hbs' 
})
);
app.set('view engine', '.hbs');

//Session Middleware
app.use(
    session({
    secret: 'acorn developer',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
    })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//Set CSS folder
app.use(express.static(path.join(__dirname, 'public')));
//Routes
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
})