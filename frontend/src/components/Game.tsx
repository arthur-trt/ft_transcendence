import React, { useState, useEffect, useSyncExternalStore } from 'react';
import { MutableRefObject } from 'react';
import { isConstructorDeclaration } from 'typescript';

import { socketo } from '..';
import '../pong.css';

export default function Game() {



  // DEFINE TYPE
  type userT = {
    x: number,
    y: number,
    width: number,
    height: number,
    score: number,
    color: string
  }

  type ballT = {
    x: number,
    y: number,
    radius: number,
    velocityX: number,
    velocityY: number,
    speed: number,
    color: string
  }

  type netT = {
    x: number,
    y: number,
    height: number,
    width: number,
    color: string
  }

  type dataT = {
    userLeftPaddle_x: number,
    userLeftPaddle_y: number,
    userRightPaddle_x: number,
    userRightPaddle_y: number,
    ball_x: number,
    ball_y: number
  }

  const [socket, setSocket] = useState<any>([]);

  // GAME VARIABLE
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  //const [canvas, setCanvas] = useState<any>();
  //const [ctx, setCtx] = useState<any>();

  const [userLeft, setUserLeft] = useState<userT>();
  const [userRight, setUserRight] = useState<userT>();

  const [net, setNet] = useState<netT>();


  useEffect(
    () => {
      const socket = socketo;
      setSocket(socket);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

    }, []
  );



  return (

    <div className='game-container'>
      {/*<button type='button' onClick={handleStart}>Start game</button>*/}
      <div id="start">The game starts in 3 seconds ...</div>
      <canvas ref={canvasRef} />
    </div>
  )
}
