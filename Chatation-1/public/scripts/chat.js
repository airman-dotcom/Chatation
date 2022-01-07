const socket = io();
const send = document.getElementById("send");
var input = document.getElementById("message")
var text = document.getElementById("text");
var name = prompt("What is your name");
while (name === undefined || name === null || name === ""){
  var name = prompt("What is your name");
}

function s_end(){
  if (input.value != null || input.value != undefined || input.value != ""){
    socket.emit("message", input.value, (name));
}
}

send.addEventListener("click", () => {
  s_end();
  input.value = "";
})

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13){
    s_end()
    input.value = "";
  }
})

socket.on("message", (value, user) => {
  console.log(text.innerHTML);
  if (text.innerHTML === ""){
    text.innerHTML = text.innerHTML + `${user}: ${value}`
  } else{
  text.innerHTML = text.innerHTML + "<br>" + `${user}: ${value}`;
  }
})