const express = require('express')
const app = express()
const path = require('path');
const PORT = process.env.PORT || 3500;

//Route handlers
app.get('^/$|/index(.html)?', (req,res)=>{
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/new-page(.html)?', (req,res)=>{
    // res.send('Hello World!');
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
});

app.get('/old-page(.html)?', (req, res)=>{
    //we will ake the status code as 301 
    // because the default one that express sens is 302 which is will not tell
    //browser that this is permanent re-route but 301 will
    res.redirect(301, '/new-page.html');
})

app.get('/*', (req,res)=>{
    //as we want to send costume 404 the express wont know if the file was not found because we ar sending 
    //custome 404 and express was ablt to find and send it, so we have to add status code in here
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));

})

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));