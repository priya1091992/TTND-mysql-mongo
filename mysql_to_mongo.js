/**
 * Created by priya on 8/4/16.
 */
var mysql=require('mysql');
var async=require('async');
var userModel=require('./mongoose_collection').userModel;
var product=require('./mongoose_collection').product;
var orderItem=require('./mongoose_collection').orderItem;
var conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'priya',
  database:'ShoppingCart'
});

var a;
var userArray=[];
var ret;
var j=1;
var obj1;
var arr=[];

async.series([
  parallelFunction,
  insertOrderItem
], function(err,results){
  if(err){
    console.log(err);
  }
  else{
    console.log("yepee finish!!!!!!!");
  }
  conn.end();
});

function parallelFunction(callback){
  async.parallel([
    function(callback1){
      var queryString = "select * from Users";
      conn.query(queryString, function (error, results) {
        if (error) {
          throw error;
        }
        else {
          if (results.length) {
            ret = JSON.parse(JSON.stringify(results));

            var length = results.length;
            for (i = 0; i < length; i++) {
              var obj = {};
              a = ret[i];
              obj = {
                'UserId': a.UserID,
                'Name': a.UserName,
                'Address': {'building': a.Address},
                'PhoneNumber': a.Phone,
                'email': [a.Email, a.AlternateEmail]
              }
              userArray.push(obj);
            }
          }
          console.log("Total Users:",userArray.length)
          for (i = 0; i < userArray.length; i++) {
            var user = new userModel(userArray[i]);
            user.save(function (err) {
              if (err) {
                console.log(err);
              }
              else {
                //console.log("Post saved");
              }
            });
          }
        };
      });
      callback1(null,1);
    },
    function(callback1){
      var queryString = "select * from Products";
      userArray=[];
      conn.query(queryString, function (error, results) {
        if (error) {
          throw error;
        }
        else {
          userArray=[];
          if (results.length) {
            ret = JSON.parse(JSON.stringify(results));
            var length = results.length;
            for (i = 0; i < length; i++) {
              var obj = {};
              a = ret[i];
              obj = {
                'ProductID': a.ProductID,
                'Description': a.Description,
                'Handling': a.Handling
              }
              userArray.push(obj);
            }
          }
          console.log("Total Products:",userArray.length)
          for (i = 0; i < userArray.length; i++) {
            var product1 = new product(userArray[i]);
            product1.save(function (err) {
              if (err) {
                console.log(err);
              }
              else {
               // console.log("Post saved");
              }
            });
          }
        };
      });
      callback1(null,1);
    }
  ],function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log("Completed");
    }
  });
  callback(null,1);
}
var c=1;

function insertOrderItem(callback){
  console.log("in OredrItems...........................")
  var que='select * from OrderItems, LineItems where OrderItems.OrderId=LineItems.OrderID order by OrderItems.OrderId'
  conn.query(que,function(err,results){
    if(err){console.log(err);}
    else {
      userArray = [];
      if (results.length) {
        var ret = JSON.parse(JSON.stringify(results));
        var length = results.length;
        for (i=0; i<length; i=i+c) {
          c=1;
          j=i;
          a = ret[i];
          arr=[];
          while(j<length){
            if(j>1000){
              break;
            };
            if(ret[j].OrderId==ret[i].OrderId){
              obj1={};
              a=ret[j];
              obj1={
                'Productid': a.ProductId,
                'quantity': a.Quantity
              }
              arr.push(obj1);
              j++; c++;
            }
            else{
              break;
            }
          }
          var obj = {};
          a=ret[i];
          obj = {
            'OrderID': a.OrderID,
            'OrderDetails':arr,
            'UserID': a.UserID
          }
          userArray.push(obj);
        }
      }
      console.log("Total Orders:",userArray.length)
      for (i = 0; i <=userArray.length; i++) {
        var order = new orderItem(userArray[i]);
        order.save(function (err) {
          if (err) {
            console.log(err);
          }
          else {
           // console.log("Post saved!!");
          }
        });
      }
    };
  })
  callback(null,1);
}


