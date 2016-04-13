/**
 * Created by priya on 9/4/16.
 */
var Sequelize=require('sequelize');
var sequelize=new Sequelize('ShoppingCart', 'root', 'priya',{
  define: {
    timestamps: false
  }
});

var usernew=sequelize.define('User',{
    UserID:{type:Sequelize.INTEGER, primaryKey:true},
    UserName:{type:Sequelize.STRING},
    Address:{type:Sequelize.STRING},
    Phone:{type:Sequelize.INTEGER},
    Email:{type:Sequelize.STRING},
    AlternateEmail:{type:Sequelize.STRING}
  },
  {
    timestamps: false
  }
)
sequelize.sync().then(function(success) {
  //return usernew.create({
  //  user:'2',
  //  username: 'janedoe',
  //  birthday: new Date(1980, 6, 20)
  //});
  console.log("Table successfully created");
}).catch(function(err){
  console.log(err);
});

var productnew=sequelize.define('Product',{
    ProductID:{type:Sequelize.INTEGER, primaryKey:true},
    Description:{type:Sequelize.STRING},
    Handling:{type:Sequelize.STRING}
  },
  {
    timestamps: false
  }

)
sequelize.sync().then(function(success) {
  console.log("Table successfully created");
}).catch(function(err){
  console.log(err);
});

var ordernew=sequelize.define('OrderItem',{
    OrderId:{type:Sequelize.INTEGER, primaryKey:true},
    OrderDate:{type:Sequelize.DATE}
  },
  {
  timestamps: false
}
)

usernew.hasMany(ordernew,{foreignKey: 'UserID'});

sequelize.sync().then(function(success) {
  console.log("Table successfully created");
}).catch(function(err){
  console.log(err);
});

var linenew=sequelize.define('LineItem',{
    Quantity:{type:Sequelize.STRING}
  },
  {
    timestamps: false
  }
)
ordernew.hasMany(linenew,{foreignKey: 'OrderID'},{unique:'abc'});
productnew.hasMany(linenew,{foreignKey: 'ProductId'},{unique:'abc'});

sequelize.sync().then(function(success) {
  console.log("Table successfully created");
}).catch(function(err){
  console.log(err);
});





