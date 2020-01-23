const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const socketio = require("socket.io");

app.use(express.static(path.join(__dirname, "/dist")));

// enable cors
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "PUT, GET, POST, DELETE, OPTIONS, PATCH"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "Authorization");
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

global.cursor =
  "QVFEbDE3TlBIalRIWTJKSjNHM0FUUFktVnVXM1pvc0VGNTRVMXoteWhwazg2a1FkdlRoWlVidGZ5YjdDX3FxVEdCeC1nQndTbW1PZC1uMDBMN1Q5TDctMg%3D%3D";

app.get("/api/cursor", function(req, res) {
  return res.send(global.cursor);
});

app.post("/api/upload-cursor", function(req, res) {
  global.cursor = req.body.cursor;
  socketServerInstance.emit("cursor", req.body.cursor);
});

app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist", "index.html"));
});

server = app.listen(3000);
const socketServerInstance = socketio.listen(server);
socketServerInstance.on("connection", function(socket) {
  socketServerInstance.emit("cursor", global.cursor);
});
