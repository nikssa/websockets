import WebSocket, { WebSocketServer } from 'ws';
// import { IncomingMessage } from 'http';
// import url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { MessageProps } from '../client/components/Home';

const server = new WebSocketServer({ port: 8080 });

const connections: { [key: string]: WebSocket } = {};
let users: string[] = [];
let messages: MessageProps[] = [];

const broadcast = (message: string) => {
  if (!JSON.parse(message).typing) {
    console.log('message', message);
    messages = [...messages, JSON.parse(message)];
    console.log('messages', messages);
  }
  Object.keys(connections).forEach((uuid) => {
    connections[uuid].send(`${message}`);
  });
};

const broadcastAllMessages = (connection: WebSocket) => {
  console.log('broadcasting all messages, messages: ', messages);
  messages.forEach((message) => {
    connection.send(JSON.stringify(message));
  });
};

server.on(
  'connection',
  (socket: WebSocket /* , request: IncomingMessage */) => {
    console.log('Client connected');
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
      console.log('users', users.toString());

      broadcast(JSON.stringify(serverMessage));
    });

    socket.on('close', () => {
      console.log('Client disconnected');
    });
  }
);

console.log('WebSocket server is running on ws://localhost:8080');
