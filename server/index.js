const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");
const bodyParser = require("body-parser");
const socketio = require("socket.io");

app.use(express.static(path.join(__dirname, "/dist")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

socketServerInstance = socketio(server);
socketServerInstance.on("connection", function(socket) {
  console.log("a user connected");
});

app.get("/api/cursor", function(req, res) {
  return res.send("hello");
});

app.post("/api/upload-cursor", function(req, res) {
  global.cursor = req.body.cursor;
  socketServerInstance.emit("cursor", req.body.cursor);
});

app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist", "index.html"));
});

server.listen(3000, () => {
  console.log("Server is Running");
});
