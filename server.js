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
        });
    });
});