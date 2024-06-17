import { Dispatch, SetStateAction } from 'react';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Toast.scss';

const Toast = ({
  message,
  status,
  isOpen,
  setIsToastOpen
}: {
  message: string;
  status: 'info' | 'success' | 'warning' | 'error';
  isOpen: boolean;
  setIsToastOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  //
  const handleClick = () => {
    setIsToastOpen(false);
  };

  return (
    <div className={`toast ${isOpen && 'open'} ${status}`}>
      <p>{message}</p>
      <FontAwesomeIcon
        className='close-btn'
        icon={faClose}
        size='xl'
        onClick={handleClick}
      />
    </div>
  );
};

export default Toast;
