const enterUsername_div = document.querySelector("div#enterUsername");
const chatMain_div = document.querySelector("div#chatMain");
const rooms_div = document.querySelector("div#rooms");
const textarea = document.querySelector("div#chatTextArea");

const init = function() {
    // socket.io connection
    const socket = io.connect("http://127.0.0.1:3500");

    const enterChat_anchor = document.querySelector("a#enterChat");
    // Enter chat and load users
    enterChat_anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const username_input = document.querySelector("#username");
        let username = username_input.value;
        localStorage.setItem("username", username);
        if (username !== "") {
            // 데이터 처리
            // socket.emit('서버로 보낼 이벤트명', 데이터);
            socket.emit("username", username);

            enterUsername_div.classList.toggle("hidden");
            chatMain_div.classList.toggle("hidden");
            textarea.classList.toggle("hidden");

            socket.on("users", function(data) {
                data.forEach((element) => {
                    const sid = document.getElementById(element.socketID);
                    if (sid === undefined || sid === null) {
                        const userList_ul = document.querySelector("div#userList>ul");
                        const li = document.createElement("li");
                        li.id = element.socketID;
                        const litext = document.createTextNode(element.username);
                        li.appendChild(litext);
                        userList_ul.appendChild(li);
                    }
                });
            });
        } else {}
    });

    // logon 처리
    socket.on("logon", function(data) {
        const userList_ul = document.querySelector("div#userList>ul");
        const li = document.createElement("li");
        li.id = data.socketID;
        const litext = document.createTextNode(data.username);
        li.appendChild(litext);
        userList_ul.appendChild(li);
    });

    // logoff 처리
    socket.on("logoff", function(id) {
        document.getElementById(id).remove();
        localStorage.removeItem("username");
    });
};

init();