const express = require("express");
const app = express();
const server = require("http").createServer(app);
const path = require("path");

app.use(express.static(path.join(__dirname, "/dist")));

// Send all other requests to the Angular app
app.all("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/dist", "index.html"));
});
server.listen(3000, () => {
  console.log("Server is Running");
});
