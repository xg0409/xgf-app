var express = require('express');
var router = express.Router();

/* GET users listing. */
router.post('/getInfo', function(req, res, next) {
  var body = req.body;
  var name = body.name
  console.log("参数name:%s",name);
  res.send({
    code:'0000',
    message:'success',
    data:{
      id:'1001',
      name:name,
      age:20
    }
  });
});

module.exports = router;
