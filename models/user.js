const mongoose = require("mongoose");


// var userSchema = new mongoose.Schema({
//     id:Number,
//     name:String,
//     email:String,
//     password:String
// });

var userSchema = new mongoose.Schema({
    id: { type: Number, unique: true },
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String }
});
var userModel = mongoose.model("user",userSchema);

module.exports = userModel;