const express = require('express');
const app = express();

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
app.get('/adminlogin.html', function (req, res) {
    res.sendFile(`${__dirname}/adminlogin.html`);
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
    res.send(`<!DOCTYPE html>
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
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container-fluid">
    
                <a class="navbar-brand" href="#">Winn Constructions - Admin</a>
    
    
                <ul class="navbar-nav justify-content-end">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="#">Employees</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="assign.html">Assign</a>
                    </li>
                </ul>
    
            </div>
        </nav>
        <h2>Tasks</h2>
        
    </body>
    </html>`);
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
   
app.listen(port, () => console.log('The server running on Port '+port));