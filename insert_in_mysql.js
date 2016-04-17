/**
 * Created by priya on 7/4/16.
 */
var mysql=require('mysql');
var async=require('async');
var conn=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'priya',
  database:'ShoppingCart'
});

var queryString= "select UserID from Users where UserID=1028";
conn.query(queryString, function(error,results){
  if(error){
    console.log(error);
  }
  else{
    //var ret = JSON.parse(JSON.stringify(results));
    //console.log(ret[0].UserID);
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
        sql="insert into Users(UserID,UserName,Address,Phone,Email,AlternateEmail) values ?";
        for(i=0;i<1000;i++){
          var a=[];
          a[0]=(1+i);
          a[1]="alpha"+i;
          a[2]=i+"-block";
          a[3]=9976573301+i;
          a[4]='alpha'+i+'@gmail.com';
          a[5]='alpha'+i+'@gmail.com';
          values.push(a);
          LastValue=a[0];
        }

        conn.query(sql,[values], function(err,result){
          if(err){console.log(err);}
          else
          {
            console.log("LastUser:",LastValue)
            callback1(err,result);
            //LastValue=result.insertId

          }
        })


      },
      function(callback1){
        //insert data for Product database
        sql="insert into Products(ProductID,Description,Handling) values ?";
        values=[];
        for(i=0;i<1000;i++){
          var a=[];
          a[0]=(1+i);
          a[1]="Product"+i;
          a[2]="Category"+i;
          values.push(a);
          LastProduct=a[0];
        }

        conn.query(sql,[values], function(err,result){
          if(err) {
            console.log(err);
          }
          else {
            console.log("LastProduct:",LastProduct);
            callback1(err,result);
          }
        })

      }],
    function(err,results) {
      if(err){
        console.log(err);
      }
      else{
        console.log("Completed");
        callback(err,LastValue,LastProduct);
      }
    });

};


function insertOrderItem(lastuser, lastproduct, callback){
  //insert data for OrderItem database
  function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }


  sql="insert into OrderItems(OrderId,UserID,OrderDate) values ?";
  values=[];
  for(i=0;i<1000;i++){
    var a=[];
    var user;
    user=Math.floor((Math.random() * lastuser) + 1);
    var date= randomDate(new Date(2012, 0, 1), new Date());
    a[0]=(1+i);
    a[1]=user;
    a[2]=date;
    values.push(a);
    LastOrder=a[0];
  }

  conn.query(sql,[values], function(err,result) {
    if(err){console.log(err);}
    else{
      //LastOrder=result.insertId;
      console.log("LastOrder;",LastOrder);
      callback(err,lastproduct,LastOrder);
    }
  })

}


function insertLineItem(lastproduct,lastorder,callback){
//Insert data for LineItem database
  sql="insert into LineItems(OrderID,ProductId,Quantity) values ?";
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
  }
  conn.query(sql,[values], function(err,result){
    if(err){console.log(err);}
  else{
      callback(err,result);
    }
  })


}
