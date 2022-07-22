import React, { useState, useEffect } from 'react';
import '../index.css';
import { Link } from 'react-router-dom';

// FONT AWESOME SINGLE IMPORT
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faUserGroup } from '@fortawesome/free-solid-svg-icons'

// IMPORT THE SOCKET
import {socketo} from '../index';

let tmp:any[any];
var indents:any = [];
let indexFriends = 0;

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

  // DISPLAY FRIENDS LIST
  const [switching, setSwitching] = useState(0);
  const [friends, setFriends] = useState<any>([]);
  const [friendsrequest, setFriendsRequest] = useState<any>([]);
  const [UsersBtnColor, setUsersBtnColor] = useState('#1dd1a1');
  const [FriendsBtnColor, setFriendsBtnColor] = useState('white');


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
      setSocket(socket);
      socket.emit('getRooms');
      socket.emit('getUsers');
      socket.emit('getFriends');
      socket.emit('getFriendRequests');
      socket.on('rooms', (msg:any, tab:any) => {
        setData(tab);
      });
      socket.on('listUsers', (tab:any) => {
        setDatausers(tab);
      });
      socket.on('channelMessage', (msg:any) => {
          setMessages(msg);
      });
      socket.on('friendList', (msg:any, tab:any) => {
        // console.log(tab);
        setFriends(tab);
    });
    socket.on('newFriendRequest', (msg:any, tab:any) => {
      // console.log(tab);
      setFriendsRequest(tab);
  });
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
  let handleAddFriend = (e:any) => {
    socket.emit('addFriend', datausers[parseInt(e.currentTarget.id)]);
  }
  let handleAcceptFriend = (e:any) => {
    let i = 0;
    while (i < datausers?.length)
    {
      if (datausers[i]?.id === friendsrequest[parseInt(e.currentTarget.id)].sender.id)
        socket.emit('acceptFriend', datausers[i]);
      i++;
    }
  }
  let handleRemoveFriend = (e:any) => {
    let i = 0;
    while (i < datausers?.length)
    {
      if (datausers[i]?.id === friends.friends[parseInt(e.currentTarget.id)].id)
        socket.emit('removeFriend', datausers[i]);
      i++;
    }
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
          if (datame.name == data[i].users[j]?.name) {BgColor = '#1dd1a1';}
          j++;
        }

        // push every chan div in the array "indents"
        indents.push(<div style={{'backgroundColor': BgColor}} className="channels-single" key={i} id={data[i]?.name} onClick={handleOpen}>
            <h5>
            {data[i]?.name}
            </h5>
            <FontAwesomeIcon icon={faCircleXmark} className="circlexmark" id={data[i]?.name} onClick={handleDelete} />
            <FontAwesomeIcon icon={faArrowAltCircleRight} className="arrow" id={data[i]?.name} onClick={handleLeave} />
            <FontAwesomeIcon icon={faPlus} className="plus" id={data[i]?.name} onClick={handleJoin} />
            </div>);
        i++;
        BgColor = 'white';
    }
    return indents;
  }

  function displayButtonAddFriend(i: number) {
    let j = 0;
    while (j < friends?.friends?.length)
    {
      if (datausers[i]?.id === friends?.friends[i]?.id)
        return (<FontAwesomeIcon className='usergroup' icon={faUserGroup}></FontAwesomeIcon>);
      j++;
    }
   return (
    <button id={i.toString()} onClick={handleAddFriend}>Add as friend</button>
   ) 
  }

  // DISPLAY USERS
  function display_users() {
    var indents = [];
    let i = 0;
    let borderStatus = 'white';
    let profilelink;

    if (switching % 2 === 0)
    {
      while (i < datausers?.length)
      {
        profilelink = "/profile/" + datausers[i]?.id;
        if (datausers[i]?.status === 'online')
          borderStatus = 'springgreen';
        else if (datausers[i]?.status === 'ingame')
          borderStatus = 'orange';
        else if (datausers[i]?.status === 'offline')
          borderStatus = 'red';
        
        indents.push(<div className="users-single" key={i}>
            <div className='users-single-img'>
              <Link to={profilelink}><img style={{'borderColor': borderStatus}} src={datausers[i]?.avatar_url}></img></Link>
            </div>
            <div className='users-single-info'>
              <h5>{datausers[i]?.name}</h5>
              {displayButtonAddFriend(i)}
            </div>
        </div>);
        i++;
        borderStatus = 'white';
      }
    }
    if (switching % 2 === 1)
    {
      while (i < friendsrequest?.length)
      {
        indents.push(<div className='friendsrequest-single' key={i + 111}>
              <div className='friendsrequest-single-img'>
                <img src={friendsrequest[i].sender.avatar_url}></img>
              </div>
              <div className='friendsrequest-single-name'>
                <p>{friendsrequest[i]?.sender.name}</p>
              </div>
              <div className='friendsrequest-single-button'>
                <button id={i.toString()} onClick={handleAcceptFriend}>Accept</button>
              </div>
        </div>);
        i++;
      }
      i = 0;
      while (i < friends?.friends.length)
      {
        profilelink = "/profile/" + friends?.friends[i]?.id;
        indents.push(<div className="friends-single" key={i}>
            <div className='friends-single-img'>
              <Link to={profilelink}><img src={friends.friends[i]?.avatar_url}></img></Link>
            </div>
            <div className='friends-single-info'>
              <h5>{friends.friends[i]?.name}</h5>
              <button id={i.toString()} onClick={handleRemoveFriend}>Remove friend</button>
            </div>
        </div>);
        i++;
      }
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
    let i;
    if (messages)
      i = messages.messages?.length -1;
    let msgColor = 'bisque';
    
    if (messages)
      if (chanName == messages.name)
        tmp = messages;
    
    if (tmp)
    {
      indents = [];
      i = tmp.messages?.length -1;  
      while (i >= 0)
      {
        if (datame.name == tmp.messages[i]?.sender.name)
          msgColor = 'lightskyblue';
        
        indents.push(<div className='chat-message' key={i + datame.id}>
          <h5>{tmp.messages[i]?.sender.name} <span>{tmp.messages[i]?.sent_at.substr(0, 10)}</span></h5>
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

  function handleUsers() {
    if (switching % 2 === 1)
    {
      setUsersBtnColor('#1dd1a1');
      setFriendsBtnColor('white');
      indexFriends++;
      setSwitching(indexFriends);
    }
  }
  function handleFriends() {
    if (switching % 2 === 0)
    {
      setUsersBtnColor('white');
      setFriendsBtnColor('#1dd1a1');
      indexFriends++;
      setSwitching(indexFriends);
    }
  }

    // PAGE RENDER
    return (

      <div className='community-container'>
        
        <div className='channels-container'>
          {/* <h3>CHANNELS</h3> */}
          <form onSubmit={handleCreate}>
            <input
              type="text"
              value={name}
              placeholder="Create channel..."
              onChange={(e) => setName(e.target.value)}
            />
          </form>
          <div className="channels-list">
              {display_chan()}
          </div>
        </div>

        <div className='chat-container'>
          {/* <h3>CHAT</h3> */}
          {display_chat(0)}
        </div>

        <div className='users-container'>
          {/* <h3>USERS</h3> */}
          <div className='users-tab'>
            <button style={{backgroundColor: UsersBtnColor}} onClick={handleUsers}>USERS</button>
            <button style={{backgroundColor: FriendsBtnColor}} onClick={handleFriends}>FRIENDS</button>
          </div>
          <div className='users-list'>
              {display_users()}
          </div>
        </div>

      </div>
    )
}