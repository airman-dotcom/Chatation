const create_button = document.getElementById("add");
var note_div = document.getElementById("notes");
var title = document.getElementById("title");
var text = document.getElementById("body");
var err = document.getElementById("err");
var test = document.createElement("button");
test.innerHTML = "Try it";
err.appendChild(test);
test.addEventListener("click", () => {
  alert(note_div.style.height)
})
var colors = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
function submit(){
  if (title.value != null || title.value != undefined || title.value != ""){
    if (text.value != null || text.value != undefined || text.value != ""){
      var rand = Math.floor(Math.random() * 7);
      var note = document.createElement("div");
      note.style.width = "100px";
      note.style.height = "100px";
      note.style.display = "inline-block";
      note.style.marginRight = "10px";
      note.style.marginBottom = "10px";
      note.style.backgroundColor = colors[rand];
      var title_n = document.createElement("h4");
      var text_n = document.createElement("p");
      if (note.style.backgroundColor === "red" || note.style.backgroundColor === "indigo" || note.style.backgroundColor === "violet" || note.style.backgroundColor === "blue"){
        title_n.style.color = "white";
        text_n.style.color = "white";
      }
      if (note.style.backgroundColor === "orange" || note.style.backgroundColor === "yellow" || note.style.backgroundColor === "green"){
        title_n.style.color = "black";
        text_n.style.color = "black";
      }
      title_n.innerHTML = title.value;
      text_n.innerHTML = text.value;
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
})

