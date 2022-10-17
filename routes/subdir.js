const express = require('express');
const router = express.Router();
const path = require('path');

//Route handlers
router.get('^/$|/index(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir','index.html'));
});

//Route handlers
router.get('/test(.html)?', (req,res)=>{
    res.sendFile(path.join(__dirname, '..', 'views', 'subdir','test.html'));
});

module.exports = router;