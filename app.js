// (1
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/blog_app",{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
    console.log("error in connection",err)
})

var userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
});
var userModel = mongoose.model("user",userSchema);





//3
const protectHome = function(req,res,next){
    if(!req.session.userEmail){
        res.redirect("/login");
    }else{
        next();
    }
}
//4
app.use(express.urlencoded({ extended:false}));

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(session({
    secret: "fabil",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))

app.get("/signUp",(req,res)=>{
    res.render("signUp")
})

app.post("/signup",(req,res)=>{

    var user = new userModel({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
    })
    console.log(user);
    user.save();
    res.redirect("/login")
    console.log("data is saved");
})

app.get("/mypage",(req,res)=>{
    res.render("home")
})

//2
app.get("/secret",protectHome, (req,res) => {
    res.render("secret");

})

//4
app.get("/login", (req,res) => {
    res.render("login");

}
)
app.post("/login",(req,res) => {
    const recvEmail = req.body.email;
    const recvPassword = req.body.password;

     //const foundedUser = userModel.find(user => recvEmail === user.email && recvPassword === user.password);
    //const foundedUser = userModel.find({email:recvEmail});
     userModel.findOne({email:recvEmail,password:recvPassword},(error,foundedUser)=>{
        if(foundedUser){
            req.session.userEmail = foundedUser.email;
            res.redirect("/secret");
        }else{
            res.redirect("/login");
        }

    });
    
})

app.get("/logout",(req,res) =>{
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.redirect("/login");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT);