const express = require("express");
const app = express();
const path = require('path');
const port = 5555;

app.use(express.static(path.join(__dirname, '/build')));
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/build', 'index.html'));
});

app.get('/api/hi',(req,res,next)=>{

    res.json({message : "Hi from Express Server"});

})

app.listen(port, ()=> console.log("Server listening on port " + port));