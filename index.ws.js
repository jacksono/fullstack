/** @format */

const express = require("express");

const server = require("http").createServer();

const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3001, () => console.log("server sterted on port 3001"));

/*** WebSockets */
const WebSocketServer = require("ws").Server;

const wss = new WebSocketServer({ server: server });
wss.on("connection", function connection(ws) {
  const numClients = wss.clients.size;
  console.log("Clients connected: ", numClients);
  wss.broadcast(`Current visitors: ${numClients}`);

  if (ws.readyState === ws.OPEN) {
    ws.send("Welcome to my server");
  }

  ws.on("close", function close() {
    console.log("Clients connected: ", numClients);
    console.log("the client has disconnected");
  });
});

wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    client.send(data);
  });
};
