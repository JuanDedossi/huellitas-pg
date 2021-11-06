import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Avatar from '@mui/material/Avatar';
import Message from '../Messages/Message';
import Input from '@mui/material/Input'
import {useState, useEffect, useRef} from 'react'
import style from './Messenger.module.css'
import Conversations from '../conversations/Conversation';
import { useDispatch, useSelector } from 'react-redux';
import { typeState } from '../../redux/reducers/index';
import { conversation } from '../../redux/types/types';
import useUser from '../../hooks/useUser';
import { getConvers } from '../../redux/actions';
import { useParams } from 'react-router';
import {io} from "socket.io-client"

export default function BottomAppBar() {
    const [search, setSearch] = useState<string>('');
    const id = localStorage.getItem('userId');
    const [loading, result] = useUser();
    const { ConverseId } = useParams<{ConverseId?:string}>()
    const dispatch = useDispatch();

  useEffect(() => {
    if (result !== 'Unauthorized') {
      const id = localStorage.getItem('userId');
      if (id) {
        dispatch(getConvers(id));
      }
    }
  }, [result]);

  const convers:Array<conversation> = useSelector((state:typeState) => state.conversations);
  
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setSearch(e.target.value);
  }

  if(!Array.isArray(convers)){
    return(
      <div>
        <h1>No conversations</h1>
      </div>
    )
  }else{
    return (
      <div>
          <CssBaseline />
          <Paper square sx={{ pb: '50px',marginTop:3}}>
            {/* <Typography variant="h5" gutterBottom component="div" sx={{ p: 2, pb: 0 }}>
              Mensajes
            </Typography> */}
            <div className={style.container}>
              
            <List  >
            <Input className={style.BarraBusqueda} placeholder="Buscar usuarios" type="text" value={search} onChange={handleChange}/>
              <Conversations/>
            </List>
            </div>
             <div className={ConverseId?style.fondoChat:style.none}>
               <div>
                  {/* {message?.map((m:menssage) => (
                    <Message text={m.content} own={m.sender === id} />
                  ))} */}
                  <Message convers={convers}/>
               </div>
             </div>
            {/* <List sx={{ mb: 2 }} > /}
              {/ {messages.slice(0,5).map(({ id, primary, secondary, person }) => (
                  <React.Fragment key={id}>
                  {id === 1 && (
                      <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                      Hoy
                    </ListSubheader>
                  )}
                  {id === 3 && (
                      <ListSubheader sx={{ bgcolor: 'background.paper' }}>
                      Este mes
                    </ListSubheader>
                  )}
                  <ListItem button>
                    <ListItemAvatar>
                      <Avatar alt="Profile Picture" src={person} />
                    </ListItemAvatar>
                    <ListItemText primary={primary} secondary={secondary.length < 50? secondary:${secondary.slice(0,50)}...}  />
                  </ListItem>
                </React.Fragment>
              ))} /}
    
            {/ </List> /}
            </div>
            <div>
              {currentChat?(
                <div>
                  {/ {message.map((m:object) => (
                    <Messages message={m} own={m.sender===user.id}/>
                  ))} */}
              {/* <span className={style.mensajeComienzo}>Comienza una conversación</span> */}
            {/* </div> */}
          </Paper>
        </div>
      );
    }
  }
