const express = require('express');
const app = express();
var ObjectId = require('mongodb').ObjectId
var url1 = "mongodb://localhost:27017/";
 

var MongoClient = require('mongodb').MongoClient;
const port = 3006;

var cookieParser = require('cookie-parser');
app.use(cookieParser());
app.use(express.urlencoded({
  extended: true
}))
app.use(express.static('images'));
app.use(express.static('scripts'));
app.use('/adminlogin.html', function (req, res) {
    res.sendFile(`${__dirname}\\adminlogin.html`);
  })
  app.post('/as',async function (req, res) {
    console.log(req.query.id);
    res.send(`<script>window.location.href="assign.html?id=${req.query.id}"</script>`)
    res.end();


  })
  app.get('/assign.html', async function (req, res) {
      console.log(req.query.id);
    res.cookie("_id",req.query.id).sendFile(`${__dirname}/assign.html`);

})
app.get('/worker.html', async function (req, res) {
    
    res.sendFile(`${__dirname}/worker.html`);
       
})
app.get('/worker', async function (req, res) {
    var wk;
    async function findOne() {
        const client = await MongoClient.connect(url1, { useNewUrlParser: true }).catch(err => { console.log(err); });
    
        if (!client) {
            return;
        }
        try {
            const db = client.db("cms");
            let collection = db.collection('workers');
            wk = await collection.find().toArray();
            
        } catch (err) {
            console.log(err);
    
        } finally {
            client.close();
        }
    }
    await findOne();
    console.log(wk);
    res.send(wk);
       
})
  app.get('/admin.html', async function (req, res) {
      var tasks;
    async function findOne() {
        const client = await MongoClient.connect(url1, { useNewUrlParser: true }).catch(err => { console.log(err); });
    
        if (!client) {
            return;
        }
        try {
            const db = client.db("cms");
            let collection = db.collection('task');
            tasks = await collection.find().toArray();
            
        } catch (err) {
            console.log(err);
    
        } finally {
            client.close();
    
        }
    
    }
    await findOne();
    console.log(tasks);
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
    
                <a class="navbar-brand" href="admin.html">Winn Constructions - Admin</a>
    
    
                <ul class="navbar-nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="worker.html">Employees</a>
                    </li>
                    
                </ul>
    
            </div>
        </nav>
        
        <h3 style="text-align:center">Tasks</h3><br><br>
        <div class="container">
        <h4>
        
        
        `)
    
    for (var i in tasks)
    {
        
        res.write(`<div class="row" style="background-color:black;color:white;border-radius:25px"><div class='col-sm-5'><br>Name: ${tasks[i]["uname"]}<br><br> email: ${tasks[i]["email"]}</div>`);
        res.write(`<div class='col-sm-5'><br>Phone: ${tasks[i]["pno"]}<br><br> address: ${tasks[i]["add"]}</div>`);
        res.write(`<div class='col-sm-2'><form method='post' action='/as?id=${tasks[i]["_id"]}'><br><br><br><input type='submit' value='Assign'></form></div>`);
        res.write(`<div><br>Desc: ${tasks[i]["desc"]}<br></div><br><br><hr style="color:white><br></div>`)

    }
    res.write(`</h4>
    </div>
    </body>
    </html>`)
    res.end();
  })

  app.post('/alogin',async (req,res) => {
    var obj=req.body;
    
    var str="";
    if (obj["email"]=="admin@gmail.com" && obj["pwd"]=="admin")
    {
         str="<script>window.location.href = 'admin.html';</script>";
    }
    else
    {
        str="<script>window.alert('wrong email or password');window.location.href = 'adminlogin.html';</script>";
    }
    res.send(str);
    res.end();
  });

  app.post('/addwork', (req,res) => {
    var obj=req.body;
    console.log(obj);
    MongoClient.connect(url1, function(err, db) {
      if (err) throw err;
      var dbo = db.db("cms");
      
      dbo.collection("workers").insertOne(obj, function(err, res) {
        if (err) throw err;
        console.log("1 document inserted");
        
        db.close();
      });
      
    });
    res.send(`<script>window.location.href = 'admin.html';</script>`);
   res.end();
  });
  app.get('/delwk', async function (req, res) {
    
    console.log(req.query);
       
})

app.post('/as1',function(req,res){
    var obj=req.body;
    var id=req.cookies["_id"];
    var obj1={};
    obj1["_id"]=ObjectId(id);
    MongoClient.connect(url1, function(err, db) {
        if (err) throw err;
        var dbo = db.db("cms");
        
        dbo.collection("aswork").insertOne(obj, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });
        dbo.collection("task").deleteOne(obj1,function(err, res) {
            if (err) throw err;
            console.log("1 document deleted");
          
          db.close();
        });

    })
    res.send("<script>window.location.href = 'admin.html';</script>");
    res.end();

})
   
app.listen(port, () => console.log('The server running on Port '+port));

