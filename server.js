let express = require('express')
let mongodb = require('mongodb')
let app = express();
// here db has a global scope since it's outside all the functions defined below
//We have only defined it without assigning any value here
let db

//to tell express to serve our static existing files( in public folder) to make contents of this folder available from the root of our server
app.use(express.static('public'))

let connectionString = 'mongodb+srv://todoAppUser:123456&*@cluster0.iajsz.mongodb.net/todoApp?retryWrites=true&w=majority'
//connect method has three arguments
//1st is the connection string. A CS tells mongoDb where and what we want to connect to
//2nd arg is an object with mongoDB configiration property(boiler plate)
//3rd arg is a function that connect() method will call after it has a chance to open a connection with mongodb
mongodb.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true}, function(err, client) {
  //client.db() is gonna select our mongodb database
  db = client.db()
//The above line of code doesn't run as soon as we run our node app. This function will run after mongodb is connected and it may take some time
//Hence we force our app(or express server) to listen requests only AFTER the connection with mongoDb is made.So we write listen just after client.db
  app.listen(4000)
} )


// to tell express to do something similar like below for asnchronous request
app.use(express.json())

//to tell express to add all form values to body object and then add that body object to request object
//because by default express doesnot do this.(boiler plate)
app.use(express.urlencoded({extended: false}));




app.get('/', function(req, res) {
  //find method means READ/LOAD
  //we want to find all the documents in the collection items
  //toArray() will convert the find() output to an array.
  // This array method expects a function as an argument which it will call when the db action will complete beacuse the action will take some time
  db.collection("items").find().toArray(function(err,items) {
    //to see what array (beacause the parameter items in now an array) we are getting from DB collection
    //console.log(items)
    res.send(`<!DOCTYPE html>
    <html>
  <head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Simple To-Do App</title>
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
  </head>
  <body>
  <div class="container">
  <h1 class="display-4 text-center py-1">To-Do App!</h1>
  
  <div class="jumbotron p-3 shadow-sm">
  <form id="create-form" action="/create-item" method="POST">
  <div class="d-flex align-items-center">
  <input id= "create-field" name="item" autofocus autocomplete="off" class="form-control mr-3" type="text" style="flex: 1;">
  <button class="btn btn-primary">Add New Item</button>
  </div>
  </form>
  </div>
  
  <ul id="item-list" class="list-group pb-5">
    ${items.map(function(item) {
      return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <span class="item-text">${item.text}</span>
      <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
      </div>
      </li>`
    }).join('')}
  </ul>
  
  </div>
  
  <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
  <script src="/browser.js"></script>
  </body>
  </html>`)
  })
  
})
//for axios library available to us we used script tag above
 // Here / is the root of our server and then point towards our file browser.js we r telling the browser to load a file at this location and file name


//for post request mentioned above in  <form action="/create-item" method="POST">
// SO as soon as we send a post request, it takes us to http://localhost:4000/create-item
app.post('/create-item', function(req, res) {
  //to see (in the console of node) what we write in the input. "item" referes to the input name attribute above
  // console.log(req.body.item)

  // to save in to MongoDB what we write in input field
  //a  mongoDb can contain many collections. SO we are selecting a collection name "items"
  //insertOne is like Create(of CRUD). Its 1st argument is always an object that we want to store in the DB inside collection items
  //So here we just choose one property "text" and it's value is whatever the user types into that form field.
  //And 2nd argument is a function that insertOne will call once it creates an item in the DB,but it might take some time to create that item in DB
  //Now res.send will show this message AFTER the new item is created in the DB

  db.collection('items').insertOne({text: req.body.text}, function(err,info) {
    //res.send("Thanks for submitting the form.")
    res.json(info.ops[0])
  })
  })

  // to communicate with DB to update the item we set up an express server to receive an incoming post request to the url of update-item
  app.post('/update-item', function(req, res) {
 // to see if the node or server is successfully receiving the updated data
 //req.body is the data axios request is sending over and inside this object we are interested in text property.
 //this text property is referencing to  axios.post('/update-item',{text: userInput} ).then(function(){... in browser.js
 //console.log(req.body.text)
 // let's send
 //res.send("Success")
//1st arg is to tell mongoDb which document we want to update
//2nd arg is what we want to update on that document,so we want to set to  change the property text by whatever the user type 
//3rd arg is the function which is called oncethis db action is complete
db.collection('items').findOneAndUpdate({_id: new mongodb.ObjectId(req.body.id)}, {$set: {text: req.body.text}}, function() {
  res.send("Success")
 })

  } )

  app.post('/delete-item', function(req, res) {
    db.collection('items').deleteOne({_id: new mongodb.ObjectId(req.body.id)}, function() {
      res.send("Success")
    })
  })


