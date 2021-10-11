var http = require('http');
var url = require('url');
var fs = require('fs');
const { parse } = require('querystring');
var MongoClient = require('mongodb').MongoClient;
var url1 = "mongodb://localhost:27017/";


http.createServer(function (req, res) {
  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  if (filename=="./" || filename=="./reg")
  {
    filename="./user.html";
  }
  
  fs.readFile(filename,  function(err, data) {
      
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    res.write(data);
    return res.end();
  });
  if (req.method == 'POST' && req.url=="/login.html") {
    console.log(req.url);
    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    });
    req.on('end', () => {
        var obj=parse(body);
        MongoClient.connect(url1, function(err, db) {
          if (err) throw err;
          var dbo = db.db("cms");
          
          dbo.collection("customers").insertOne(obj, function(err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            console.log(filename);
            db.close();
          });
          
        });
        
  
        
    });
}

if (req.method === 'POST' && req.url=="/user.html") {
  let body = '';
  req.on('data', chunk => {
      body += chunk.toString();
  });
  req.on('end', () => {
      var obj=parse(body);
      MongoClient.connect(url1, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cms");
        
        dbo.collection("customers").find(obj).toArray(function(err, result) {
          if (err) throw err;
          user=result;
          console.log(user);
          
          db.close();
        });
      });
    
    });



}
  
}).listen(8080);




