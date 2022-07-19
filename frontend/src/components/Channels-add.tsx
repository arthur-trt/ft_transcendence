import React, { useState, useEffect } from 'react';

// FONT AWESOME SINGLE IMPORT
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

// IMPORT THE SOCKET
import {socketo} from '../index';

let tmp:any[any];
var indents:any = [];

export default function Channels() {

  // VARIABLE DECLARATIONS
  const [socket, setSocket] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [name, setName] = useState("");
  const [datame, setDatame] = useState<any>([]);
  const [datausers, setDatausers] = useState<any>([]);
  let BgColor = 'white';

  // TEST FOR CHAT
  const [chanName, setChanName] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any>([]);

  useEffect(() => {
    const getData = async () => {
        const response = await fetch(
            `/api/user/me`
        );
        let actualData = await response.json();
        setDatame(actualData);
    }
    getData()
    }, [])

  // REACT HOOK TO SET UP SOCKET CONNECTION AND LISTENING
  useEffect(
    () => {
      const socket = socketo;
      // const socket = io('http://localhost:8080');
      setSocket(socket);
      socket.on('rooms', (msg:any, tab:any) => {
        setData(tab);
      });
      socket.on('users', (msg:any, tab:any) => {
        setDatausers(tab);
      });
      socket.on('channelMessage', (msg:any) => {
        // console.log(msg);
          setMessages(msg);
      });

      // return () => {
      //   socket.emit('disconnectUser', name);
      // };
  }, []);

  // FUNCTIONS TO HANDLE ACTIONS ON CHANNELS
  let handleCreate = (e: any) => {
      e.preventDefault(); // to prevent the refresh on submit
      socket.emit('createRoom', name);
      setName("");  
  }
  let handleJoin = (e:any) => {
    socket.emit('joinRoom', e.currentTarget.id);
  }
  let handleDelete = (e:any) => {
    socket.emit('deleteRoom', e.currentTarget.id);
  }
  let handleLeave = (e:any) => {
    socket.emit('leaveRoom', e.currentTarget.id);
  }
  let handleOpen = (e:any) => {
    if (isInChan(e.currentTarget.id) == 0)
      return(0);
    socket.emit('getChannelMessages', e.currentTarget.id);
    setChanName(e.currentTarget.id);
  }

  // DISPLAY CHANNELS
  function display_chan() {
    var indents = [];
    let i = 0;

    while(i < data?.length)
    {
        // set color to green if the main user is in the channel
        let j = 0;
        while (j < data[i]?.users.length)
        {
          if (datame.name == data[i].users[j]?.name) {BgColor = 'springgreen';}
          j++;
        }

        // push every chan div in the array "indents"
        indents.push(<div style={{'backgroundColor': BgColor}} className="channels-single" key={i}>
            <h5>
            {data[i]?.name}
            </h5>
            <FontAwesomeIcon icon={faCircleXmark} className="circlexmark" id={data[i]?.name} onClick={handleDelete} />
            <FontAwesomeIcon icon={faArrowAltCircleRight} className="arrow" id={data[i]?.name} onClick={handleLeave} />
            <FontAwesomeIcon icon={faPlus} className="plus" id={data[i]?.name} onClick={handleJoin} />
            <FontAwesomeIcon icon={faPaperPlane} className="paperplane" id={data[i]?.name} onClick={handleOpen} />
            </div>);
        i++;
        BgColor = 'white';
    }
    return indents;
  }

  // DISPLAY USERS
  function display_users() {
    var indents = [];
    let i = 0;

    while (i < datausers?.length)
    {
      indents.push(<div className="users-single" key={i}>
          <div className='users-single-img'>
            <img src={datausers[i]?.photo}></img>
          </div>
          <div className='users-single-info'>
            <h5>{datausers[i]?.username}</h5>
            <p>{datausers[i]?.userID}</p>
          </div>
      </div>);
      i++; 
    }
    return indents;
  }

  // SEND MESSAGE TO CHANNEL
  let handleMessages = (e:any) => {
    e.preventDefault();
    if (isInChan(e.currentTarget.id) == 0)
      return(0);
    socket.emit('sendChannelMessages', {chan: e.currentTarget.id, msg: message});
    setMessage("");
  }

  // DISPLAY MESSAGES IN THE CHAT
  // need to reverse printing the array of messages because of
  // chat box displaying from bottom to top
  function display_msg() {
    let i = messages.messages?.length -1;
    let msgColor = 'bisque';
    
    if (chanName == messages.name)
    {
      tmp = messages;
    }
    
    if (tmp)
    {
      indents = [];
      i = tmp.messages?.length -1;  
      while (i >= 0)
      {
        if (datame.name == tmp.messages[i]?.sender.name)
          msgColor = 'lightskyblue';
        
        indents.push(<div className='chat-message' key={i + datame.id}>
          <h5>{tmp.messages[i]?.sender.name} <span>{tmp.messages[i]?.sent_at}</span></h5>
          <p style={{'backgroundColor': msgColor}}>{tmp.messages[i]?.message}</p>
        </div>);
        i--;
        msgColor = 'bisque';
      }
    }
    return indents;
  }

  // IS MAIN USER IN THE TARGETED CHANNEL
  let isInChan = (str: string) => {
    let i = 0;
    while(i < data?.length)
    { 
      let j = 0;
      while (j < data[i]?.users.length)
      {
        if (datame.name == data[i].users[j]?.name)
          if (str == data[i]?.name)
            return (1);
        j++;
      }
      i++;
    }
    return(0);
  }

  // DISPLAY CHAT
    let display_chat = (e: any) => {

    return (
      <div className='chat-wrapper' key={0}>
      <div className='chat-title'>#{chanName.toUpperCase()}</div>
      <div className='chat-box'>
        {display_msg()}
      </div>
      <form id={chanName} onSubmit={handleMessages}>
        <input
            type="text"
            value={message}
            placeholder="Send a message..."
            onChange={(e) => setMessage(e.target.value)}
        /> 
      </form>
    </div> 
    )
  }
    
    // PAGE RENDER
    return (

      <div className='community-container'>
        
        <div className='channels-container'>
          <h3>CHANNELS</h3>
          <form onSubmit={handleCreate}>
            <input
              type="text"
              value={name}
              placeholder="Channel name..."
              onChange={(e) => setName(e.target.value)}
            />
            <button type="submit">Create</button>
          </form>
          <div className="channels-list">
              {display_chan()}
          </div>
        </div>

        <div className='chat-container'>
          <h3>CHAT</h3>
          {display_chat(0)}
        </div>

        <div className='users-container'>
          <h3>USERS</h3>
          <div className='users-list'>
              {display_users()}
          </div>
        </div>

      </div>
    )
}