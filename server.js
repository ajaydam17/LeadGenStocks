const http = require('http');
const fs = require('fs');
const express = require('express');
const sessions = require('express-session');
const app = express();
const PORT = 8080;

app.use(function (req, res, next) {
  //Enabling CORS
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    next();
  });

app.use(sessions({
  secret: "eybeseadei",
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
  for (_body in req.body)
    http.get('http://www.geoplugin.net/json.gp', function (res){
      var data = "";
      res.on("data", function (chunk) {
        data += chunk;
      });
      res.on("end", function () {
        let dt = new Date();
        var ip = JSON.parse(data).geoplugin_request;
        var city =  JSON.parse(data).geoplugin_city; 
        var country = JSON.parse(data).geoplugin_countryName;
        body = _body +'"ip": "' + ip + '", "country": "'+
          country + '", "city": "'+ city + '", "session": "' + session.id + '"}\n';
        fs.appendFile('logs.log', body, err => {
            if (err)
              console.log("Error: "+err);
        });
      });
    });
});

// log collection page
app.get('/',(req,res) => {
  session=req.session;
  http.get('http://www.geoplugin.net/json.gp', function (res){
    var data = "";
    res.on("data", function (chunk) {
      data += chunk;
    });
    res.on("end", function () {
      let dt = new Date();
      var ip = JSON.parse(data).geoplugin_request;
      var city =  JSON.parse(data).geoplugin_city; 
      var country = JSON.parse(data).geoplugin_countryName;
      body = '{"message": "GET /", "time": "'+dt.toUTCString()+'", "ip": "' + ip + '", "country": "'+
      country + '", "city": "'+ city + '", "session": "' + session.id + '"}\n'; 
      fs.appendFile('logs.log', body, err => {
        if (err)
          console.log("Error: "+err);
      });
    });
  });
  res.sendFile('home.html',{root:__dirname});
});

//content page
app.get('/content',(req,res) => {
  session=req.session;
  http.get('http://www.geoplugin.net/json.gp', function (res){
    var data = "";
    res.on("data", function (chunk) {
      data += chunk;
    });
    res.on("end", function () {
      let dt = new Date();
      var ip = JSON.parse(data).geoplugin_request;
      var city =  JSON.parse(data).geoplugin_city; 
      var country = JSON.parse(data).geoplugin_countryName;
      body = '{"message": "GET /content?company='+ req.query.company+'", "time": "'+dt.toUTCString()+'", "ip": "' + ip + '", "country": "'+
      country + '", "city": "'+ city + '", "session": "' + session.id + '"}\n'; 
      fs.appendFile('logs.log', body, err => {
        if (err)
          console.log("Error: "+err);
      });
    });
  });
  
  res.sendFile('content.html',{root:__dirname, title: req.query.company});
});

app.listen(PORT, () => console.log(`Server Running at http://localhost:${PORT}`));