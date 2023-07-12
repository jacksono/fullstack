/** @format */

const express = require("express");

const server = require("http").createServer();

const app = express();

app.get("/", function (req, res) {
  res.sendFile("index.html", { root: __dirname });
});

server.on("request", app);

server.listen(3001, () => console.log("server sterted on port 3001"));


process.on("SIGINT", () => {
  wss.clients.forEach((client) => client.close());
  server.close(() => {
    shutdownDB();
  });
});

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

  db.run(`INSERT INTO visitors (count, time)
        VALUES (${numClients}, datetime('now'))
  `);

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

// Database stuff begin
const sqlite = require("sqlite3");

const db = new sqlite.Database(":memory:");

db.serialize(() => {
  db.run(`
        CREATE TABLE visitors (
          count INTEGER,
          time TEXT
        )
  `);
});

const getCounts = () => {
  db.each("SELECT * FROM visitors", (error, row) => {
    console.log(row);
  });
};

const shutdownDB = () => {
  getCounts();
  console.log("Shutting down");

  db.close();
};
