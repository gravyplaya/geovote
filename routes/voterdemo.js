var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('voterdemo', { title: 'Voting POC Demo' });
  //res.send('respond with a resource');
  //next();
});
router.get('/2', function(req, res, next) {
    res.send('respond with a second resource');
});
module.exports = router;
