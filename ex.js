const express = require('express');
const app = express();
var url = require('url');
const port = 3005;
// Define the static file path


app.use(express.static('images'));
app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/user.html`);
})
app.get('/user.html', function (req, res) {
  res.sendFile(`${__dirname}/user.html`);
})
app.get('/user.html', function (req, res) {
  res.sendFile(`${__dirname}/user.html`);
})
app.get('/reg.html', function (req, res) {
  res.sendFile(`${__dirname}/reg.html`);
})
app.get('/login.html', function (req, res) {
  res.sendFile(`${__dirname}/login.html`);
})
app.get('/getwork.html', function (req, res) {
  res.sendFile(`${__dirname}/getwork.html`);
})

app.get('/progress.html', function (req, res) {
  res.sendFile(`${__dirname}/progress.html`);
})
app.listen(port, () => console.log('The server running on Port '+port));