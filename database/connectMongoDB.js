var dbObj = {};
var mongoose = require("mongoose");
var db = mongoose.connect("mongodb://127.0.0.1:27017/test");
mongoose.connection.on("error", function (error) {
    console.log("connect mongodb error,error message：" + error);
});
mongoose.connection.on("open", function () {
    console.log("connect mongodb success");
});

var UserSchema = new mongoose.Schema({
    name : {type:String},
    age : {type:Number,default:0},
    email : {type:String},
    time : {type:Date,default:Date.now()}

});

var contact_schema = new mongoose.Schema({
    id : {type: String, unique: true},
    name : {type: String, index: true},
    is_friend: Boolean,
    gender: Number,
    province: String,
    city: String,
    type: Number,
    alias: String,
    avatar: String,
    custom_str: String,
    time : {type:Date, default:Date.now()}
});

var userModel = mongoose.model("user",UserSchema);
var contact_model = mongoose.model("contact", contact_schema);

dbObj.userModel = userModel;
dbObj.contact_model = contact_model;

module.exports = dbObj;