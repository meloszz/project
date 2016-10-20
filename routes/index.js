var userDao = require("../dao/userDao");
var express = require('express');
var fs = require("fs");
var mysql = require("mysql");
var router = express.Router();

var cookie = require('cookie-parser');

var phantom = require("phantom");

router.get("/login", function (req, res) {
  res.render("login",  {tip: 'hello'});
});

router.post("/login", function (req, res) {
  userDao.login(req, res);
});

router.get("/", function(req, res) {
  if(typeof(req.cookies.username) == 'undefined'){
    res.redirect('/login');
  }else{
    userDao.queryAll(req, res);
  }
});

router.post("/", function(req, res) {
  console.log("into post");
  userDao.add(req, res);
});

router.get('/add', function (req, res) {
  res.render('index');
});

router.post('/add', function(req, res) {
  userDao.add(req, res, next);
});

router.get('/addUser', function(req, res, next) {
  res.render("index");
});

router.post('/addUser', function (req, res, next) {
  userDao.add(req, res, next);
  res.locals.urls = req.body.url;
  res.render('index');
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

router.get('/mycollections', function(req, res){
  userDao.collections(req, res);
});

router.post('/mycollections', function(req, res){
  userDao.addCollection(req, res);
});

router.post('/signup', function(req, res){
  console.log("into /signup post");
  userDao.signup(req,res);
});

router.post('/addCollection', function(req, res){
  userDao.addCollection(req,res);
});

router.post('/deleteCollection', function(req, res){
  userDao.deleteCollection(req,res);
});

router.get('/feedback', function(req, res){
  res.render('feedback');
});


router.get('/quit', function(req, res){
  res.cookie('username','null',{maxAge:0});
  res.redirect('/login');
});




module.exports = router;
