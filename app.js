
const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const session = require("express-session");
const mongoose = require("mongoose");
const userRouter = require("./routes/users")
const path = require("path")
const nocache = require("nocache");
const adminRouter = require("./routes/admin")



mongoose.connect("mongodb://localhost:27017/blog_app",{useUnifiedTopology:true,useNewUrlParser:true})
.then(()=>{
    console.log("connected")
})
.catch((err)=>{
    console.log("error in connection",err)
})


app.use("/admin",session({
    name: "admincookie",
    secret: "fabil",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))

app.use("/",session({
    name: "usercookie",
    secret: "fabil",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000*60*60*24
    }
}))



app.use(nocache());
app.use(express.static(path.join("public")))
app.use(express.urlencoded({ extended:false}));

app.use("/",userRouter);
app.use("/admin",adminRouter);

app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");


const PORT = process.env.PORT || 5000;
app.listen(PORT);