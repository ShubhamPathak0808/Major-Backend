let mongoose = require('mongoose');
let express = require('express');
let router = express.Router();

let UsersSchema = require('./Users');

router.route('/').get((req, res, next) => {
    UsersSchema.find((error, data) => {
        if (error) {
          return next(error)
        } else {
          res.json(data)
        }
      })
  })

router.route('/signup').post((req, res, next) => {
    person=req.body;
 UsersSchema.findOne(person,(error,p)=>{
    if(p){
        res.send("Email Already Exists");
    }
    else{
        UsersSchema.create(person, (error, data) => {
            if (error) {
              return next(error)
            } else {
            //   console.log(data)
              res.status(200).send(data)
            }
          })
    }
 })
  });

  router.route('/login').post((req,res,next)=>{
      UsersSchema.findOne({email:req.body.email ,password:req.body.password},(error,person)=>{
            if(person){
                res.status(200).send(person)
            }
            else{
                res.send("No such User");
            }
      })
  })
  module.exports = router;