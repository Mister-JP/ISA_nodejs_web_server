require('dotenv').config();
const express = require('express')
const app = express()
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//connect to MongoDB
connectDB();

// custom middle ware logger
//app.use is used to add middleware in the server
app.use(logger);

//Handle options credentials check -before CORS!
// and fetch cookies credentials requirement
app.use(credentials);

//cross origin resources sahring
app.use(cors(corsOptions));
//app.use(cors());//it is open to public api

//built in middleware to handle urlencoded data
//in other words, form-data
app.use(express.urlencoded({extended: false}));

//built-in middleware for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());


//serve static file
app.use(express.static(path.join(__dirname, '/public')));

//routes to different views not in subdirectory
app.use('/', require('./routes/root'));
//registeration of new user
app.use('/register', require('./routes/api/register'));
//Auth of user
app.use('/auth', require('./routes/api/auth'));
//refresh token gets jwt in cookie and genrates accesstoken
app.use('/refresh', require('./routes/api/refresh'));
//logout
app.use('/logout', require('./routes/api/logout'));


//adding auth
app.use(verifyJWT);
//for restapi
app.use('/employees', require('./routes/api/employees'));
//for frontend
app.use('/users', require('./routes/api/users'));


//app.all accepts all http requests
app.all('*', (req,res)=>{
    // //as we want to send costume 404 the express wont know if the file was not found because we ar sending 
    // //custome 404 and express was ablt to find and send it, so we have to add status code in here
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));

    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    }
    else if(req.accepts('json')){
        res.json(res.json({error: "404 Not Found"}));
    }
    else{
        res.type('txt').send("404 not Found");
    }
});

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})

