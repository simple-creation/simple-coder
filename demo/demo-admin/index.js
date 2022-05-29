
const express = require('express');
const path = require('path');

const app = express();
//const cors = require('cors');

//const bodyParser = require('body-parser');

//app.use(cors());
//app.use(bodyParser.json()); // for parsing application/json
//app.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded


app.use("/web-antd",express.static(path.join(__dirname, './dist')));
//console.log('current static path--->', path.join(__dirname, '../dist'));
app.get('/healthCheck', function (req, res) {
  res.send("ok");
});
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});

const port = process.env.PORT || 8080
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
