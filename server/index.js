
const WebSocket = require('ws');
const { createServer } = require('http');

const { app, session } = require('./app');
const { client: dbClient } = require('./dbConnect');


function onSocketError(err) {
  console.error(err);
}

const server = createServer(app);
const wss = new WebSocket.WebSocketServer({ noServer: true });

const authenticate = (request, next) => {
  if (!request.url) {
    let error = new Error("can not find username from url query");
    return next(error, null);
  }
  let [_, userQuery, roomId] = request.url.split("=");
  const client = { username: userQuery, roomId };
  next(null, client);
}

wss.on('connection', function connection(ws, request, client) {
  ws.on('error', console.error);
  let username;
  ws.on('message', async function message(data) {
    console.log(`Received message ${data} from user ${client.username}`);
    username = client.username;
    const roomCol = dbClient.db('chatty').collection('rooms');
    const msg = {
      username: client.username,
      createdAt: new Date().toISOString(),
      value: data.toString()
    }
    await roomCol.findOneAndUpdate(
      { roomId: +client.roomId },
      { $push: { messages: msg } },
      { returnNewDocument: true }
    );
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(msg));
      }
    });
  });

  ws.on('close', function () {
    session.delete(username);
    console.log("websocket connection closed!");
  });
});

server.on('upgrade', function upgrade(request, socket, head) {
  socket.on('error', onSocketError);

  authenticate(request, function next(err, client) {
    if (err || !client.username) {
      socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
      console.log("error", err, "client", client)
      socket.destroy();
      return;
    }
    socket.removeListener('error', onSocketError);

    wss.handleUpgrade(request, socket, head, function done(ws) {
      wss.emit('connection', ws, request, client);
    });
  });
});

server.listen(8080, '0.0.0.0', () => {
  console.log('Listening on port 8080');
});

