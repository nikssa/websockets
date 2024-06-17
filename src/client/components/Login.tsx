import {
  BaseSyntheticEvent,
  Dispatch,
  SetStateAction,
  useEffect,
  useRef
} from 'react';
import { v4 as uuidv4 } from 'uuid';

const Login = ({
  setUserName,
  setRoomName
}: {
  setUserName: Dispatch<SetStateAction<string>>;
  setRoomName: Dispatch<SetStateAction<string>>;
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    inputRef.current !== null && inputRef.current.focus();
  }, []);

  const createRoom = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const userId = uuidv4();
    const userName = e.target.username.value;
    const roomName = e.target.roomName.value;
    setUserName(userName);
    setRoomName(roomName);
  };

  const joinRoom = (e: BaseSyntheticEvent) => {
    e.preventDefault();
    const userName = e.target.username.value;
    const roomName = e.target.roomName.value;
    setUserName(userName);
    setRoomName(roomName);
  };

  return (
    <>
      <header className='login'>
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
