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

    const chatTextArea = document.querySelector("#chatText");
    // chat input 처리
    chatTextArea.addEventListener("keydown", function(e) {
        if (e.keyCode === 13) {
            const message = chatTextArea.value;
            const windowID = document.querySelector("div#publicChat").id;
            if (message !== "") {
                socket.emit("input", {
                    username: localStorage.getItem("username"),
                    message: message,
                    windowID: windowID,
                });
                chatTextArea.value = "";
                e.preventDefault;
            }
        }
    });

    //chat output 처리
    socket.on("output", function(data) {
        const chatWindows = document.querySelector(`#${data.windowID}`);
        const p = document.createElement("p");
        const pText = document.createTextNode(
            `${data.username} said : ${data.message}`
        );
        p.appendChild(pText);
        p.className = "border-b-2";
        chatWindows.appendChild(p);
    });
};

init();