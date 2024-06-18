import React, { useEffect, useRef, useState } from 'react';
import Toast from './Toast';
import SendMessage from './SendMessage';
import Message from './Message';
import Typing from './Typing';

export type MessageProps = {
  text: string;
  sender: 'client' | 'server';
  username: string;
  room: string;
  roomUsers: string[];
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

  const [whoIsTyping, setWhoIsTyping] = useState<string[]>([]);

  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    // Create a WebSocket connection
    ws.current = new WebSocket('ws://localhost:8080');

    // Set up event listeners for the WebSocket
    ws.current.onopen = () => {
      console.log('Connected to the WebSocket server');
      setToastMessage(`You are in the chat room "${room}".`);
      setIsToastOpen(true);
    };

    ws.current.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      const isCurrentUser = newMessage.username === user;
      setUsers(newMessage.roomUsers);

      if (!isCurrentUser && !newMessage.typing) {
        setMessages((prevMessages) => [
          ...prevMessages,
          newMessage // { text: event.data, sender: 'server', username: user, room: room, roomUsers: users, typing: false }
        ]);
        const index = whoIsTyping.indexOf(newMessage.username);
        if (index > -1) {
          whoIsTyping.splice(index, 1);
        }
        setWhoIsTyping(whoIsTyping);
      } else if (!isCurrentUser && newMessage.typing) {
        setWhoIsTyping([...whoIsTyping, newMessage.username]);
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
          roomUsers: users.includes(user) ? users : [...users, user],
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
          roomUsers: users.includes(user) ? users : [...users, user],
          typing: false
        })
      );
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: value,
          sender: 'client',
          username: user,
          room: room,
          roomUsers: users.includes(user) ? users : [...users, user],
          typing: false
        }
      ]);
      setInput('');
    }
  };

  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current !== null) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight + 90;
    }
  }, [messages, whoIsTyping]);

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
          Chat room "{room}"
          <span>
            Online users: {users.filter((u) => u !== user).toString()}
          </span>
        </h1>
      </header>
      <main className='chat'>
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

              {whoIsTyping.length > 0 && <Typing whoIsTyping={whoIsTyping} />}

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
