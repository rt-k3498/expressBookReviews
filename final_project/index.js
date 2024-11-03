const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
   if (req.session.authenticated){
    let token = req.session.authenticated.token
    jwt.verify(token,"secret_key",(err,payload)=>{
        if (!err){
            req.payload = payload
            next()
        }
        else{
            return res.status(403).send({message:"User not authenticated"})
        }
    })
   }
   else{
        return res.status(403).send({message:"User not logged in"})
       }
});
 
const PORT =8000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
