const express = require("express");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const socketio = require("socket.io");
const mongoose = require("mongoose");
const CursorModel = require("./models/cursor.model");

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

mongoose
  .connect("mongodb://127.0.0.1:27017/instamanager", { useNewUrlParser: true })
  .then(() => {
    `Successfully Connected to the Mongodb`;
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/api/cursor", async function(req, res) {
  const cursor = await CursorModel.findOne();
  return res.send(cursor.cursor);
});

app.post("/api/upload-cursor", async function(req, res) {
  const cursor = new CursorModel({
    cursor: req.body.cursor
  });
  await cursor.save();
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
