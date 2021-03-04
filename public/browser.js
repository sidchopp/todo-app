

// //Create feature
// let createField = document.getElementsById("create-field")

// document.getElementById("create-form").addEventListener("submit", function(e){
//   e.preventDefault()
//   axios.post('/create-item',{text:createField.value} ).then(function(){
//    //create the HTML for the new item
//    alert("you just created new item")
//  }).catch(function(){
//    console.log("please try later")
//  })

// } )

//1st arg is the click event and 2nd arg is a function which is called when this event happened
document.addEventListener("click", function(e) {
  // Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Do you really want to delete this item permanently?")) {
      axios.post('/delete-item', {id: e.target.getAttribute("data-id")}).then(function () {
        e.target.parentElement.parentElement.remove()
      }).catch(function() {
        console.log("Please try again later.")
      })
    }
  }

  //only if the element that was actually clicked on contains a class name of edit-me, do we want our code written (below it) to actually run
  // in server.js we have a class name of edit-me as an attribute in the Edit button 
  if (e.target.classList.contains("edit-me")){
    // we r saving what the user typing into a variable userInput by prompting the user to type
    // after comma we want to pre populate the prompt filed with the current value
    let userInput = prompt("Enter your new text:",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML )
    //to send this input to our node server. The 1st arg for post is the url where we want to send this post request.Let's say /update-item
    // 2nd arg is the JS object (or data that server will receive) that is sent along to this url so we create a property with any name say text
    //axios.post returns a promise because we are not sure for how long this action of sending request to server is going to take
    //in then() we write a function which is not going to run till that action is taken place
    //in catch() we write a function that runs if the action encounters a problem
    //we have also added id( we can name it anything)o sthat when axios sends request to ur server we not only send the new test the user writes
    //but we are also sending along exaclty which document should be updated(based on it id)
    //This data-id has a reference in the edit button of server.js
    // As long as () of if statement is not blank( so we write userInput) so that if we now click cancel the old value remains there.
    //If we don't write the if statement then as soon as we click cancel, which technically means we write nothing in the prompt,so that item will become blank
    if (userInput){
      axios.post('/update-item',{text: userInput, id:e.target.getAttribute("data-id")} ).then(function(){
        // to show the user the updated data as soon as he updates something
        e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userInput
        console.log("please try later")
      })
    }


  }
})