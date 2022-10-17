const express = require('express');
const router = express.Router();
const path = require('path');

//Route handlers
router.get('^/$|/index(.html)?', (req,res)=>{
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, '..',' views', 'index.html'));
});

router.get('/new-page(.html)?', (req,res)=>{
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, '..', 'views', 'new-page.html'));
});

router.get('/old-page(.html)?', (req, res)=>{
    //we will ake the status code as 301 
    // because the default one that express sens is 302 which is will not tell
    //browser that this is permanent re-route but 301 will
    res.redirect(301, '/new-page.html');
});

module.exports = router;