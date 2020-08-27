$(function() {
    // socket.io connection
    let socket = io.connect("http://127.0.0.1:3500");

    // Enter chat and load users
    $("a#enterChat").click(function(e) {
        e.preventDefault();
        let username = $("#username").val();
        localStorage.setItem("username", username);
        if (username !== "") {
            // 데이터 처리
            // socket.emit('서버로 보낼 이벤트명', 데이터);
            socket.emit("username", username);
        } else {}
    });
});