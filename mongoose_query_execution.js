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
orderItem.find({},{_id:0},{limit:1000, sort:{UserID:1}},function(err,result){
  if(err){
    console.log("Error in query 1",err);
  }

  else{
    result1=result;
  userModel.find({},{_id:0},{limit:1000, sort:{UserId:1}},function(err,result){
    if(err){
      console.log("Error in inner query 1:",err);
    }
    else{
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
    console.log("Query 1 success");
  }
  })
}


});

//Query:2->Get List of users who have ordered product 600 with quantity 3
orderItem.aggregate([{$unwind:"$OrderDetails"},{$match:{$and:[{'OrderDetails.Productid':600},{'OrderDetails.quantity':'3'}]}}], function(err,result){
  if(err){
    console.log("Query 3 error:",err);
  }
  else{
    console.log("Query 3 success");
  }
})


//Query:3-Get List of Products which have been ordered thrice within last month.




//Query:4->Get list of Products which have been ordered by User 8 and sort them by order date.
orderItem.find({UserID:8},{'OrderDetails.Productid':1,_id:0},{sort:{OrderDate:1}},function(err, order){
 if(err){
   console.log("Query 4 error",err);
 }
  else{
  console.log("Query 4 success");
 }
})

//Query:5->Get list of Products which have been ordered by User 8 and quantity 4
orderItem.aggregate([{$unwind:"$OrderDetails"},{$match:{$and:[{UserID:8},{'OrderDetails.quantity':'4'}]}}], function(err,order){
  if(err){
    console.log("Query 5 :",err);
  }
  else{
    console.log("Query 5 success");
  }
})






//query-6
//
//orderItem.find({},{ _id:0},{},function(err,order){
//
//console.log(order);
//  order.forEach(function(e){
//    userModel.find({UserId: e.UserID},{},{sort:'UserId'},function(err, user){
//      //console.log("User Information having productid:952 and quantity:3 \n",user);
//   length=user.length;
//console.log(length);
//    })
//  })
//
//
//})


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
