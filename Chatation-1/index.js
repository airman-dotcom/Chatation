const express = require("express");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');
const app = express();
const EMAIL = process.env['my_email']
const PSW = process.env['my_psw']
const socket = require("socket.io");
var code_uuid;
const server = app.listen(3000, () => {
  console.log("listening on port 3000")
})
app.use(express.static("public"));
app.use(express.json())
const io = socket(server);
const nodemailer = require("nodemailer");
var email;
var boool = false;
var password;

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
})

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/public/login.html");
})

app.get("/register", (req, res) => {
  res.sendFile(__dirname + "/public/register.html");
})

app.get("/chat", (req, res) => {
  res.sendFile(__dirname + "/public/chat.html");
})
io.on("connection", (socket) => {
  socket.on("connected", (err) => {
    socket.emit("Connected User", "A user has connected");
})
  socket.on("disconnected", (err) => {
    socket.emit("Disconnected User", "A user has disconnected");
})
  socket.on("message", (value, user) => {
    const data = fs.readFileSync("chat.txt");
    const date = new Date();
    fs.writeFileSync("chat.txt", `${data}\n${user} on ${date}: "${value}"`);
    io.emit("message", value, (user));
})
  socket.on("confirmation", (em_ail) => {
    var users = require("./users.json");
    console.log(users);
    console.log("Hi: " + em_ail)
    var email_s = Object.keys(users)
    console.log(email_s);
    console.log(email_s.includes(em_ail));
    boool = (email_s.includes(em_ail));
    console.log(boool);
    socket.emit("confirmed", boool);
})
  socket.on("exists_q", (ema_il, pass) => {
    var users = require("./users.json");
    var email_s = Object.keys(users)
    console.log(1);
    if (email_s.includes(ema_il)){
      var data = users[ema_il];
      if (data != null || data != undefined || data != ""){
        if (data === pass){
          console.log(data);
          console.log("acc")
          socket.emit("exists_a", "accepted");
}
        else {
          socket.emit("exists_a", "psw_declined")
        }
      } else {
        socket.emit("exists_a", "psw_declined");
      }
} else {
      socket.emit("exists_a", "email_declined");
}
  })
})
app.post("/register", (req, res) => {
  
  code_uuid = uuidv4();
  email = req.body.email;
  password = req.body.psw;
  var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: PSW
  }
});
  var mailOptions = {
    from: EMAIL,
    to: req.body.email,
    subject: "Email Confirmation Link from Chatation",
    text: `Here is your email confirmation link: https://Chatation-1.aboutabot.repl.co/confirmation-html's/${code_uuid}.html`
  }
  transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
  fs.writeFileSync(`public/confirmation-html's/${code_uuid}.html`,`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  Loading...
</body>
  <script src="/socket.io/socket.io.js"></script>
  <script>
  const socket = io();
  window.onload = function(){
  alert(1);
  const data = {
    status: "Confirmed"
  }
  const send_data = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }
  fetch("/confirmation", send_data, (err) => {
    console.log(err);
})
}
</script>
</html>`,function(err){
    if (err){
      console.log(err);
}
});
})

app.post("/confirmation", (req, res) => {
  if (req.body.status === "Confirmed"){
    var users = JSON.stringify(require("./users.json"));
    console.log(users)
    if (users === "{}"){
      const data = users.slice(0, -1) + `"${email}": "${password}"}`;
      fs.writeFileSync("users.json", data);
}else{
      const data = users.slice(0, -1) + `,\n"${email}": "${password}"}`;
      fs.writeFileSync("users.json", data);
}
    let date = new Date();
    let AT_position = email.indexOf("@");
    let username = email.slice(0, AT_position);
    fs.mkdirSync(`public/${username}`);
    fs.writeFileSync(`public/${username}/logs.txt`, `Account Created at ${date}`);
    fs.writeFileSync(`public/${username}/chat.txt`, "Testing");
    fs.writeFileSync(`public/${username}/chat.txt`, "");
    fs.writeFileSync(`public/${username}/menu.html`, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  Welcome! You have been logged in!
  <a href="https://Chatation-1.aboutabot.repl.co/${username}/notes.html"><button>Notes</button></a>
</body>
  <script src="/scripts/menu.js"></script>
</html>`);
    fs.writeFileSync(`public/${username}/notes.html`, `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <input placeholder="Enter a note title" id="title" autocomplete="off">
  <input placeholder="Enter some note text" id="body" autocomplete="off">
  <button id="add">Add Note</button>
  <p id="err"></p>
  <div id="notes"></div>
</body>
  <script src="/notes.js"></script>
</html>`)


fs.writeFileSync(`public/${username}/notes.js`, `const create_button = document.getElementById("add");
var note_div = document.getElementById("notes");
var title = document.getElementById("title");
var text = document.getElementById("body");
var err = document.getElementById("err");
function submit(){
  if (title.value != null || title.value != undefined || title.value != ""){
    if (text.value != null || text.value != undefined || text.value != ""){
      var note = document.createElement("div");
      note.style.width = "20px";
      note.style.height = "20px;";
      note.style.borderRadius = "25px";
      var title_n = document.createElement("h6");
      var text_n = document.createElement("p");
      title_n.innerHTML = title;
      text_n.innerText = text;
      note.appendChild(title_n);
      note.appendChild(text_n);
      note_div.appendChild(note);
    }
  }
}

document.addEventListener("keydown", (e) => {
  if (e.keyCode === 13){
    submit();
  }
})

create_button.addEventListener("click", () => {
  submit();
})`)
    for (let y = 0;y++;y<9||y===9){
      fs.readFileSync(`public/assets/icon_${y}_o.png`, function(err, data){
        if (err){
          console.log(err);
        }
        fs.writeFileSync(`public/${username}/icon_${y}.png`, data);
      })
    }
  }
});

app.post("/login", (req, res) => {
  var em = req.body.email;
  var at = em.indexOf("@");
  let data = new Date();
  em = em.slice(0, at);
  var file = fs.readFileSync(`public/${em}/logs.txt`);
  fs.writeFileSync(`public/${em}/logs.txt`, file + `\n${data}-in`);
  res.json({status: true});
})