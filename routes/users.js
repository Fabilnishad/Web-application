const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const session = require("express-session");
const userModel = require("../models/user")




router.use(session({
    secret: "fabil",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))

const redirect_Dashboard = (req,res,next)=>{
    if(req.session.userEmail){
        res.redirect("/secret")
    }else{
        next();
    }

}

const protectHome = function(req,res,next){
    if(!req.session.userEmail){
        res.redirect("/login");
    }else{
        next();
    }
}

router.get("/signup",redirect_Dashboard,(req,res)=>{
    res.render("signup",{style:"signup.css"});
})

router.post("/signup",(req,res)=>{
    const {name,email,password}=req.body;

    var user = new userModel({
        name:name,
        email:email,
        password:password,
    })
    console.log(name);
    
    user.save();
    res.redirect("/login")
    console.log("data is saved");
})


router.get("/login",redirect_Dashboard, (req,res) => {
    res.render("login");

}
)


router.post("/login",(req,res) => {
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


router.get("/mypage",(req,res)=>{
    res.render("home")
})

router.get("/secret",protectHome, (req,res) => {
    res.render("secret");

})

router.get("/logout",(req,res) =>{
    res.clearCookie("connect.sid");
    req.session.destroy();
    res.redirect("/login");
});

module.exports = router;

