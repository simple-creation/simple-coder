
var express = require('express');
var path = require('path');

var app = express()
var cors = require('cors');

var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({extended:true})); // for parsing application/x-www-form-urlencoded


const pageName = process.env.PAGE;
const moduleName = process.env.MODULE;
const webPath = process.env.WEBPATH;


console.log('static path,', webPath);
app.use(express.static(webPath));


console.log('env page,module webPath===>',pageName,moduleName,webPath);

app.post('/createPage', function(req, res, next) {
  
    console.log("received data", req.body);
    require(path.resolve(__dirname, '../../lib/page-creator.js'))(req.body.params,pageName,moduleName);
    res.json(req.body);
});

const port = 3000
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
