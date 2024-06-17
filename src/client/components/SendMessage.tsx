import {
  BaseSyntheticEvent,
  Dispatch,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef
} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faReply } from '@fortawesome/free-solid-svg-icons';

const SendMessage = ({
  input,
  setInput,
  sendMessage
}: {
  input: string;
  setInput: Dispatch<SetStateAction<string>>;
  sendMessage: (e: BaseSyntheticEvent) => void;
}) => {
  //
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    inputRef.current !== null && inputRef.current.focus();
  }, []);

  const submitFormRef = useRef<HTMLFormElement>(null);

  const onEnterPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key == 'Enter' && e.shiftKey == false) {
      e.preventDefault();
      sendMessage(e);
    }
  };

  return (
    <div className='send-message'>
      <form
        className='submit-message'
        ref={submitFormRef}
        onSubmit={sendMessage}>
        <textarea
          ref={inputRef}
          name='message'
          onKeyDown={onEnterPress}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='Type a message'
          rows={3}
        />
        <button type='submit' title='Send message'>
          <FontAwesomeIcon icon={faReply} />
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
