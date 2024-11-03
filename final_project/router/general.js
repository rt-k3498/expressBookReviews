const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

async function username_check(users,username){
    for (let x of users){
        if (x.username == username){
            return true
            
        }
    }
    return false
}
    

public_users.post("/register", async(req,res) => {
    let username = req.body.username
    let password = req.body.password
    if (!username || !password){
        return res.status(403).send({message:"The username or password is missing"})
    }
    else{
        if (await username_check(users,username)){
            return res.send({message:"Username already exists"})
        }
        else{
            users.push({username,password})
            return res.send({message:"Username added and user registered"})
        }
    }
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    return res.send(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    let id = req.params.isbn
  let package_to_send = books[id]
  return res.send(package_to_send);
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author
  async function func1(books,author){
    for (let x=1;x<11;x++){
        if(books[x].author===author){
            var book_to_send = books[x]
            break
        }
    }
    return book_to_send
}
  let book_to_send = await func1(books,author)
  if (book_to_send){return res.send(book_to_send)}
  else{return res.status(403).send({message:"There is no book with this author"})}
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {
    let title = req.params.title
    async function func1(books,title){
        for (let x=1;x<11;x++){
        if(books[x].title===title){
            var book_to_send = books[x]
            break
        }
        }
    return book_to_send
    }
    let book_to_send = await func1(books,title)
    if (book_to_send){return res.send(book_to_send)}
    else{return res.status(403).send({message:"There is no book with this author"})}
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    let id = req.params.isbn
    let package_to_send = books[id].reviews
    return res.send(package_to_send);
});

module.exports.general = public_users;
