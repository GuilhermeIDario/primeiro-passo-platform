const sendBtn =
document.getElementById(
"sendBtn"
);

if(sendBtn){

sendBtn.addEventListener(
"click",
()=>{

const input =
document.getElementById(
"userInput"
);

const area =
document.getElementById(
"chatArea"
);

const msg =
document.createElement("div");

msg.innerText =
input.value;

area.appendChild(msg);

input.value = "";

});

}