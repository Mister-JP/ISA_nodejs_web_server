const express = require('express');
const router = express.Router();
const path = require('path');

//Route handlers
router.get('^/$|/index(.html)?', (req,res)=>{
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, '..',' views', 'index.html'));
});


module.exports = router;