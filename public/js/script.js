//Control Image Carousel
function startCarousel(){
    let activeImage = 0 //denote which image is active
    const images =  document.querySelectorAll('#carousel img') //setup an array of images by selecting everything that's an img inside of the carousel

    //nesting a function that will flip those img tags on and off, and some error-handling with the if() statement
    function cycleImages(){
        if(!images[activeImage]){ //if there is nothing in imgs that has the active img tag, then just exit the function. Without this, it might try to run the function when there aren't any imgs to run. So this will check just in case
            clearInterval(intervalId)
            return;
        }
        //in our images array, we want to find the activeImage, by default starts off at 0
        images[activeImage].classList.remove('active')   //we want to remove the classlist of #active, because by default, it already has this class.
        activeImage = (activeImage + 1) % images.length //this is finding the next image that should be active
        images[activeImage].classList.add('active') //once we've determined what the next img is going to be, we will make it active. just cycling through
    }
    //now we are going to tell our program how often to cycle
    let intervalId = setInterval(cycleImages, 3000)
}

//Handle Edit Requests - when someone clicks the edit button, it has to populate the information in the ejs and send the information to the server. So we'll need a function that does it.
function editItem(id, name, description) {
    document.getElementById('updateId').value = id;

    // Populate the form fields with the existing item's data
    document.getElementById('updateName').value = name;
    document.getElementById('updateDescription').value = description;

    //pass the id of the thing we are updating along with the form data to the proper route
    document.getElementById('updateForm').action = `/item/update/${id}`
}

//Handle Delete Requests - our delete button isn't inside of a form. Our delete button doesn't have any built-in behavior like a form does so we need to code that out manually with a manual fetch request, inside of a function, inside of some logic. They click the deleteButton, we sent this request to the server with the id that we want to delete, then we send the method of DELETE.
async function deleteItem(id) {
    try {
        const response = await fetch(`http://localhost:3500/item/delete/${id}`, {
            method: 'DELETE',
        });
        if(response.ok) {
            location.reload()
        } else {
            console.log('failed to delete item')
        }
    } catch(error) {
       console.log('error occurred:', error) 
    }
}

//Handle Errors from server if unable to write data. (optional, but good to have) it doesn't hurt anything if you don't have this.
//It will check for an error message from the server, and if it returns true, it will display an error in the alert box.
function checkForError() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        alert("Validation failed. Name and description are required.");
    }
}

//on page load, the carousel should start functioning automatically:
//page loads, calls startCarousel and checks for errors
window.onload = function () {
    startCarousel();
    checkForError();
}
