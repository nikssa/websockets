import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import Home from './components/Home';
import './App.scss';

const App: React.FC = () => {
  const [userName, setUserName] = useState('');
  const [roomName, setRoomName] = useState('');
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    setIsIn(!!userName && !!roomName);
  }, [userName, roomName]);

  return (
    <div className='App'>
      {!isIn ? (
        <Login setUserName={setUserName} setRoomName={setRoomName} />
      ) : (
        <Home user={userName} room={roomName} />
      )}
    </div>
  );
};

export default App;
