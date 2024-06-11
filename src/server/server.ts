import WebSocket, { WebSocketServer } from 'ws';
// import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
// import url from 'url';

const server = new WebSocketServer({ port: 8080 });

const connections: { [key: string]: WebSocket } = {};
// const users = {};

const broadcast = (message: string) => {
  console.log('broadcast message, connections: ', connections);

  Object.keys(connections).forEach((uuid) => {
    // console.log('uuid: ', uuid);
    // console.log('connection: ', connections[uuid]);
    connections[uuid].send(`${message}`);
  });
};

server.on(
  'connection',
  (socket: WebSocket /* , request: IncomingMessage */) => {
    console.log('Client connected');

    // const { username, room } = url.parse(request.url!, true).query;

    const uuid = uuidv4();
    connections[uuid] = socket;
    // users[uuid] = {
    //   username: username,
    //   room: room
    // };

    socket.on('message', (message) => {
      console.log('Received:', message.toString());

      // Echo the received message back to the client
      // socket.send(`Server: ${message}`);
      const messageObj = JSON.parse(message.toString());
      const serverMessage = { ...messageObj, sender: 'server' };
      // console.log('serverMessage', serverMessage);
      broadcast(JSON.stringify(serverMessage));
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  }
);

console.log('WebSocket server is running on ws://localhost:8080');
