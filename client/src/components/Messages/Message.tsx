import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import axios from 'axios';
import style from './Message.module.css';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import { CollectionsOutlined } from '@mui/icons-material';
import { io } from 'socket.io-client';
import SendIcon from '@mui/icons-material/Send';
import { typeState } from '../../redux/reducers/index';

interface message {
  content: string;
  Converseid: string;
  sender: string;
}

export default function Message() {
  const [messages, setMessages] = useState<message[]>();
  const [newMessage, setnewMessage] = useState<string>();
  const [arrivalMessage, setArrivalMessage] = useState<any>();
  const socket: any = useRef();
  const idSender = localStorage.getItem('userId');
  const { ConverseId } = useParams<{ ConverseId: string }>();

  const convers: any = useSelector(
    (state: typeState) => state.conversations
  ).filter(elem => elem._id === ConverseId)[0];

  useEffect(() => {
    const getMessage = async () => {
      try {
        const res = await axios.get(`/message/${ConverseId}`);
        setMessages(res.data);
      } catch (err: any) {
        return err.message;
      }
    };
    getMessage();
  }, [ConverseId]);

  useEffect(() => {
    socket.current = io(
      process.env.REACT_APP_SOCKET_URL || 'http://localhost:3002'
    );
    socket.current.on('getMessage', (data: any) => {
      console.log('DATA QUE MANDA EL SOCKET', data);
      setArrivalMessage({
        sender: data.senderId,
        content: data.text,
      });
    });
  }, []);

  useEffect(() => {
    if (messages !== undefined) {
      arrivalMessage &&
        convers?.members.includes(arrivalMessage.sender) &&
        setMessages((prev: any) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, convers]);

  useEffect(() => {
    socket.current.emit('addUser', idSender);
  }, [localStorage]);

  const receiverId = convers?.members?.find(
    (member: string) => member !== idSender
  );
  console.log('este es receiverId ', receiverId);

  const handleSubmit = async (e: any) => {
    try {
      e.preventDefault();
      socket.current.emit('sendMessage', {
        senderId: idSender,
        receiverId: receiverId,
        text: newMessage,
      });
      const message = {
        sender: idSender,
        content: newMessage,
        Converseid: ConverseId,
      };
      const res = await axios.post('/message', message);
      if (messages !== undefined) {
        setMessages([...messages, res.data]);
        setnewMessage('');
      }
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div>
      <div /* className={style.mensaje} */>
        <div>
          <img
            className='messageImg'
            // src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
            alt=''
          />
          {messages?.map(c => (
            <div className={c.sender !== idSender ? 'other' : 'own'}>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
        <div className={style.inputSubmit}>
          <div className={style.inputChat}>
            <Input
              placeholder='Escribe un mensaje'
              onChange={e => setnewMessage(e.target.value)}
              value={newMessage}
            />
          </div>
          <div className={style.boton}>
            <SendIcon onClick={handleSubmit}></SendIcon>
          </div>
        </div>
      </div>
    </div>
  );
}
