$(function() {
    // socket.io connection
    let socket = io.connect("http://127.0.0.1:3500");

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
        } else {}
    });
});