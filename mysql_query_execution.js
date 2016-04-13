/**
 * Created by priya on 13/4/16.
 */
var mysql=require('mysql');
var con=mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'priya',
  database:'ShoppingCart'
});

var queryString;

//Query:1->Get User list followed by their order
queryString='select * from Users u, LineItems l, OrderItems o where o.OrderId=l.OrderID and u.UserID=o.UserID;';
con.query(queryString,function(err,rows){
  if(err) throw err;

  console.log('********************Query-1************\n');
  console.log(rows.length);
});

//Query:2->select * from Users u join OrderItems o on u.UserID=o.UserID join LineItems l on o.OrderId=l.OrderID where l.ProductID=952 and l.Quantity=2;
queryString='select * from Users u join OrderItems o on u.UserID=o.UserID join LineItems l on o.OrderId=l.OrderID where l.ProductID=952 and l.Quantity=2;';
con.query(queryString,function(err,rows){
  if(err) throw err;

  console.log('*****************Query-2********************\n');
  console.log(rows);
});

//Query:3->select *, count(*) as c, date_sub(current_date, interval 1 month) as month from LineItems l, OrderItems o where l.OrderID=o.OrderId group by l.ProductId having c=1 and o.OrderDate>month and o.OrderDate<=current_date order by l.ProductID;
queryString='select *, count(*) as c, date_sub(current_date, interval 1 month) as month from LineItems l, OrderItems o where l.OrderID=o.OrderId group by l.ProductId having c=1 and o.OrderDate>month and o.OrderDate<=current_date order by l.ProductID;';
con.query(queryString,function(err,rows){
  if(err) throw err;

  console.log('****************Query-3*********************:\n');
  console.log(rows);
});

//Query:4->select p.ProductID, p.Description, o.OrderDate, o.UserId from Products p join LineItems l on p.ProductID=l.ProductId join OrderItems o on o.OrderId=l.OrderID and o.UserID=23 order by o.OrderDate;
queryString='select p.ProductID, p.Description, o.OrderDate, o.UserId from Products p join LineItems l on p.ProductID=l.ProductId join OrderItems o on o.OrderId=l.OrderID and o.UserID=23 order by o.OrderDate;';
con.query(queryString,function(err,rows){
  if(err) throw err;

  console.log('************Query-4****************\n');
  console.log(rows);
});

//Query:5->select p.ProductID, p.Description, o.OrderDate, o.UserId from Products p join LineItems l on p.ProductID=l.ProductId join OrderItems o on o.OrderId=l.OrderID and o.UserID=23 and l.Quantity=4;
queryString='select p.ProductID, p.Description, o.OrderDate, o.UserId from Products p join LineItems l on p.ProductID=l.ProductId join OrderItems o on o.OrderId=l.OrderID and o.UserID=23 and l.Quantity=4;';
con.query(queryString,function(err,rows){
  if(err) throw err;

  console.log('************Query-5***********:\n');
  console.log(rows);
});

con.end();
