/**
 * Created by priya on 13/4/16.
 */
var userModel=require('./mongoose_collection').userModel;
var product=require('./mongoose_collection').product;
var orderItem=require('./mongoose_collection').orderItem;
var _=require('lodash');
var result1,result2;
var arr=[];

//Query:1->Get User list followed by their order
orderItem.find({},{_id:0},{limit:4, sort:{UserID:1}},function(err,result){
  result1=result;
  userModel.find({},{_id:0},{limit:4, sort:{UserId:1}},function(err,result){
    result2=result;
    result2.forEach(function(e,i){
      var index=_.findIndex(result1,function(o){return o.UserID== e.UserId});
      if(index>=1){
        var obj={};
        obj= _.merge(e,result1[index]);
        arr.push(obj);
      }
      else{
        obj={};
        obj=e;
        arr.push(obj);

      }
    })
    console.log("All users followed by their orders::\n",arr);
  })
});

//Query:2->Get List of users who have ordered product 952 with quantity 3
orderItem.find({$and:[{'OrderDetails.Productid':952}, {'OrderDetails.quantity':3}]},{ _id:0},{},function(err,order){    //Problem when quantity=2 in mongoose
  order.forEach(function(e){
    userModel.find({UserId: e.UserID},{},{},function(err, user){
console.log("User Information having productid:952 and quantity:3 \n",user);
    })
  })

})

//Query:3-Get List of Products which have been ordered thrice within last month.



//Query:4->Get list of Products which have been ordered by User 23 and sort them by order date.
orderItem.find({UserID:23},{'OrderDetails.Productid':1,_id:0},{sort:{OrderDate:1}},function(err, order){  //134 910 missing
  console.log("Query 4---->",order);
})

//Query:5->Get list of Products which have been ordered by User 23 and quantity 6
orderItem.find({$and:[{UserID:23},{'OrderDetails.quantity':6}]},{'OrderDetails.Productid':1,_id:0},function(err, order){  //get extra fields......
  console.log("Query 5----->",order);
})


query-6

orderItem.find({},{ _id:0},{},function(err,order){

console.log(order);
  order.forEach(function(e){
    userModel.find({UserId: e.UserID},{},{sort:'UserId'},function(err, user){
      console.log("User Information having productid:952 and quantity:3 \n",user);
   length=user.length;
    })
  })


})


//
//orderItem.aggregate([
//  { $unwind: "$OrderDetails" },
//],function (err, result) {
// console.log("In result::",result);
//  result.forEach(function(e){
//    userModel.find({UserId: e.UserID},{},{sort:'UserId'}, function(err,user){
//      length=user.length;
//      console.log("User::",user);
//    })
//  });
//});
//
