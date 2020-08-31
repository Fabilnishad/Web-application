const mongoose = require("mongoose");


var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
var userModel = mongoose.model("user",userSchema);

module.exports = userModel;