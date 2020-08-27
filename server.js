const MongoClient = require("mongodb").MongoClient;
const io = require("socket.io").listen(3500);

let MongoURL = "mongodb://127.0.0.1:27017/";

// MongoDB Connection
MongoClient.connect(MongoURL, { useUnifiedTopology: true }, function(err, db) {
    if (err) throw err;
    console.log("connected to MongoDB");

    // DB constants 선언
    const socketchat = db.db("socketchat");
    const users = socketchat.collection("users");
    const messages = socketchat.collection("messages");

    // SocketIO Connection
    io.on("connection", function(socket) {
        console.log("Connected to socket.io");
        console.log(`Socket ID is ${socket.id}`);

        // client가 준 username 받기
        socket.on("username", function(username) {
            console.log(username);

            // mongodb에 있는 유저들을 user이벤트로 보내줌
            users.find().toArray(function(err, res) {
                if (err) throw err;
                socket.emit("users", res);
            });

            // mongodb에 저장
            users.insertOne({ socketID: socket.id, username: username });

            // broadcast -> 전송한 사람을 제외한 모두가 이 emit을 전달받는다.
            socket.broadcast.emit("logon", {
                socketID: socket.id,
                username: username,
            });

            // disconnect 처리
            socket.on("disconnect", function() {
                console.log(`User ${socket.id} disconnected`);
                users.deleteOne({ socketID: socket.id }, function() {
                    socket.broadcast.emit("logoff", socket.id);
                });
            });
        });
    });
});