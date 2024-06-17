import React, { useEffect, useRef, useState } from 'react';
import Toast from './Toast';
import SendMessage from './SendMessage';
import Message from './Message';
import Typing from './Typing';

export type MessageProps = {
  text: string;
  sender: 'client' | 'server';
  // userId: string;
  username: string;
  room: string;
  typing: boolean;
};

interface HomeProps {
  user: string;
  room: string;
}

const Home = ({ user, room }: HomeProps) => {
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [input, setInput] = useState<string>('');
  const ws = useRef<WebSocket | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isToastOpen, setIsToastOpen] = useState(true);

  const [whosTyping, setWhosTyping] = useState<string[]>([]);

  useEffect(() => {
    // Create a WebSocket connection
    ws.current = new WebSocket('ws://localhost:8080');
    // ws.current = new WebSocket('wss://websockets-chat.netlify.app/');

    // Set up event listeners for the WebSocket
    ws.current.onopen = () => {
      console.log('Connected to the WebSocket server');
      setToastMessage(
        `You are in the chat room "${room}". Currently there are no user's in the chat room.`
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

      console.log('newMessage.typing', newMessage.typing);

      if (!isCurrentUser && !newMessage.typing) {
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage // { text: event.data, sender: 'server', username: user, room: room }
        ]);
        const index = whosTyping.indexOf(newMessage.username);
        if (index > -1) {
          whosTyping.splice(index, 1);
        }
        setWhosTyping(whosTyping);
      } else if (!isCurrentUser && newMessage.typing) {
        setWhosTyping([...whosTyping, newMessage.username]);
      }
    };

    ws.current.onclose = () => {
      console.log('Disconnected from the WebSocket server');
    };

    return () => {
      ws.current?.close();
    };
  }, []);

  useEffect(() => {
    if (ws.current?.readyState && input !== '') {
      ws.current?.send(
        JSON.stringify({
          text: input,
          sender: 'client',
          username: user,
          room: room,
          typing: true
        })
      );
    }
  }, [input]);

  const sendMessage = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const value = e.target.message ? e.target.message.value : e.target.value;
    if (ws.current && value) {
      ws.current.send(
        JSON.stringify({
          text: value,
          sender: 'client',
          username: user,
          room: room,
          typing: false
        })
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: value,
          sender: 'client',
          // userId: userId,
          username: user,
          room: room,
          typing: false
        }
      ]);
      setInput('');
    }
  };

  console.log('messages', messages);

  console.log(whosTyping);

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current !== null) {
      console.log('XXX: ', messagesRef.current.scrollHeight + 80);
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight + 80;
    }
  }, [messages, whosTyping]);

  return (
    <>
      <Toast
        message={toastMessage}
        status='info'
        isOpen={isToastOpen}
        setIsToastOpen={setIsToastOpen}
      />
      <header>
        <h1>
          Chat room "{room}"<span>Online users: #</span>
        </h1>
      </header>
      <main>
        <section className='chat'>
          <div className='chat-box'>
            <div className='messages' ref={messagesRef}>
              <ul>
                {messages.map((message, index) => (
                  <li key={index} className={message.sender}>
                    <Message message={message} />
                  </li>
                ))}
              </ul>

              {whosTyping.length > 0 && <Typing whosTyping={whosTyping} />}

              <SendMessage
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
              />
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
