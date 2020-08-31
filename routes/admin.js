const express = require("express");
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


const protectPage = (req,res,next)=>{
    if(!req.session.email){
        res.redirect("/admin/login")

    }else{
        next()
    }
}

const admin = {
    email:"fabil@gmail.com",
    password:"123"
}

router.get("/login",(req,res)=>{
    res.render("adminlog")
})

router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(email === admin.email && password === admin.password){
        req.session.email = email;
        res.redirect("/admin/secret")
    }else{
        res.redirect("/admin/login")
    }

})

router.get("/secret",protectPage,(req,res)=>{
    userModel.find({}).lean().exec((err,data)=>{
        if(err){
            throw error;
        }else{
            res.render("adminsecret",{user:data})
        }
    })

})

router.get("/edit",(req,res)=>{
    res.render("edit");
})

router.post("/edit",(req,res)=>{
    const email = req.body.email;
    userModel.find({email:email}).lean().exec((err,data)=>{
        if(err){
            throw err;
        }else{
            res.render("edit",{data:data})
        }
    })
})

router.post("/editSave",(req,res)=>{
    const email = req.body.email;
    

    const data={
        name:req.body.name,
        password:req.body.password
    }
    userModel.updateOne({email:email},{$set:{password:data.password,name:data.name}},(err,docs)=>{
        if(err) throw err;
        res.redirect("/admin/secret")
    })
})

router.post("/delete",(req,res)=>{
    const email = req.body.email;

    userModel.deleteOne({email:email},(err)=>{
        if(err){
            throw err;
        }else{
            res.redirect("/admin/secret")
        }
    })
})

module.exports = router;