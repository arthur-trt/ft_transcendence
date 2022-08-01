import { getKeyEventProps } from '@testing-library/user-event/dist/types/utils';
import React, { useState, useEffect } from 'react';

import { socketo } from '..';

export default function Game() {
  // DEFINE TYPE
  type userT = {
    x: number,
    y: number,
    width: number,
    height: number,
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
    player1_paddle_y: number,
    player2_paddle_y: number,
    ball_x: number,
    ball_y: number
  }

  const [socket, setSocket] = useState<any>([]);

  // GAME VARIABLE
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const [canvas, setCanvas] = useState<any>();
  const [ctx, setCtx] = useState<any>();
  const [matchMaking, setMatchMaking] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<boolean>(false);
  const [gameStart, setGameStart] = useState<boolean>(false);

  const [userLeft, setUserLeft] = useState<userT>({
    x: 10,
    y: 0,
    width: 10,
    height: 30,
    color: "DEEPSKYBLUE"
  });
  const [userRight, setUserRight] = useState<userT>({
    x: 20,
    y: 0,
    width: 10,
    height: 30,
    color: "FIREBRICK"
  });

  const [ball, setBall] = useState<ballT>({
     x: 0,
     y: 0,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "BLACK"
  });

  let [P1score, setP1Score] = useState(0);
  let [P2score, setP2Score] = useState(0);

  const [net, setNet] = useState<netT>(
    {
      x: 0,
      y: 0,
      height: 30,
      width: 15,
      color: "BLACK"
    });

  const [data, setData] = useState<dataT>();

  useEffect(
    () => {
      const socket = socketo;
      setSocket(socket);
      const canvas = canvasRef.current;
      if (canvas) {
        //canvas.height = canvas.clientHeight;
        canvas.width = window.innerWidth * 0.7; 
        //canvas.width = canvas.clientWidth;
        canvas.height = canvas.width * 0.6;
        setCanvas(canvas);
      }
      if (canvas) {
        setCtx(canvas.getContext("2d"));
      }

      if (canvas)
      {
        const tmp : ballT = {
          x: canvas.width/2,
          y : canvas.height/2,
          radius: canvas.height * 0.01,
          velocityX:5,
          velocityY:5,
          speed:7,
          color:"BLACK"
        }
        setBall(tmp);
        setNet({x : canvas.width/2, y : 0, height : 20, width : 5, color : "BLACK"});
        setUserLeft({x : canvas.width * 0.01, y : 0, width: canvas.width * 0.01, height: canvas.height * 0.1, color: "DEEPSKYBLUE"});
        setUserRight({x : canvas.width * 0.98, y : 0, width: canvas.width * 0.01, height: canvas.height * 0.1, color: "FIREBRICK"});
      }
      socket.on('game_position', (pos: dataT) => {
        //console.log(canvas);
        //console.log("socket.on/game_position");
        setData(adaptToCanvas(pos, canvas));
      });

      socket.on('game_countdownStart', () => {
        console.log("socket.on/game_countdown");
        setCountdown(true);
      })

      socket.on('update_score', (res : Boolean) => {
        console.log(res + " " + P1score);
        if (res == true)
        {
          setP1Score(P1score + 1);
          P1score++;
        }
        else
        {
          setP2Score(P2score + 1);
          P2score++;
        }
      })
    }, []);

  // Wait for context to be ready.
  useEffect(() => {
    if (canvas && ctx)
    {
        ctx.fillStyle = "BLACK";
        ctx.font = "48px serif";
        ctx.textAlign = "center"
        ctx.fillText("Cliquez ici pour jouer !", canvas.width / 2, canvas.height / 2);
    }
  }, [ctx])

  let i = 0;
  let inter : any;

  useEffect(() => {
    if (canvas && ctx)
    {
      ctx.fillStyle = "RED";
      ctx.font = "48px serif";
      ctx.textAlign = "center"
      ctx.fillText("Le jeu va démarrer dans 4 secondes !", canvas.width / 2, canvas.height / 2);
      inter = setInterval(count_function, 1000);
    }
  }, [countdown])

  function count_function()
  {
    console.log("count");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText("Le jeu va démarrer dans " + (3 - i) + " secondes !", canvas.width / 2, canvas.height / 2);
    if (i === 3)
    {
      clearInterval(inter);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setGameStart(true);
    }
    else
      i++;
  }

  useEffect(() => {
    console.log("useEffect/game_start" + gameStart);
    if (gameStart === true)
      socket.emit('game_start');
  }, [gameStart]);

  useEffect(() => {
    //console.log("useEffect/render");
    if (canvas && ctx)
    {
      //console.log("render is triggered")
      if (data)
        render(data);
      //blabla les fonctions
    }
  }, [data])

  const [MoveUp, setMoveUp] = useState<boolean>(false);
  const [MoveDown, setMoveDown] = useState<boolean>(false);

  document.addEventListener('keydown', (e) => {
    if (gameStart) {
      if (e.key === 'w' && MoveUp === false)
        setMoveUp(true);

      if (e.key === 's' && MoveDown === false)
        setMoveDown(true);
    }
  }, {once : true});

  document.addEventListener('keyup', (e) => {
    if (gameStart) {
      if (e.key === 'w' && MoveUp === true)
        setMoveUp(false);

      if (e.key === 's' && MoveDown === true)
        setMoveDown(false);
    }
  }, {once : true});

  useEffect(() => {
    if (gameStart) {
      if (MoveUp === true) {
        console.log("front MoveUp");
        socket.emit('MoveUp')
      }
      if (MoveDown === true) {
        console.log("front MoveUDown");
        socket.emit('MoveDown')
      }
      if (MoveUp === false && MoveDown === false) {
        socket.emit('StopMove');
        console.log("front STOP move");
      }
    }
  }, [MoveUp, MoveDown]);

  /**
   * Draw a rectangle on the canva
   * @param x X position of the rectangle
   * @param y Y position of the rectangle
   * @param w Weidth of the rectangle
   * @param h Heigth of the rectangle
   * @param color Color to draw
   */
  function drawRect(x: number, y: number, w: number, h: number, color: string) {
    if (ctx != null) {
      // console.log(" DRAW ME BITCH"); // ????? un peu vnr ?
      // console.log(x + " " + y + " " + w + " " + h);
      // console.log(canvas.height);
      // console.log(canvas.width);
      // console.log(color);
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
    }
  }

  /**
   * Draw a circle on the canva
   * @param x X position of the circle
   * @param y Y poistion of the circle
   * @param r Radius of the circle
   * @param color Color of the circle
   */
  function drawArc(x: number, y: number, r: number, color: string) {
    if (ctx != null) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2, true);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawNet() {
    if (net) {
      for (let i = 0; i <= canvas.height; i += 15 + net.height) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
      }
    }
  }

  function drawText(text: string, x: number, y: number, color: string, font: string) {
    //console.log(ctx);
    if (ctx != null) {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    }
  }

  function render(data: dataT) {
    if (ctx) {
      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw score for userLeft
      // drawText("PLAYER 1", canvas.width * 0.2, canvas.height * 0.1, '#00000080', "48px serif");
      drawText(P1score.toString(), canvas.width / 4, canvas.height / 5, '#00000080', "48px serif");

      // Draw score for userRight
      // drawText("PLAYER 2", canvas.width * 0.8, canvas.height * 0.1, '#00000080', "48px serif");
      drawText(P2score.toString(), 3 * canvas.width / 4, canvas.height / 5, '#00000080', "48px serif");

      // Draw net
      drawNet();

      //Draw paddles
      drawRect(userLeft.x, data.player1_paddle_y, userLeft.width, userLeft.height, userLeft.color);
      drawRect(userRight.x, data.player2_paddle_y, userRight.width, userRight.height, userRight.color);
      
      //Draw the ball
      drawArc(data.ball_x, data.ball_y, ball.radius, ball.color);
    }
  }
    
  function adaptToCanvas(data: dataT, canvas:any)
    {
      //console.log("issou");
      if (canvas)
      {
        data.player1_paddle_y = data.player1_paddle_y / 100 * canvas.height;
        //console.log("PAD1 Y = " + data.player1_paddle_y);
        data.player2_paddle_y = data.player2_paddle_y / 100 * canvas.height;
        data.ball_y = data.ball_y / 100 * canvas.height;
        data.ball_x = data.ball_x / 200 * canvas.width;
        return (data);
      }
    }

  function handleClick(e: any) {
    if (!matchMaking)
    {
      socket.emit('game_inQueue');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setMatchMaking(true);
    }
  }

  return (

    <div className='game-container'>
      <div className='game-players'>
        <h3>NAME PLAYER 1</h3>
        <h3>NAME PLAYER 2</h3>
      </div>
      {/*<button type='button' onClick={handleStart}>Start game</button>*/}
      <canvas ref={canvasRef} className="pong-container" onClick={handleClick}/> 
      {/*onMouseMove={updateMousePosition}*/}
    </div>
  )
}
