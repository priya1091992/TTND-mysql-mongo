/**
 * Created by priya on 10/4/16.
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/shoppingCart');
var connection = mongoose.connection;

connection.on('error', function () {
  console.log('###### Error ####');
});
connection.on('connected', function () {
  console.log('###### Connected ####');
});

var Schema = mongoose.Schema;

var User = new Schema({
    UserId:{type:Number, required:true},
    Name:{ type: String, required: true},
    Address:{
      building:{type:String}
    },
    PhoneNumber: {type: Number},
    email:[{type: String, required: true}]}
);

var userModel = mongoose.model('User', User);

var Product=new Schema({
  ProductID:{type:Number},
  Description:{type:String},
  Handling:{type:String}
})
var product=mongoose.model('Product',Product);

var Order=new Schema({
OrderID:{type:Number},
  OrderDetails:[
    {
      Productid:{ type: Number},
      quantity:{type:Number}
    }
  ],
  UserID:{type:Number},
  OrderDate:{type:Date}
})
var orderItem=mongoose.model('Order',Order);

module.exports={
  userModel:userModel,
  product:product,
  orderItem:orderItem
};
