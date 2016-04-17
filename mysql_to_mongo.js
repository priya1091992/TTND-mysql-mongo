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
var mongoose = require('mongoose');


var limit=500;
var count=0;
for(i=0;i<1000;i=i+limit){
  limit=500;
  parallelFunction();
  count=count+limit;

}
function parallelFunction(callback){
  var a;
  var userArray=[];
  var ret;
  async.parallel([
    function(callback1){
      console.log('Task1: Executing Query');
      var queryString = "select * from Users limit ?,?";
      var values=[count,limit];
      conn.query(queryString,values, function (error, results) {
        console.log('Task1: Query Executed');
        if (error) {
          console.log('Task1: Query Failed');

        }
        else {
          console.log('Task1: Query Success');
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
          var user = new userModel(userArray);
          user.collection.insert(userArray, function(err,result){
            if(err){
              console.log("errrrrr",err);}
            else{
              console.log("Data inserted in user collection");}
            callback1(err,result);
          })
        };
      });

    },
    function(callback2){
      var queryString = "select * from Products limit ?,?";
      var values=[count,limit];
      console.log('Task2:')
      userArray=[];
      conn.query(queryString,values, function (error, results) {
        if (error) {
          console.log(error);
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
          var product1 = new product(userArray);
          product1.collection.insert(userArray,function (err,result) {
            if (err) {
              console.log(err);
            }
            else {
              console.log("Data saved in Product collection");
              callback2(err,result);
            }
          });
        };
      });

    }
  ],function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log("33333333")

    }
  });

}


var c,flag=1;
var l=[], co=[];
function insertOrderItem(){
  var a, ret, obj1,j=1;
  var userArray=[];
  var arr=[];
  var  sum=[];
  var k= 0,s;
  sum[0]=0;
  co[0]=0;
  console.log("in OrderItems...........................");

  async.waterfall([
    function(callback){
// for maintaining the limit nd offset to retreive data from mysql and migrate it into mongo.....
      var maintainCount='select o.OrderId, o.UserID, l.ProductId, count(*) as c from OrderItems o join LineItems l on o.OrderId=l.OrderID group by o.OrderId';
      conn.query(maintainCount,function(err,result){
        if(err){ console.log("Error occur in order::");
        }
        else{
          var ret = JSON.parse(JSON.stringify(result));
          for(i=0;i<ret.length;){
            s=sum[k];
            s=sum[k]+ret[i].c;
            if(s<=100){
              sum[k]=ret[i].c+sum[k];
              i++;
            }
            else{
              k++;
              sum[k]=0;
            }
          }
          for(i=0;i<sum.length;i++){
            l[i]=sum[i];
            co[i+1]=sum[i];
          }
          console.log("Value of count:", co, "Value of limit:", l, "Value of sum::", sum);
          callback(err,co,l,sum);
        }

      })
    },
    function(co,l,sum,callback){
// for migrating data from mysql to mongo.......
      var que='select * from OrderItems, LineItems where OrderItems.OrderId=LineItems.OrderID order by OrderItems.OrderId limit ?,?';
      console.log("INNNNNNNNNNNNNN second function::::::::", co,l,sum.length);

      for(i=0;i<sum.length;i++){
        co[i+1]=co[i]+l[i];
      }

      for(i=0;i<sum.length;i++){
        var values=[co[i],l[i]];
        console.log(values);
        conn.query(que,values,function(err,results){
          if(err){console.log(err);}
          else {
            userArray = [];
            if (results.length) {
              var ret = JSON.parse(JSON.stringify(results));
              var length = results.length;
              for (i=0; i<length; i=(i+c-1)) {
                c=1;
                j=i;
                a = ret[i];
                arr=[];
                while((j<length) && (flag=1)){
                  if(j>100){
                    break;
                  };
                  if(ret[j].OrderId==ret[i].OrderId){
                    flag=1;
                    obj1={};
                    a=ret[j];
                    obj1={
                      'Productid': a.ProductId,
                      'quantity': a.Quantity
                    }
                    arr.push(obj1);
                    j++;
                    c++;
                  }
                  else{
                    flag=0;
                    break;
                  }
                }
                var obj = {};
                a=ret[i];
                obj = {
                  'OrderID': a.OrderID,
                  'OrderDetails':arr,
                  'UserID': a.UserID,
                  'OrderDate': a.OrderDate
                }
                userArray.push(obj);
              }
            }
            console.log("Total Orders:",userArray.length)
            var order = new orderItem(userArray);
            order.collection.insert(userArray,function (err,result) {
              if (err) {
                console.log(err);
                callback(err,result);
              }
              else {
                console.log("Data saved in Order collection");

              }
            });
          };
        })
      }
      callback(null,1);
    }
  ], function(error, result){

  })

}

insertOrderItem();
