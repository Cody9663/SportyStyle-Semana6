const https = require("https");
const fs = require("fs");
const express = require("express");
const path = require("path");

const app = express();

const options = {
  key: fs.readFileSync(path.join(__dirname, "certs", "key.pem")),
  cert: fs.readFileSync(path.join(__dirname, "certs", "cert.pem"))
};

app.use(express.static(__dirname));

https.createServer(options, app).listen(3000, () => {
  console.log("Servidor HTTPS funcionando en https://localhost:3000");
});