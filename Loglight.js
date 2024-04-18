const process = require("process");
const path = require("path");
const fs = require("fs");
const url = require("url");
const http = require("http");
const portArgIndex = process.argv.indexOf("-p");
let PORT;
let DEFAULT_PORT = 8090;

if (portArgIndex !== -1 && process.argv.length > portArgIndex + 1) {
  const portString = process.argv[portArgIndex + 1];
  const port = parseInt(portString, 10);

  if (isNaN(port)) {
    PORT = DEFAULT_PORT; // Default port
  } else {
    PORT = port;
  }
} else {
  PORT = DEFAULT_PORT; // Default port
}

const { WebSocketServer } = require("ws");

const server = http.createServer();
const wsServer = new WebSocketServer({ server });

const LOGGER = "logger";

const connections = {};
const devTools = {};

const broadcast = () => {
  try {
    const message = JSON.stringify(devTools);
    const app = Object.keys(devTools).find((key) => key !== LOGGER) || "application";
    const msgJson = JSON.parse(message);
    if (JSON.stringify(msgJson[app]?.state)) {
      const msg = JSON.stringify(msgJson[app].state);
      connections[LOGGER].send(msg);
    }
  } catch (e) {
    console.log(e);
  }
};

const handleMessage = (bytes, appName) => {
  try {
    const message = JSON.parse(bytes.toString());
    const logger = devTools[appName];

    logger.state = message;

    broadcast();
  } catch (e) {
    console.log(e);
  }
};

const handleClose = (appName) => {
  try {
    delete connections[appName];
    delete devTools[appName];
    broadcast();
  } catch (e) {
    console.log(e);
  }
};

const updateApplicationConnected = () => {
  try {
    const appNames = { connection: Object.keys(devTools) };
    connections[LOGGER].send(JSON.stringify(appNames));
  } catch (e) {
    console.log(e);
  }
};

wsServer.on("connection", (connection, request) => {
  const { appName } = url.parse(request.url, true).query;
  console.log(`${appName} connected`);

  connections[appName] = connection;
  devTools[appName] = {
    appName,
    state: {},
  };

  updateApplicationConnected();

  console.log("===>", Object.keys(devTools));

  connection.on("message", (message) => handleMessage(message, appName));
  connection.on("close", () => handleClose(appName));
});

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname;

  // Serve the index.html for root path (/)
  if (pathname === "/" || pathname === "") {
    const filePath = path.join(__dirname, `public/index.html`);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Not found");
      } else {
        res.setHeader("Content-Type", "text/html");
        res.end(data);
      }
    });
  } else {
    // Serve static files from the public folder
    const filePath = path.join(__dirname, "public", pathname);
    const extname = path.extname(filePath);

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end("Not found");
      } else {
        let contentType = "text/plain"; // Default content type
        switch (extname) {
          case ".html":
            contentType = "text/html";
            break;
          case ".css":
            contentType = "text/css";
            break;
          case ".js":
            contentType = "text/javascript";
            break;
        }
        res.setHeader("Content-Type", contentType);
        res.end(data);
      }
    });
  }
});

server.listen(PORT, () => {
  console.log(`WebSocket Server is running on port ${PORT}`);
  console.log(`Open the logger:   http://localhost:${PORT}`);
});
