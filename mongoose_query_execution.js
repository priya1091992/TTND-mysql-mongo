/**
 * Created by priya on 13/4/16.
 */
var userModel=require('./mongoose_collection').userModel;
var product=require('./mongoose_collection').product;
var orderItem=require('./mongoose_collection').orderItem;

userModel.find({UserID:1},function(err,result){
console.log(result);
});
product
orderItem
