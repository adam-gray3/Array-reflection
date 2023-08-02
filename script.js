const newEmail = document.querySelector(".email-input");
const form = document.querySelector("form");
const imageSection = document.querySelector(".send-image");
const error = document.querySelector(".error");
const emailError = document.querySelector(".email-error");
const validEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const newImg = document.querySelector(".get-image");
const addImgBtn = document.querySelector(".add-img");
const clearImgBtn = document.querySelector(".clear");
const currentImg = document.querySelector(".current-img");
const generateImg = document.querySelector(".generate-image");
const sendImg = document.querySelector(".send-image");
const emailList = [];
let imgList = [];

form.addEventListener("submit", (e) => {
    e.preventDefault();
    //CHECK IF EMAIL ALREADY EXSISTS    
    if(emailList.includes(newEmail.value)){
        showInputError("Email has already been used!")
        removeInputError();
        return
    }
    //Updates user if email is valid & doesnt already exsist
    if(validateEmail(newEmail.value)){
         updateUser(newEmail.value)
    }
    //CLEAR INPUT
    newEmail.value = "";
});

//FETCH IMAGE
const fetchImg = async () => {
    try{
        const res = await fetch("https://api.unsplash.com/photos/random?client_id=5ZNPr6lpotW5ZzVA-5flSVoMGjL2WEQbKS02GDBE-Ss");
        const data = await res.json();
        const imgSrc = data.urls.small;
        currentImg.src = imgSrc;
    } catch (e){
        console.log(e)
        alert(`Server error ${e}`)
    }
};

const validateEmail = (email) => {
    if(email === ""){
        showInputError("Please enter an email address")
        removeInputError()
        return false
    } else if(validEmail.test(email) !== true){
        showInputError("Please enter a valid email address!")
        removeInputError()
        return false
    } else{
        emailList.push(email)
        //CLEAR IMAGE LIST WHEN NEW EMAIL ENTERED
        imgList = [];
        return true
    }
};

//Create new user card & add email 
const updateUser = (email) => {
    const currentEmail = emailList.slice(-1);
    const current = emailList.indexOf(currentEmail[0]);
   
    //CREATE USER & IMG DIV
    const userSection = document.createElement("div");
    const imgContainer = document.createElement("div");
    const userEmail = document.createElement("h5");
    imgContainer.classList.add("img-container");
    userEmail.classList.add("current-email");
    //ADD EMAIL TO TITLE
    userEmail.innerHTML = email;
    userSection.prepend(userEmail);
    userSection.classList.add("user");
    //GIVE IMAGE CONTAINER INDEX OF EMAIL ADDRESS AS ID
    imgContainer.setAttribute("id", current);
    imageSection.append(userSection)
    //ADD TO IMAGE CONTAINER
    userSection.append(imgContainer);
}; 

//ADDS IMAGES TO CARD 
const addImageToUser = () => {
    //Check email has been entered
    if(emailList.length <= 0){
        showImageError("Please enter an email first!")
        removeImageError();
        return
    }

    //Check if image has already been added
    if(imgList.includes(currentImg.src)){
        showImageError("Image already added, please select another image")
        removeImageError()
        setTimeout(() => {
            fetchImg()
        }, 2000)
        return
    }
    imgList.push(currentImg.src)
    
    addCurrentImage(currentImg.src)
};

//ADDS IMAGE TO CORRECT EMAIL
const addCurrentImage = (image) => {
    //GET LAST EMAIL ENTERED
    const lastEmail = emailList.slice(-1);
    const currentEmail = emailList.indexOf(lastEmail[0]);
    //CREATE NEW IMAGE ELEMENT
    const imgToAdd = document.createElement("img");
    imgToAdd.classList.add("added-img")
    imgToAdd.src = image;

    const clear = document.createElement("span");
    clear.innerHTML = "Click on image to remove";
    
    //GET CONTAINER FOR CURRENT EMAIL ADDRESS
    const imgHolder = document.getElementById(currentEmail);
    imgHolder.append(imgToAdd);
    imgHolder.append(clear);
};


const showInputError = (message) => {
    error.innerHTML = message;
    error.classList.add("active");
    newEmail.classList.add("active");
};

const removeInputError = () => {
        //REMOVE ERROR AFTER 2 SECONDS
        setTimeout(() => {
        error.classList.remove("active");
        newEmail.classList.remove("active");
        newEmail.value = "";
    }, 2000)
};

const showImageError = (message) => {
    emailError.style.display = "block";
    emailError.innerHTML = message;
    generateImg.classList.add("error");
};

const removeImageError = () => {
    setTimeout(() => {
        generateImg.classList.remove("error");
        emailError.style.display = "none";
    }, 2000)
};


//NEW IMAGE ON BUTTON CLICK
newImg.addEventListener("click", fetchImg);

//ADD IMAGE TO EMAIL
addImgBtn.addEventListener("click", () => {
    addImageToUser();
    // fetchImg();
});

//CLEAR IMAGES 
imageSection.addEventListener("click", (e) => {
    if(e.target.classList.contains("added-img")){
        e.target.remove();
    }
});

//NEW IMAGE ON PAGE LOAD/REFRESH
window.addEventListener("load", fetchImg);
