import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080');

export default function Channels() {

    socket.on('init', () => {});

    const [name, setName] = useState("");
    let handleSubmit = (e: any) => {
    e.preventDefault();

    socket.emit('joinRoom', name);

    socket.on('joinedRoom', (msg, data) => {
      console.log(msg);
      console.log(data);
    });
    
    window.location.reload();
    setName("");  

    }

    return (
      <div className='chan-add'>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            placeholder="channel name..."
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Add</button>
        </form>
      </div>
    )
}