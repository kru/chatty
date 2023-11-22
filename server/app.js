const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;

const { client } = require('./dbConnect');
const { ObjectId } = require('mongodb');

const session = new Map();

const handlers = {};

handlers.ping = function (data, callback) {
  const { method } = data;

  switch (method) {
    case 'get':
      return callback(200, { 'message': 'pong' });

    default:
      callback(404, null);
  }
};

handlers.notFound = function (data, callback) {
  callback(404);
};

async function handleJoin(data, callback) {
  const { payload, dbClient } = data;

  const { username, roomId } = JSON.parse(payload);

  if (!username || !roomId) {
    return callback(400, { 'message': 'username or roomId is required!' });
  }
  let isJoined = session.get(username);
  if (isJoined) {
    return callback(409, { 'message': `user ${username} has joined` });
  }

  const chattyDB = dbClient.db('chatty');
  const roomCol = await chattyDB.collection('rooms');
  let room = await roomCol.findOne({ roomId: +roomId });

  if (!room) {
    return callback(404, { 'message': `roomId ${roomId} not found` });
  }

  let user = await chattyDB.collection('users').findOne({ username });

  let userId;
  if (!user) {
    const { insertedId } = await chattyDB
      .collection('users')
      .insertOne({ "_id": new ObjectId(), username, createdAt: new Date() });
    userId = insertedId;
  }

  user = { username, _id: userId }
  // set dumb session
  session.set(username, roomId);
  return callback(200, { 'message': `joined room ${roomId} successfully`, user });
}

handlers.join = function (data, callback) {
  switch (data.method) {
    case 'post':
      return handleJoin(data, callback);

    default:
      callback(404, null);
  }
};

handlers.logout = function (data, callback) {
  switch (data.method) {
    case 'post': {
      const { payload } = data;
      const { username } = JSON.parse(payload);
      session.delete(username);
      return callback(200, { 'message': 'logout succesfully' });
    }
    default:
      callback(404, null);
  }

};

async function handleMessages(data, callback) {
  const { payload, dbClient } = data;

  const { roomId } = JSON.parse(payload);

  if (!roomId) {
    return callback(400, { 'message': 'roomId is required!' });
  }

  const roomCol = dbClient.db('chatty').collection('rooms');

  const room = await roomCol.findOne({ roomId: +roomId });

  return callback(200, { 'message': `data room ${roomId} fetched succesfully`, room });
}

handlers.messages = function (data, callback) {
  switch (data.method) {
    case 'post':
      return handleMessages(data, callback);

    default:
      callback(404, null);
  }
}

async function handleRoom(data, callback) {
  const { payload, dbClient } = data;

  const { roomId, name } = JSON.parse(payload);

  if (!roomId || !name) {
    return callback(400, { 'message': 'roomId and name is required!' });
  }

  const roomCol = dbClient.db('chatty').collection('rooms');

  await roomCol.insertOne({ _id: new ObjectId(), roomId: +roomId, name, messages: [], createdAt: new Date().toISOString() });

  return callback(200, { 'message': `room ${roomId} created succesfully` });
}

handlers.rooms = function (data, callback) {
  switch (data.method) {
    case 'post':
      return handleRoom(data, callback);

    default:
      callback(404, null);
  }
}

const router = {
  'ping': handlers.ping,
  'join': handlers.join,
  'logout': handlers.logout,
  'messages': handlers.messages,
  'rooms': handlers.rooms
};

const app = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET, DELETE, PUT, PATCH, TRACE, CONNECT');
  res.setHeader('Access-Control-Max-Age', 2592000);
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Request-Method', '*');
  if (req.method === "OPTIONS") {
    const headers = {
      "Access-Control-Allow-Origin": '*',
      'Access-Control-Allow-Methods': 'OPTIONS, POST, GET, DELETE, PUT, PATCH, TRACE, CONNECT',
      'Access-Control-Max-Age': 2592000,
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Request-Method': '*'
    }
    res.writeHead(204, headers);
    res.end();
    return;
  }
  const parsedUrl = url.parse(req.url, true);

  const path = parsedUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, '');

  const queryStringObject = parsedUrl.query;

  const method = req.method.toLowerCase();

  const headers = req.headers;

  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', (data) => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();

    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead.
    const chosenHandler = typeof (router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;
    // Construct the data object to send to the handler
    const data = {
      'trimmedPath': trimmedPath,
      'queryStringObject': queryStringObject,
      'method': method,
      'headers': headers,
      'payload': buffer,
      'dbClient': client,
    }

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      payload = typeof (payload) == 'object' ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type', 'application/json');
      res.writeHead(statusCode);
      res.end(payloadString);
      console.log("response: ", statusCode, payloadString);
    });
  });
};

module.exports = { app, session };