var express = require('express');
var fs=require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/write', function(req, res, next) {
  console.log(req.body.dataKs);
  fs.writeFileSync('./../Data.json',req.body.dataKs);
  res.json({status:'保存成功'});
});

router.post('/read', function(req, res, next) {
  console.log(JSON.parse(fs.readFileSync('./../Data.json')));
  res.send(fs.readFileSync('./../Data.json'));
});


module.exports = router;
