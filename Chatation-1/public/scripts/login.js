const socket = io();
var email = document.getElementById("uname");
var psw = document.getElementById("psw");
var login_button = document.getElementById("login");
var email_regx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
var err = document.getElementById("err");
var error_m;
function check(){
  socket.emit("exists_q", email.value, (psw.value));
  
}

function login(){
  const data = {
    email: email.value
  }
  
  const send_data = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json"
},
    body: JSON.stringify(data)
  };
  
  fetch("/login", send_data)
    .then(response=>response.json())
    .then(function(json){
      alert(Object.values(json))
      if(Object.values(json)){
        var at = (email.value).indexOf("@");
        var em = (email.value).slice(0, at);
        window.location.href=`https://Chatation-1.aboutabot.repl.co/${em}/menu.html`
      }})
}

function submit(){
  if (email.value != null || email.value != undefined || email.value != ""){
    if (psw.value != null || psw.value != undefined || psw.value != ""){
      check();
    } else {
      err.innerHTML = "Please enter your password"
    }
  } else {
    err.innerHTML = "Please enter your email adress or username"
  }
}



document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    submit();
}
})

login_button.addEventListener("click", () => {
  submit();
})

socket.on("exists_a", (message) => {
  alert(message);
  if (message === "accepted"){
    var at = (email.value).indexOf("@");
    var em = (email.value).slice(0, at);
    window.location.href = `https://Chatation-1.aboutabot.repl.co/${em}/menu.html`
}
  if (message === "email_declined") {
    err.innerHTML = "Incorrect Email Or Email Account Doesn't Exist in Our Database";
  }
  if (message === "psw_declined") {
    err.innerHTML = "Incorrect Password";
};
}) 