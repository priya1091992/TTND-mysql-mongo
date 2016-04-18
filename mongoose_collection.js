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
    userId:{type:Number, required:true},
    name:{ type: String, required: true},
    address:{
      building:{type:String}
    },
    phone: {type: Number},
    email:[{type: String, required: true}]}
);

var userModel = mongoose.model('User', User);

var Product=new Schema({
  productId:{type:Number},
  description:{type:String},
  handling:{type:String}
})
var product=mongoose.model('Product',Product);

var Order=new Schema({
orderId:{type:Number},
  orderDetails:[
    {
      productId:{ type: Number},
      quantity:{type:Number}
    }
  ],
  userId:{type:Number},
  orderDate:{type:Date}
})
var orderItem=mongoose.model('Order',Order);

module.exports={
  userModel:userModel,
  product:product,
  orderItem:orderItem
};

