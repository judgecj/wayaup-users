var express = require('express');
var  router = express.Router();
var  mongojs = require('mongojs');
var bcrypt = require('bcrypt-nodejs');
var db = mongojs('mongodb://judgechuks:chuks@ds051655.mlab.com:51655/userme');
var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://judgechuks:chuks@ds051655.mlab.com:51655/userme';
//all users


// Use connect method to connect to the Server
MongoClient.connect(url, function(err) {
    console.log("Connected correctly to server");
});

router.get('/tasks',function(req,res, next) {
  db.users.find(function(err, users) {
      if(err){
          res.send(err);
      }
      res.json(users);
  });
});


/// get signgle user
router.get('/tasts/:id',function(req,res, next) {
    db.users.findOne({_id:mongojs.ObjectId(req.params.id)} ,function(err, user) {
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});

router.post('/task', function(req, res, next) {
          //var user =  req.body.name;
            var user = {
                name: req.body.name,
                username : req.body.username,
                password :  req.body.password
            };
          console.log("user...", user);
          if(!user ){
                  res.status(400);
                  res.json({
                      'error' : "Bad Data"
                  });
          }else{
              bcrypt.hash(user.password, null, null, function(err, hash) {
                  if (err)return next(err);
                   user.password = hash;
                  db.users.insert(user, function (err, user ) {
                      if(err){
                          res.send(err);
                      }
                  })
              })


          }
});


// delete user

router.delete('/tast/:id',function(req,res, next){
    db.users.remove({_id:mongojs.ObjectId(req.params.id)} ,function(err, user) {
        if(err){
            res.send(err);
        }
        res.json(user);
    });
});


/// update

router.put('/tast/:id',function(req,res, next){
    var user = {
        name: req.body.name,
        username : req.body.username,
        password :  req.body.password,
         isDone  :   req.body.isDone
    };
    console.log("user data...", req.params.id);
    console.log("user data...", user);
   db.users.update({_id:mongojs.ObjectId(req.params.id)},user,function(err, user) {
        if(err){
            res.send(err);
        }
    });
});



module.exports = router;