import WebSocket, { WebSocketServer } from 'ws';
// import { IncomingMessage } from 'http';
import { v4 as uuidv4 } from 'uuid';
import { MessageProps } from '../client/components/Home';
// import url from 'url';

const server = new WebSocketServer({ port: 8080 });

const connections: { [key: string]: WebSocket } = {};
// const users = {};
let messages: MessageProps[] = [];

const broadcast = (message: string) => {
  if (!JSON.parse(message).typing) {
    messages = [...messages, JSON.parse(message)];
  }

  // const messageObject = JSON.parse(message);
  // if (messageObject.typing) {
  // }
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
    // users[uuid] = {
    //   username: username,
    //   room: room
    // };

    broadcastAllMessages(socket);

    socket.on('message', (message) => {
      console.log(
        `server sending message, ${JSON.parse(message.toString()).text}: `,
        JSON.parse(message.toString()).text
      );
      console.log('message typing: ', JSON.parse(message.toString()).typing);
      // Echo the received message back to the client
      // socket.send(`Server message: ${message}`);
      const messageObj = JSON.parse(message.toString());
      const serverMessage = { ...messageObj, sender: 'server' };

      if (JSON.parse(message.toString()).typing) {
      }
      broadcast(JSON.stringify(serverMessage));
    });

    socket.on('close', () => {
      messages = [];
      console.log('Client disconnected');
    });
  }
);

console.log('WebSocket server is running on ws://localhost:8080');
