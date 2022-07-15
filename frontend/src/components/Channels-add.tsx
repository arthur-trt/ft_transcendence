import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// FONT AWESOME SINGLE IMPORT
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons'

export default function Channels() {

  // VARIABLE DECLARATIONS
  const [socket, setSocket] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [name, setName] = useState("");
  const [datame, setDatame] = useState<any>([]);
  const [datausers, setDatausers] = useState<any>([]);
  let BgColor = 'white';

  // REACT HOOK TO SET UP SOCKET CONNECTION AND LISTENING
  useEffect(
    () => {
      const socket = io('http://localhost:8080');
      setSocket(socket);
      socket.on('rooms', (msg:any, tab:any) => {
        // console.log(msg);
        setData(tab);
      });
      socket.on('users', (msg:any, tab:any) => {
        // console.log(msg);
        // console.log(tab);
        setDatausers(tab);
      });
      return () => {console.log("coucou")};
  }, []);

  // FETCHING API TO GET INFO FROM THE MAIN USER (NAME TO COMPARE WITH CHANNELS USERS)
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

  // FUNCTIONS TO HANDLE ACTIONS ON CHANNELS
  let handleCreate = (e: any) => {
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
        indents.push(<div style={{'backgroundColor': BgColor}} className="uniquechan" key={i}>
            <h5>
            {data[i]?.name}
            </h5>
            <FontAwesomeIcon icon={faCircleXmark} className="circlexmark" id={data[i]?.name} onClick={handleDelete} />
            <FontAwesomeIcon icon={faArrowAltCircleRight} className="arrow" id={data[i]?.name} onClick={handleLeave} />
            <FontAwesomeIcon icon={faPlus} className="plus" id={data[i]?.name} onClick={handleJoin} />
            <FontAwesomeIcon icon={faPaperPlane} className="paperplane" id={data[i]?.name} onClick={display_chat} />
            </div>);
        i++;
        BgColor = 'white';
    }
    // we return the array that contains every chan
    return indents;
  }

  function display_users() {
    var indents = [];
    let i = 0;

    while (i < datausers?.length)
    {
      indents.push(<div className="one-user" key={i}>
          <div className='one-user-img'>
            <img src={datausers[i]?.photo}></img>
          </div>
          <div className='one-user-info'>
            <h5>{datausers[i]?.username}</h5>
            <p>{datausers[i]?.userID}</p>
          </div>
      </div>);
      i++; 
    }
    return indents;
  }

  function display_chat() {
    // console.log("send message");
    return (
      <div>Coucou</div>
    )
  }
    
    return (

      <div className='chan-container'>

      <div className='chan-add'>
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
        <div className="everychan">
            {display_chan()}
        </div>
      </div>

      <div className='chat'>
        <h3>CHAT</h3>
        {display_chat()}
      </div>

      <div className='connected-users'>
        <h3>CONNECTED USERS</h3>
        <div className='users-list'>
            {display_users()}
        </div>
      </div>

      </div>
    )
}