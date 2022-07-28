import React, { useState, useEffect } from 'react';

import { socketo } from '..';

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
    player1_paddle_x: number,
    player1_paddle_y: number,
    player2_paddle_x: number,
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
    width: 2,
    height: 2,
    score: 0,
    color: "DEEPSKYBLUE"
  });
  const [userRight, setUserRight] = useState<userT>({
    x: 20,
    y: 0,
    width: 2,
    height: 2,
    score: 0,
    color: "FIREBRICK"
  });

  const [ball, setBall] = useState<{x:number, y:number, radius:number, velocityX:number, velocityY:number, speed:number, color:string}>({
     x: 0,
     y: 0,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "BLACK"
  });

  const [net, setNet] = useState<netT>();
  const [data, setData] = useState<dataT>();


  useEffect(
    () => {
      const socket = socketo;
      setSocket(socket);
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.height = canvas.clientHeight;
        canvas.width = canvas.clientWidth;
        setCanvas(canvas);
      }
      if (canvas) {
        setCtx(canvas.getContext("2d"));
      }

      if (canvas)
        setBall({x: 0, y : 10, radius:10, velocityX:5, velocityY:5, speed:7, color:"BLACK"});

      const pos : dataT = {
        player1_paddle_x : userLeft.x,
        player1_paddle_y : userLeft.y,
        player2_paddle_x : userRight.x,
        player2_paddle_y : userRight.y,
        ball_x : ball.x,
        ball_y : ball.y
      }

      setData(pos);

      // socket.on('game_postion', (pos: dataT) => {
      //   setData(pos)
      // });

      socket.on('game_countdownStart', () => {
        console.log("YEAH");
        setGameStart(true);
      })
    }, []
  );

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

  useEffect(() => {
    if (canvas && ctx)
    {
      ctx.fillStyle = "RED";
      ctx.font = "48px serif";
      ctx.textAlign = "center"
      ctx.fillText("Le jeu va démarrer dans 3 secondes !", canvas.width / 2, canvas.height / 2);
      setCountdown(true);
    }
  }, [gameStart])

  useEffect(() => {
    console.log("stp");
    console.log(gameStart);
    if (countdown == true)
    {
      console.log("allo?");
      callRender();
      //setInterval(callRender, 1000/60);
    }
  }, [countdown])

  function callRender()
  {
    if (data)
    {
      console.log(data.player1_paddle_x);
      render(data);
    }
  }

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
      for (let i = 0; i <= canvas.height; i += 15) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
      }
    }
  }

  function drawText(text: string, x: number, y: number, color: string) {
    console.log(ctx);
    if (ctx != null) {
      ctx.fillStyle = color;
      ctx.font = "48px serif";
      ctx.fillText(text, x, y);
    }
  }

  function render(data: dataT) {
    if (ctx) {
      // Clear the canva
      ctx.clearRect(0, 0, canvas.height, canvas.width);
      // Draw score for userLeft
      drawText("PLAYER 1", canvas.width * 0.12, canvas.height * 0.1, '#00000080');
      drawText(userLeft.score.toString(), canvas.width / 4, canvas.height / 5, '#00000080');
      // Draw score for userRight
      drawText("PLAYER 2", canvas.width * 0.62, canvas.height * 0.1, '#00000080');
      drawText(userRight.score.toString(), 3 * canvas.width / 4, canvas.height / 5, '#00000080');
      // Draw net
      drawNet();
      // Draw Paddle
      drawRect(data.player1_paddle_x, data.player1_paddle_y, userLeft.width, userLeft.height, userLeft.color);
      drawRect(data.player2_paddle_x, data.player2_paddle_y, userRight.width, userRight.height, userRight.color);
    }
  }

  function handleClick(e: any) {
    if (!matchMaking)
    {
      socket.emit('game_inQueue');
      ctx.clearRect(0, 0, canvas.height, canvas.width);
      setMatchMaking(true);
    }
  }

  return (

    <div className='game-container'>
      {/*<button type='button' onClick={handleStart}>Start game</button>*/}
      <canvas ref={canvasRef} className="pong-container" onClick={handleClick} />
    </div>
  )
}
