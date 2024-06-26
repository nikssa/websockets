import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { MessageProps } from './Home';
import './Message.scss';

const Message = ({ message }: { message: MessageProps }) => {
  return (
    <>
      {message.sender === 'server' && (
        <span className='user-circle server'>
          <FontAwesomeIcon icon={faUserCircle} fontSize='7rem' />
        </span>
      )}

      <span className='message-wrapper'>
        <span className='user-name'>
          {message.sender === 'client' &&
            `${new Date(message.date).toLocaleString()} | `}
          {message.username}
          {message.sender === 'server' &&
            ` | ${new Date(message.date).toLocaleString()}`}
        </span>
        <span className='message'>{message.text}</span>
      </span>

      {message.sender === 'client' && (
        <span className='user-circle client'>
          <FontAwesomeIcon icon={faUserCircle} fontSize='7rem' />
        </span>
      )}
    </>
  );
};

export default Message;
