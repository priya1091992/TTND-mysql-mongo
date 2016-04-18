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
  var arr1=[];
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
                'userId': a.userId,
                'name': a.userName,
                'address': {'building': a.address},
                'phone': a.phone,
                'email': [a.email, a.alternateEmail]
              }
              userArray.push(obj);
            }
          }
          console.log("Total Users:",userArray.length)
          var user = new userModel(userArray);
          user.collection.insert(userArray, function(err,result){
            if(err){
              console.log("error",err);
            callback1(err,result);
            }
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
      userArray=[];
      conn.query(queryString,values, function (error, results) {
        if (error) {
          console.log(error);
        }
        else {
          ret = JSON.parse(JSON.stringify(results));
          var product1 = new product(ret);
          product1.collection.insert(ret,function (err,result) {
            if (err) {
              console.log(err);
              callback2(err,result);
            }
            else {
              console.log("Data saved in Product collection");
              callback2(err,result);
            }
          });
        };
      });

    },function(callback){
      var queryString= 'select o.orderId, o.userId, o.orderDate, l.productId, count(*) as c, group_concat(productId) as productInfo, group_concat(quantity) as quant  from OrderItems o join LineItems l on o.orderId=l.orderId group by o.orderId limit ?,?';
      var values=[count,limit];
      userArray=[];
      conn.query(queryString,values, function (error, results) {
        if (error) {
          console.log(error);
        }
        else {
          i=0;
          var resProduct;
          var resQuantity;
          var userArray=[];
          ret = JSON.parse(JSON.stringify(results));
          for(i=0;i<results.length;i++) {
            resProduct = ret[i].productInfo.split(",").map(Number);
            resQuantity = ret[i].quant.split(",").map(Number);
            arr1 = [];
            j = resProduct.length;
            n = resProduct.length - 1;
            var obj;
            while (resProduct.length >= 1) {
              j = j - 1;
              obj1 = {
                'productId': resProduct[j],
                'quantity': resQuantity[j]
              }
              arr1.unshift(obj1);
              resProduct.length--;
            }
            obj = {
              'orderId': ret[i].orderId,
              'orderDetails': arr1,
              'userId': ret[i].userId,
              'orderDate': ret[i].orderDate
            }
            userArray.push(obj);
          }

          var order = new orderItem(userArray);
          order.collection.insert(userArray,function (err,result) {
            if (err) {
              console.log(err);
              callback(err, result);
            }
            else {
              console.log("Data saved in Order collection");
              callback(err,result);
            }
          });
        };
      })


    }
  ],function(err,result){
    if(err){
      console.log(err);
    }
    else{
      console.log("Task completed")
    }
  });
}















//var c,flag=1;
//var l=[], co=[];
//function insertOrderItem(){
//  var a, ret, obj1,j=1;
//  var userArray=[];
//  var arr=[];
//  var  sum=[];
//  var k= 0,s;
//  sum[0]=0;
//  co[0]=0;
//  console.log("in OrderItems");
//
//  async.waterfall([
//    function(callback){
//// for maintaining the limit nd offset to retreive data from mysql and migrate it into mongo.....
//      var maintainCount='select o.OrderId, o.userId, l.productId, count(*) as c from OrderItems o join LineItems l on o.OrderId=l.orderId group by o.OrderId';
//      conn.query(maintainCount,function(err,result){
//        if(err){ console.log("Error occur in order::");
//          callback(err,result);
//        }
//        else{
//          var ret = JSON.parse(JSON.stringify(result));
//          for(i=0;i<ret.length;){
//            s=sum[k];
//            s=sum[k]+ret[i].c;
//            if(s<=5){
//              sum[k]=ret[i].c+sum[k];
//              i++;
//            }
//            else{
//              k++;
//              sum[k]=0;
//            }
//          }
//          for(i=0;i<sum.length;i++){
//            l[i]=sum[i];
//            co[i+1]=sum[i];
//          }
//          console.log("Value of count:", co, "Value of limit:", l, "Value of sum::", sum);
//          callback(err,co,l,sum);
//        }
//
//      })
//    },
//    function(co,l,sum,callback){
//// for migrating data from mysql to mongo.......
//      var que='select * from OrderItems, LineItems where OrderItems.OrderId=LineItems.orderId order by OrderItems.OrderId limit ?,?';
//      for(i=0;i<sum.length;i++){
//        co[i+1]=co[i]+l[i];
//      }
//
//      for(i=0;i<sum.length;i++){
//        var values=[co[i],l[i]];
//        console.log(values);
//        conn.query(que,values,function(err,results){
//          if(err){console.log(err);}
//          else {
//            userArray = [];
//            if (results.length) {
//              var ret = JSON.parse(JSON.stringify(results));
//              var length = results.length;
//              for (i=0; i<length; i=(i+c-1)) {
//                c=1;
//                j=i;
//                a = ret[i];
//                arr=[];
//                while((j<length) && (flag=1)){
//                  if(j>10){
//                    break;
//                  };
//                  if(ret[j].OrderId==ret[i].OrderId){
//                    flag=1;
//                    obj1={};
//                    a=ret[j];
//                    obj1={
//                      'productId': a.productId,
//                      'quantity': a.quantity
//                    }
//                    arr.push(obj1);
//                    j++;
//                    c++;
//                  }
//                  else{
//                    flag=0;
//                    break;
//                  }
//                }
//                var obj = {};
//                a=ret[i];
//                obj = {
//                  'orderId': a.orderId,
//                  'orderDetails':arr,
//                  'userId': a.userId,
//                  'orderDate': a.orderDate
//                }
//                userArray.push(obj);
//              }
//            }
//            console.log("Total Orders:",userArray.length)
//            var order = new orderItem(userArray);
//            order.collection.insert(userArray,function (err,result) {
//              if (err) {
//                console.log(err);
//                callback(err,result);
//              }
//              else {
//                console.log("Data saved in Order collection");
//              }
//            });
//          };
//        })
//      }
//      callback(null,1);
//    }
//  ], function(error, result){
//  if(error){
//    console.log("Error", error);
//  }
//    else{
//    console.log("Task completed");
//  }
//  })
//}
//insertOrderItem();

//var c, l;
//var arr1=[];
//function insertOrder(){
//  var queryString= 'select o.orderId, o.userId, o.orderDate, l.productId, count(*) as c, group_concat(productId) as productInfo, group_concat(quantity) as quant  from OrderItems o join LineItems l on o.orderId=l.orderId group by o.orderId limit ?,?';
//  var values=[c,l];
//  userArray=[];
//  conn.query(queryString,values, function (error, results) {
//    if (error) {
//      console.log(error);
//    }
//    else {
//      i=0;
//      var resProduct;
//      var resQuantity;
//      var userArray=[];
//      ret = JSON.parse(JSON.stringify(results));
//      for(i=0;i<results.length;i++) {
//        resProduct = ret[i].productInfo.split(",").map(Number);
//        resQuantity = ret[i].quant.split(",").map(Number);
//        arr1 = [];
//        j = resProduct.length;
//        n = resProduct.length - 1;
//        var obj;
//        while (resProduct.length >= 1) {
//          j = j - 1;
//          obj1 = {
//            'productId': resProduct[j],
//            'quantity': resQuantity[j]
//          }
//          arr1.unshift(obj1);
//          resProduct.length--;
//        }
//        obj = {
//          'orderId': ret[i].orderId,
//          'orderDetails': arr1,
//          'userId': ret[i].userId,
//          'orderDate': ret[i].orderDate
//        }
//        userArray.push(obj);
//      }
//
//      var order = new orderItem(userArray);
//            order.collection.insert(userArray,function (err,result) {
//              if (err) {
//                console.log(err);
//                callback(err, result);
//              }
//              else {
//                console.log("Data saved in Order collection");
//              }
//            });
//    };
//  })
//}
//
//for(i=0;i<10;i=i+5){
//  c=i;
//  l=5;
//  insertOrder();
//}
