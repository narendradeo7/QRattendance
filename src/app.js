// requiring all the packages 

const express = require('express');
const ejs =require ('ejs');
const bodyParser=require('body-parser');
// path for custom path of the files 
const path =require('path');
const app=express();
const port =process.env.PORT || 3000;


// we will require bcrypt for hashing and applying salt rounds 

const bcrypt =require("bcrypt");
const saltRounds =10;



// requiring connection to the mongodbatlas

const db = require("./connection");

// requiring user model for mongo db atlas 

const userModel = require('./userModel');
const { application } = require('express');


// getting alertjs 
const js_path= path.join(__dirname,"../public/js/alert.js");
const alrt = require(js_path);

var serveralboxStyle="display:none;";
var serveralrtmsg="";





// an array of email ids of admin 
var admins=["admin0790@gmail.com","ksinghal@gmail.com","gupta2@gmail.com"];







// public file static path for css and images 

const static_path= path.join(__dirname,"../public");

// we have got path of public by going one dir back of working dir 

// getting all paths for views and partials 

const templates_path=path.join(__dirname,"../templates/views");


// setiing views and partials for the dynamic pages 

app.set("view engine", 'ejs');
app.set('views',templates_path);


// use of bodyParser to get the data from the route body 

app.use(bodyParser.urlencoded({extended:true}));

// making our express app use static fles like css images and js 

app.use(express.static(static_path));






// route handeling starts here 


// callback for home or signup page 

app.get("/",(req,res)=>{
res.render("signup");

});


// getiing login page 

app.get("/login",(req,res)=>{
    
    res.render("login",{alboxStyle:serveralboxStyle,alrtmsg:serveralrtmsg});
    
    });


    // for attendance scanner 

    app.get("/scanner",(req,res)=>{
        res.render("scanner");
        
        });
    








//    responding to the post request of the routes 

// post req of signup



// getting current date for timestamp 
var today = new Date();
var date = today.getDate()+'/'+(today.getMonth()+1)+'/'+today.getFullYear();
var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
var dateTime = date+' '+time;
console.log(dateTime);

app.post("/",function(req,res){




    // getting name of the user to reuse it other routes 
    const username=req.body.name;

    console.log("post route is working for signup route" +dateTime);

// using bcrypt to add saltrounds before hashing the password

bcrypt.hash(req.body.password,saltRounds, function(err,hash){

console.log("password has been hashed");

// stored tha hash with salrounds in our password db 

// now creating new user in user model 

const newUser = new userModel({
    name:req.body.name,
    email:req.body.email,
    password:hash,
    // hash is here password with saltrounds provided using bcrypt 
    dob:req.body.dob,
    gender:req.body.gender,
    timestamp:dateTime,
    enrollment:req.body.enroll,
mobile:req.body.mob


});

console.log("new user has been created");

// now we will be saving that user in model and callback if error 

newUser.save()
  .then(() => {
    res.render("success",{uName:username,smsgAdjective:"Awesome",sMsg:"You are Successfully Registered"});
        console.log("coool ! you have been registered Successfully");

  })
  .catch((error) => {
    console.error('Error saving user:', error);
  });

});


});


// post req of sigunp route ends 





// post req of login route 





app.post("/login",function(req,res){

    // getting user email and password for the authentication 
const useremail= req.body.email;
const password = req.body.password;

console.log("entered into login route post")
// now we will search for the email in our database 

userModel.findOne({ email: useremail })
  .then(foundUser => {
    if (foundUser) {
      return bcrypt.compare(password, foundUser.password)
        .then(result => {
          if (result === true) {
            admins.some((mail) => {
              if (mail === useremail) {
                res.render("scanner");
                return true;
              }
            });

            res.render("dashboard", {
              uName: foundUser.name,
              userenroll: foundUser.enrollment
            });
          } else {
            serveralrtmsg = "Wrong Password !";
            res.render("login", {
              alboxStyle: "display:block;",
              alrtmsg: serveralrtmsg
            });
          }
        });
    } else {
      serveralrtmsg = "Invalid Credentials !";
      res.render("login", {
        alboxStyle: "display:block;",
        alrtmsg: serveralrtmsg
      });
    }
  })
  .catch(err => {
    console.log(err);
  });



});





// post of login ends 


// listening to the port on the server 

app.listen(port,()=>{

    console.log('listening to the port -> '+port+' on the server');
});