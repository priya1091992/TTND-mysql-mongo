/**
 * Created by priya on 8/4/16.
 */
var mysql=require('mysql');
var async=require('async');
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shopping');
var connection = mongoose.connection;

connection.on('error', function () {
  console.log('###### Error ####');
});
connection.on('connected', function () {
  console.log('###### Connected ####');
});

var Schema = mongoose.Schema;

var user = new Schema({
  UserId:{type:Number, required:true},
  Name:{ type: String, required: true},
  Address:{
    building:{type:String}
  },
  PhoneNumber: {type: Number},
  email:[{type: String, required: true}]
});

var userModel = mongoose.model('user', user);

var conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'priya',
  database:'shoppingCart'
});

var a;

var queryString= "select * from User where UserID=1028";
conn.query(queryString, function(error,results){
  if(error){
    throw error;
  }
  else{
    var ret = JSON.parse(JSON.stringify(results));
    console.log(ret[0]);
    a=ret[0];
    console.log(a);

    var obj={
      'UserId': a.UserID ,
      'Name': a.UserName,
      'Address':{'building':a.Address} ,
      'PhoneNumber': a.Phone,
      'email': [a.Email, a.AlternateEmail]
    }

console.log("Obj",obj);
    var user = new userModel(obj);

//save model to MongoDB
    user.save(function (err) {
      if (err) {
        return err;
      }
      else {
        console.log("Post saved");
      }
    });

  }
});

//

conn.end();
