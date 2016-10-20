var express = require('express');
var router = express.Router();
var userDao = require("../dao/userDao");
var multer = require('multer');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/add', function (req, res) {
  res.render('index');
});

router.post('/add', function(req, res) {
  var user = req.body.url;
  console.log(user);
});

router.get('/addUser', function(req, res, next) {
  userDao.add(req, res, next);
});

router.get('/queryAll', function(req, res, next) {
  userDao.queryAll(req, res, next);
});

router.get('/query', function(req, res, next) {
  userDao.queryById(req, res, next);
});

router.get('/deleteUser', function(req, res, next) {
  userDao.delete(req, res, next);
});

router.post('/updateUser', function(req, res, next) {
  userDao.update(req, res, next);
});

module.exports = router;
