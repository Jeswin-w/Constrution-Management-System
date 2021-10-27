const express = require('express');
const app = express();
var ObjectId = require('mongodb').ObjectId;

var url1 = "mongodb://localhost:27017/";
 

var MongoClient = require('mongodb').MongoClient;
const port = 3005;

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static('images'));
app.use(express.static('scripts'));

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/user.html`);
})
app.get('/user.html', function (req, res) {
  
  
  res.cookie("email",req.query.em).sendFile(`${__dirname}/user.html`);
  res.clearCookie("_id");
  
})

app.get('/reg.html', function (req, res) {
  res.sendFile(`${__dirname}/reg.html`);
})
app.get('/login.html', function (req, res) {
  res.sendFile(`${__dirname}/login.html`);
})
app.get('/getwork.html', function (req, res) {
  
  var f="/getwork.html";
  if (req.cookies["email"]=="undefined")
  {
    f="/login.html"
  }
  res.sendFile(`${__dirname}${f}`);
})

app.get('/progress.html', async function (req, res) {
  
  var obj=req.cookies;
  console.log(obj);
  var t;
 

    async function findOne() {
      const client = await MongoClient.connect(url1, { useNewUrlParser: true }).catch(err => { console.log(err); });
  
      if (!client) {
          return;
      }
      try {
          const db = client.db("cms");
          let collection = db.collection('task');
          t = await collection.find(obj).toArray();
          console.log(t);
      } catch (err) {
          console.log(err);
  
      } finally {
          client.close();
      }
  }
  await findOne();
  
  console.log(t);
  res.write(`<!DOCTYPE html>
    <html>
    <head>
    <title>filter</title>
    
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.6.9/angular.min.js"></script>
    <script type="text/javascript" src="scripts/work.js"></script> 
    <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"></script>
        <link rel="stylesheet" href="usestyle.css">
        
    </head>
    <body ng-app="myApp">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">

        <a class="navbar-brand" href="#">Winn Constructions</a>


        <ul class="navbar-nav justify-content-end">
            <li class="nav-item">
                <a class="nav-link" aria-current="page" href="user.html">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link " href="getwork.html">Task</a>
            </li>
            <li class="nav-item">
                <a class="nav-link active" href="#">Progress</a>
              </li>
        </ul>

    </div>
</nav>
        
        <h3 style="text-align:center">Tasks</h3><br><br>
        <div class="container">
        <h4>
        
        
        `)
    
    for (var i in t)
    {
        
        res.write(`<div class='container' style="background-color:black;color:white;border-radius:25px"> Task ${parseInt(i)+1}`);
        res.write(`<br>Desc: ${t[i]["desc"]}<br>`)
        res.write(`<form method='post' action='/ed?id=${t[i]["_id"]}'><br><label> change desc<br></label><input class='form-control' type='text' name='desc'><br><center><input class="btn btn-primary" type='submit' value='edit'></center><br></form></div><hr style="color:white"><br>`);
        

    }
    res.write(`</h4>
    </div>
    </body>
    </html>`)
    res.end();
  })
  
app.post('/ed', (req, res) => {
  var id=req.query["id"];
  console.log(id);
  var obj1={};
  obj1["_id"]=ObjectId(id);
  var obj2={$set: req.body};
  console.log(obj1);
  console.log(obj2);
  MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cms");
  dbo.collection("task").updateOne(obj1, obj2, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
    db.close();
  });
});
  res.send(`<script>window.location.href = 'progress.html';</script>`);
  res.end();
});


  


app.post('/reg', (req, res) => {
   
  var obj=req.body;
  
  MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cms");
    
    dbo.collection("customers").insertOne(obj, function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      
      db.close();
    });
    
  });
  res.send(`<script>window.location.href = 'login.html';</script>`);
 res.end();
})

app.post('/login',async (req, res) => {
  var obj=req.body;
  var user;
  var str;
  async function findOne() {
    const client = await MongoClient.connect(url1, { useNewUrlParser: true }).catch(err => { console.log(err); });

    if (!client) {
        return;
    }
    try {
        const db = client.db("cms");
        let collection = db.collection('customers');
        user = await collection.find(obj).toArray();
        
    } catch (err) {
        console.log(err);

    } finally {
        client.close();
    }
}
await findOne();
  if (user.length==0)
  {
    str="<script>window.alert('wrong password or email');window.location.href = 'login.html';</script>";
  }
  else
  {
    str=`<script>window.location.href = 'user.html?em=${user[0]["email"]}';</script>`;
    
  }
  res.send(str);
 res.end();
})

app.post('/task',async (req,res) => {
  var obj=req.body;
 
  var obj1=req.cookies;
  delete obj1["_id"];
  
  
  async function findOne() {
    const client = await MongoClient.connect(url1, { useNewUrlParser: true }).catch(err => { console.log(err); });

    if (!client) {
        return;
    }
    try {
        const db = client.db("cms");
        let collection = db.collection('customers');
        user = await collection.find(obj1).toArray();
        
    } catch (err) {
        console.log(err);

    } finally {
        client.close();

    }

}
await findOne();
console.log(user);
  delete user[0]["pwd"];
  user[0]["add"]=obj["add"];
  user[0]["desc"]=obj["desc"];
  delete user[0]["_id"];
 
  MongoClient.connect(url1, function(err, db) {
    if (err) throw err;
    var dbo = db.db("cms");
    
    dbo.collection("task").insertOne(user[0], function(err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      
      db.close();
    });
    
  });
  res.send(`<script>window.location.href = 'user.html';</script>`);
 res.end();
})
app.listen(port, () => console.log('The server running on Port '+port));