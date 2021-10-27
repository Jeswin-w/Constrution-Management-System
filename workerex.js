const express = require('express');
const app = express();
var ObjectId = require('mongodb').ObjectId
var url1 = "mongodb://localhost:27017/";
 var MongoClient = require('mongodb').MongoClient;
const port = 3007;
app.use(express.static('images'));
app.use(express.static('scripts'));

app.use('/wlogin.html', function (req, res) {
    res.sendFile(`${__dirname}/wlogin.html`);
  })

  app.post('/wologin',async (req, res) => {
    var obj=req.body;
    console.log(obj);
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
      str="<script>window.alert('wrong password or email');window.location.href = 'wlogin.html';</script>";
    }
    else
    {
      str=`<script>window.location.href = 'worker.html?em=${user[0]["email"]}';</script>`;
      
    }
  });

app.listen(port, () => console.log('The server running on Port '+port));