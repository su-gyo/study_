const loginForm = document.querySelector("#login-form");
const loginInput = document.querySelector("#login-form input");
const greeting = document.querySelector("#greeting");

const savedUsername = localStorage.getItem("username");
const HIDDEN_CLASSNAME = "hidden";



function onSubmit(event) {
    event.preventDefault();
    loginForm.classList.add("HIDDEN_CLASSNAME");
    
    const username = loginInput.value;

    localStorage.setItem("username", username);
    greeting.innerText = `Hello ${username} Nice to meet you` ;
    greeting.classList.remove(HIDDEN_CLASSNAME);
    
}

if(savedUsername === null){
    //show the form
    loginForm.classList.remove(HIDDEN_CLASSNAME);
    loginForm.addEventListener("submit", onSubmit);

}else{
    //show the greetings
    greeting.innerText = `Hello ${savedUsername} see you again!`;
    greeting.classList.remove(HIDDEN_CLASSNAME);
    
}