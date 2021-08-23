//var http = require('http');
const fs = require('fs');
const express = require('express');
const sessions = require('express-session');
const app = express();
const PORT = 8080;

app.use(sessions({
  secret: "huskyhusky",
  saveUninitialized:true,
  resave: false
}));

// parse message as json
app.use(express.urlencoded({ extended: true }));
//default dir
app.use(express.static(__dirname));

// process post req
app.post('/',(req,res) => {
  session=req.session;
  var body = "";
  for (data in req.body)
    body = data + ', "session":"'+session.id+'"}\n';
  fs.appendFile('logs.log', body, err => {
      if (err)
        console.log("Error: "+err);
  });
  res.sendFile('page.html',{root:__dirname})
});

// log collection page
app.get('/',(req,res) => {
  res.sendFile('page.html',{root:__dirname});
});

//content page
app.get('/content',(req,res) => {
    //TODO: if condition return page
    res.sendFile('content.html',{root:__dirname});
});

app.listen(PORT, () => console.log(`Server Running at http://localhost:${PORT}`));