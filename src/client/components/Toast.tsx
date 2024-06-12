import React, { CSSProperties } from 'react';

const Toast = ({
  message,
  open,
  setIsToastOpen
}: {
  message: string;
  open: boolean;
  setIsToastOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const style: CSSProperties = {
    display: open ? 'block' : 'none',
    position: 'fixed',
    top: '5px',
    left: '5px'
  };
  const closeToast = () => {
    setIsToastOpen(false);
  };
  return (
    <div onClick={closeToast} style={style}>
      {message}
    </div>
  );
};

export default Toast;
