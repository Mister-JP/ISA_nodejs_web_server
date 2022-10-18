//cross origin resource sharing
//127.0.0.1 == localhost
const allowedOrigins =[
    'https://www.yoursite.com', 
    'http://127.0.0.1:5500', 
    'http://localhost:3500'
]; //whatever webapp that we want to give access to to this as backend

module.exports = allowedOrigins;