import React, { useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:8080/game');

export default function Game() {

  socket.on('init', () => { });

  const [name, setName] = useState("");
  const [args, setArgs] = useState("");
  let handleSubmit = (e: any) => {
    e.preventDefault();

    socket.emit(name, args);

    //socket.on('joinedRoom', (msg, data) => {
    //  console.log(msg);
    //  console.log(data);
    //});

    socket.onAny((event, ...args) => {
      console.log(event, args);
    });

    //window.location.reload();
    setName("");
    setArgs("");

  }

  return (
    <div className='dontknow'>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          placeholder="Message"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          value={args}
          placeholder="Args"
          onChange={(e) => setArgs(e.target.value)}
        />
        <button type="submit">Add</button>
      </form>
    </div>
  )
}
