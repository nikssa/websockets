import React, { useEffect, useRef } from 'react';

const Login = ({
  setUserName,
  setRoomName
}: {
  setUserName: React.Dispatch<React.SetStateAction<string>>;
  setRoomName: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current !== null && inputRef.current.focus();
  }, []);

  const createRoom = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const roomName = e.target.roomName.value;
    setUserName(userName);
    setRoomName(roomName);
  };

  const joinRoom = (e: React.BaseSyntheticEvent) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const roomName = e.target.roomName.value;
    setUserName(userName);
    setRoomName(roomName);
  };

  return (
    <>
      <header>
        <h1>Websocket chat</h1>
      </header>

      <main className='login'>
        <section>
          <div className='create'>
            <h2>Create chat room</h2>
            <form onSubmit={createRoom}>
              <input
                name='username'
                type='text'
                placeholder='User name'
                ref={inputRef}
              />
              <input name='roomName' type='text' placeholder='Room name' />
              <button type='submit'>Create room</button>
            </form>
          </div>

          <div className='join'>
            <h2>Join chat room</h2>
            <form onSubmit={joinRoom}>
              <input name='username' type='text' placeholder='User name' />
              <input name='roomName' type='text' placeholder='Room name' />
              <button type='submit'>Join room</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Login;
