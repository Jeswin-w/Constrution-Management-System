const express = require('express');
const app = express();

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

app.get('/progress.html', function (req, res) {
  res.sendFile(`${__dirname}/progress.html`);
})

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
}
)
app.listen(port, () => console.log('The server running on Port '+port));