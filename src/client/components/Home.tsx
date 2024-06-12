import React, { useEffect, useRef, useState } from 'react';
import Toast from './Toast';

interface Message {
  text: string;
  sender: 'client' | 'server';
  username: string;
  room: string;
}

const Home = ({ user, room }: { user: string; room: string }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const ws = useRef<WebSocket | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(false);

  useEffect(() => {
    // Create a WebSocket connection
    ws.current = new WebSocket('ws://localhost:8080');

    // Set up event listeners for the WebSocket
    ws.current.onopen = () => {
      console.log('Connected to the WebSocket server');
      setToastMessage(
        `Connected to the WebSocket server. You are in room ${room}`
      );
      setIsToastOpen(true);
    };

    ws.current.onmessage = (event) => {
      setToastMessage(
        `Receving meessage from the server. Server message: ${event.data}`
      );
      const newMessage = JSON.parse(event.data);
      setIsToastOpen(true);
      const isCurrentUser = newMessage.username === user;
      if (!isCurrentUser) {
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage // { text: event.data, sender: 'server', username: user, room: room }
        ]);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  const sendMessage = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const value = e.target.message ? e.target.message.value : e.target.value;
    if (ws.current && value) {
      ws.current.send(
        JSON.stringify({
          text: value,
          sender: 'client',
          username: user,
          room: room
        })
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: value, sender: 'client', username: user, room: room }
      ]);
      setInput('');
    }
  };

  const submitFormRef = useRef<HTMLFormElement>(null);

  const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == 'Enter' && e.shiftKey == false) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <>
      <Toast
        message={toastMessage}
        open={isToastOpen}
        setIsToastOpen={setIsToastOpen}
      />
      <header>
        <h1>
          WebSocket chat
          <span>
            Room: {room} | User: {user}
          </span>
        </h1>
      </header>
      <main>
        <section className='chat'>
          {/* <h2>Messages</h2> */}
          <div className='chat-box'>
            <div className='messages'>
              <ul>
                {messages.map((message, index) => (
                  <li key={index} className={message.sender}>
                    {message.sender === 'server' && (
                      <span className='user-circle server'>
                        {message.username.substring(0, 2)}
                      </span>
                    )}
                    <span>
                      <span>{message.username}</span>
                      <br />
                      {message.text}
                    </span>
                    {message.sender === 'client' && (
                      <span className='user-circle client'>
                        {message.username.substring(0, 2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className='send-text'>
              <form
                className='submit-message'
                ref={submitFormRef}
                onSubmit={sendMessage}>
                <textarea
                  name='message'
                  // type='text'
                  onKeyDown={onEnterPress}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder='Type a message'
                  rows={3}
                />
                <button type='submit'>Send</button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
