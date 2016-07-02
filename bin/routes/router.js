var router = require('express').Router();


router.get('/activities/activities1', function(req, res, next) {
  console.log(2222)
  res.render('activities/activities1/views/index', {
    title: 'Express3333',
    items:[{
      name:'item1'
    },{
      name:'item2'
    },{
      name:'item3'
    }]
  });
});


module.exports = router;
