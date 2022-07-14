import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Friends from './Friends';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowAltCircleRight } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'

export default function Channels() {

  const [socket, setSocket] = useState<any>([]);
  const [data, setData] = useState<any>([]);
  const [name, setName] = useState("");
  const [datame, setDatame] = useState<any>([]);
  let BgColor = 'white';

  useEffect(
    () => {
      const socket = io('http://localhost:8080');
      setSocket(socket);
      socket.on('rooms', (msg:any, tab:any) => {
        // console.log(msg);
        setData(tab);
      });
      socket.on('users', (msg:any, tab:any) => {
        console.log(msg);
        console.log(tab);
	  });
	  socket.on('channelMessage', (msg:any, tab:any) => {
        console.log(msg);
        console.log(tab);
      });

  }, []);

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


  let handleCreate = (e: any) => {
      socket.emit('createRoom', name);

      setName("");
  }

  let handleJoin = (e:any) => {
	  socket.emit('joinRoom', e.currentTarget.id);
	  handleHello(e);
  }

  let handleDelete = (e:any) => {
    socket.emit('deleteRoom', e.currentTarget.id);
  }

  let handleLeave = (e:any) => {
    socket.emit('leaveRoom', e.currentTarget.id);
  }

  let handleHello = (e:any) => {
    socket.emit('sendChannelMessage',  e.currentTarget.id);
  }


  function display() {
    var indents = [];
    let i = 0;

    while(i < data?.length)
    {
        // CHANGE COLOR IF USER IS IN CHANNEL
        let j = 0;
        while (j < data[i]?.users.length)
        {
          if (datame.name == data[i].users[j]?.name) {BgColor = 'springgreen';}
          j++;
        }

        // PUSH CHAN DIV IN ARRAY
        indents.push(<div style={{'backgroundColor': BgColor}} className="uniquechan" key={i}>
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

    return (

      <div className='chan-container'>

      <div className='chan-add'>
        <h3>CHANNELS</h3>
        <form onSubmit={handleCreate}>
          <input
            type="text"
            value={name}
            placeholder="channel name..."
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
        <div className="everychan">
            {display()}
        </div>
      </div>

      <div className='chat'>
        <h3>CHAT</h3>
      </div>

      <div className='friends'>
        <h3>FRIENDS</h3>
        <Friends/>
      </div>

      </div>
    )
}
