/**
 * Created by priya on 7/4/16.
 */
var mysql=require('mysql');
var async=require('async');

var conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'priya',
  database:'shoppingCart'
});

var queryString= "select * from User";
conn.query(queryString, function(error,results){
  if(error){
    throw error;
  }
  else{
    //console.log(results);
  }
});

var sql;
var values=[];
var LastValue=0;
var LastOrder=0;
var LastProduct=0;

async.waterfall([
  parallelFunction,
  insertOrderItem,
  insertLineItem,
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
        //insert values for User database
        sql="insert into User(UserID,UserName,Address,Phone,Email,AlternateEmail) values ?";
        for(i=0;i<1000;i++){
          var a=[];
          a[0]=(29+i);
          a[1]="alpha"+i;
          a[2]=i+"-block";
          a[3]=9976573301+i;
          a[4]='alpha'+i+'@gmail.com';
          a[5]='alpha'+i+'@gmail.com';
          values.push(a);
          //console.log("User:",values);
          LastValue=a[0];
        }

        conn.query(sql,[values], function(err,result){
          if(err) throw err;
          else
          {
            //LastValue=result.insertId
            console.log("LastUser:",LastValue)
          }
        })

        callback1(null,1);
      },
      function(callback1){
        //insert data for Product database
        sql="insert into Product(ProductID,Description,Handling) values ?";
        values=[];
        for(i=0;i<1000;i++){
          var a=[];
          a[0]=(35+i);
          a[1]="Product"+i;
          a[2]="Category"+i;
          values.push(a);
         // console.log("Product:",values);
          LastProduct=a[0];
        }

        conn.query(sql,[values], function(err,result){
          if(err) {
            throw err;
          }
          else {
            console.log("LastProduct:",LastProduct);
          }
        })
        callback1(null,1);
      }],
    function(err,results) {
      if(err){
        console.log(err);
      }
      else{
        console.log("Completed");
      }
    });
  callback(null,LastValue,LastProduct);
};


function insertOrderItem(lastuser, lastproduct, callback){
  //insert data for OrderItem database
  sql="insert into OrderItem(OrderId,UserID) values ?";
  values=[];
  for(i=0;i<1000;i++){
    var a=[];
    var user;
    user=Math.floor((Math.random() * lastuser) + 1);
    //console.log(user);

    a[0]=(54+i);
    a[1]=user;
    values.push(a);
    //console.log("Order:",values);
    LastOrder=a[0];
  }

  conn.query(sql,[values], function(err,result){
    if(err) throw err;
    else{
      //LastOrder=result.insertId;
      console.log("LastOrder;",LastOrder);
    }
  })
  callback(null,lastproduct,LastOrder);
}


function insertLineItem(lastproduct,lastorder,callback){
//Insert data for LineItem database
  sql="insert into LineItem(OrderID,ProductId,Quantity) values ?";
  values=[];
  for(i=0;i<1000;i++){
    var a=[];
    var lastordr;
    var lastProduct;
    lastordr=Math.floor((Math.random() * lastorder) + 1);
    lastProduct=Math.floor((Math.random() * lastproduct) + 1);
    a[0]=lastordr;
    a[1]=lastProduct;
    a[2]=Math.floor((Math.random() * 10) + 1);;
    values.push(a);
   // console.log("LineItem:",values);
  }

  conn.query(sql,[values], function(err){
    if(err) throw err;
  })
  callback(null,1);

}






////insert values for User database
//var sql="insert into User(UserID,UserName,Address,Phone,Email,AlternateEmail) values ?";
//var values=[];
//var LastValue=0;
//var LastOrder=0;
//var LastProduct=0;
//
//for(i=0;i<1000;i++){
//  var a=[];
//  a[0]=(29+i);
//  a[1]="alpha"+i;
//  a[2]=i+"-block";
//  a[3]=997657330+i;
//  a[4]='alpha'+i+'@gmail.com';
//  a[5]='alpha'+i+'@gmail.com';
//  values.push(a);
//  console.log("User:",values);
//  LastValue=a[0];
//}
//
//conn.query(sql,[values], function(err,result){
//  if(err) throw err;
//  else
//  {
//    //LastValue=result.insertId
//    console.log("LastUser:",LastValue)
//  }
//})
//
////insert data for Product database
//sql="insert into Product(ProductID,Description,Handling) values ?";
//var values=[];
//for(i=0;i<1000;i++){
//  var a=[];
//  a[0]=(37+i);
//  a[1]="Product"+i;
//  a[2]="Category"+i;
//  values.push(a);
//  console.log("Product:",values);
//  LastProduct=a[0];
//}
//
//conn.query(sql,[values], function(err,result){
//  if(err) {
//    throw err;
//  }
//  else {
//    console.log("LastProduct:",LastProduct);
//  }
//})
//
//
////insert data for OrderItem database
//sql="insert into OrderItem(OrderId,UserID) values ?";
//values=[];
//for(i=0;i<1000;i++){
//  var a=[];
//  var ran;
//  ran=Math.floor((Math.random() * 21) + 1);
//  console.log(ran);
//
//  a[0]=(53+i);
//  a[1]=ran;
//  values.push(a);
//  console.log("Oredr:",values);
//  LastOrder=a[0];
//}
//
//conn.query(sql,[values], function(err,result){
//  if(err) throw err;
//  else{
//    //LastOrder=result.insertId;
//    console.log("LastOrder;",LastOrder);
//  }
//})
//
////Insert data for LineItem database
//sql="insert into LineItem(OrderID,ProductId,Quantity) values ?";
//values=[];
//for(i=0;i<1000;i++){
//  var a=[];
//  var lastUser;
//  var lastProduct;
//  lastUser=Math.floor((Math.random() * LastOrder) + 1);
//  lastProduct=Math.floor((Math.random() * LastProduct) + 1);
//  a[0]=lastUser;
//  a[1]=lastProduct;
//  a[2]=Math.floor((Math.random() * 10) + 1);;
//  values.push(a);
//  console.log("LineItem:",values);
//}
//
//conn.query(sql,[values], function(err){
//  if(err) throw err;
//})
//
//conn.end();
