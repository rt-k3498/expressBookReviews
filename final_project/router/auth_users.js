const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [
    {username:"rt-k3498",password:"123456"}
];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username
  let password = req.body.password
  for (let x of users){
    if (x.username===username){
      if (x.password === password){
        let token = jwt.sign({username,password},"secret_key",{expiresIn:"1h"})
        req.session.authenticated = {username,token}
        return res.send({message:"You have loggen in"})
      }
      else {return res.status(403).send({message:"Password incorrect"})}
    }
  }
  return res.status(403).send({message:"Username doesnt exist, Please register"})
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let index = req.params.isbn
  let book = books[index]
  let review = req.body.review
  let username = req.session.authenticated.username
  for (let x in book.reviews){
    if (x===username){
      book.reviews[x]=review
      return res.send({message:"Review successfully modified"})
    }
  }
  book.reviews[username]=review
  return res.send({message:"Review successfully added"})
});

regd_users.delete("/auth/review/:isbn",(req,res)=>{
  let index = req.params.isbn
  let book_reviews = books[index].reviews
  let username = req.session.authenticated.username
  if (book_reviews[username]){
    delete book_reviews[username]
    return res.send({message:"Your review has been deleted"})
  }
  else{
    return res.send({message:"You have not added a review"})
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
