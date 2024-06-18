import WebSocket, { WebSocketServer } from 'ws';
// import { IncomingMessage } from 'http';
// import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { MessageProps } from '../client/components/Home';

const server = new WebSocketServer({ port: 8080 });

const connections: { [key: string]: WebSocket } = {};
let users: string[] = [];
let messages: MessageProps[] = [];

let firstConnection: boolean = true;
let connectedTime: Date;

const broadcast = (message: string) => {
  if (!JSON.parse(message).typing) {
    messages = [...messages, JSON.parse(message)];
  }
  Object.keys(connections).forEach((uuid) => {
    connections[uuid].send(`${message}`);
  });
};

const broadcastAllMessages = (connection: WebSocket) => {
  const filteredMessages = messages.filter((message) => {
    return new Date(message.date) >= new Date(connectedTime);
  });

  filteredMessages.forEach((message) => {
    connection.send(JSON.stringify(message));
  });
};

server.on(
  'connection',
  (socket: WebSocket /* , request: IncomingMessage */) => {
    console.log('Client connected');
    if (firstConnection) {
      firstConnection = false;
      connectedTime = new Date();
    }

    // const { username, room } = url.parse(request.url!, true).query;
    const uuid = uuidv4();
    connections[uuid] = socket;

    broadcastAllMessages(socket);

    socket.on('message', (message) => {
      const messageObj = JSON.parse(message.toString());
      const serverMessage = { ...messageObj, sender: 'server' };

      users = users.includes(messageObj.username)
        ? users
        : [...users, messageObj.username];

      broadcast(JSON.stringify(serverMessage));
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  }
);

console.log('WebSocket server is running on ws://localhost:8080');
