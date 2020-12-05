const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');


//Get username and room from url
const{ username, room } = Qs.parse(location.search, {
 ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit("joinRoom", {username, room})

//get room and users
socket.on("roomUsers",({room, users})=>{
    outputRoomName(room);
    outputUsers(users)

});

socket.on("message", message =>{

outputMessage(message);

//scroll down
chatMessages.scrollTop = chatMessages.scrollHeight;
});

//message submit
chatForm.addEventListener("submit", e =>{
    e.preventDefault();

// get message Text
let msg = e.target.elements.msg.value;

msg = msg.trim();
  
if (!msg){
  return false;
}

//emit msg to server
socket.emit("chatMessage", msg);

//clear input
e.target.elements.msg.value = '';
e.target.elements.msg.focus();


});

//output message to dom
function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML=`<p class= "meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
    ${message.text}
    </p>`;
    document.querySelector(".chat-messages").appendChild(div);  
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
  }
  
// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach(user=> {
      const li = document.createElement('li');
      li.innerText = user.username;
      userList.appendChild(li);
    });
   }
  