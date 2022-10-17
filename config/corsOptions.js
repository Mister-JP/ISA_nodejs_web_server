//cross origin resource sharing
//127.0.0.1 == localhost
const whitelist =[
    'https://www.yoursite.com', 
    'http://127.0.0.1:5500', 
    'http://localhost:3500'
]; //whatever webapp that we want to give access to to this as backend

const corsOptions ={
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) != -1 || !origin){
            callback(null, true)
        } else{
            callback(new Error('Not allowed by CORS'))
        }
    },
    optionsSuccessStatus: 200
}

module.exports = corsOptions;