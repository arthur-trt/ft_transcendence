//import { computeHeadingLevel } from '@testing-library/react';
import React, { useState, useEffect} from 'react';

import { useLocation } from "react-router-dom";

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
  let location = useLocation();


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
    player1_paddle2_y: number,
    player2_paddle_y: number,
    player2_paddle2_y: number,
    ball_x: number,
    ball_y: number
  }

  type nameT = {
    p1_name: string;
    p2_name: string
  }

  type scoresT = {
    p1: number;
    p2: number;
  }

  const [socket, setSocket] = useState<any>([]);

  // GAME VARIABLE
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const imgRef = React.useRef<HTMLImageElement>(null);
  const firstRef = React.useRef<HTMLImageElement>(null);
  const secondRef = React.useRef<HTMLImageElement>(null);

  const [canvas, setCanvas] = useState<any>();
  const [ctx, setCtx] = useState<any>();
  const [countdown, setCountdown] = useState<boolean>(false);
  const [gameStart, setGameStart] = useState<boolean>(false);
  let [isBabyPong, setGameMode] = useState<boolean>(true);

  // const location = useLocation();

  let [P1score, setP1Score] = useState(0);
  let [P2score, setP2Score] = useState(0);

  let [P1Name, setP1Name] = useState<string>("");
  let [P2Name, setP2Name] = useState<string>("");
  //c'est bizarre mais touchez a rien svp
  let name1:string;
  let name2:string;

  let p1_score = 0;
  let p2_score = 0;

  const [userLeft, setUserLeft] = useState<userT>({
    x: 10,
    y: 0,
    width: 10,
    height: 30,
    color: "DEEPSKYBLUE"
  });

  const [userLeft_Pad2, setUserLeftP2] = useState<userT>();

  const [userRight, setUserRight] = useState<userT>({
    x: 20,
    y: 0,
    width: 10,
    height: 30,
    color: "FIREBRICK"
  });

  const [userRight_Pad2, setUserRightP2] = useState<userT>();

  const [ball, setBall] = useState<ballT>({
     x: 0,
     y: 0,
    radius: 10,
    velocityX: 5,
    velocityY: 5,
    speed: 7,
    color: "BLACK"
  });

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
        if (isBabyPong === true)
        {
          setUserLeftP2({x : canvas.width * 0.2, y : 0, width: canvas.width * 0.01, height: canvas.height * 0.1, color: "DEEPSKYBLUE"});
          setUserRightP2({x : canvas.width * 0.78, y : 0, width: canvas.width * 0.01, height: canvas.height * 0.1, color: "FIREBRICK"});
        }
      }

      /**
     * WATCH MODE EVENTS
     */
      socket.on('set_names', (n: nameT) => {
        setP1Name(n.p1_name);
        setP2Name(n.p2_name);
        name1 = n.p1_name;
        name2 = n.p2_name;
      });

      socket.on('set_mode', (mode : boolean) => {
        setGameMode(mode);
      });

      socket.on('set_scores', (scores : scoresT) => {
        p1_score = scores.p1;
        p2_score = scores.p2;
        setP1Score(p1_score);
        setP2Score(p2_score);
      })

      socket.on('game_position', (pos: dataT) => {
        //console.log(canvas);
        //console.log("socket.on/game_position");
        setData(adaptToCanvas(pos, canvas));
      });

      socket.on('game_countdownStart', (mode: boolean) => {
        setGameMode(mode);
        console.log("socket.on/game_countdown, mode = " + mode);
        setCountdown(true);
      })

      socket.on('update_score', (res : Boolean) => {
        if (res === true)
        {
          p1_score++;
          setP1Score(p1_score);
          //P1score++;
        }
        else
        {
          // setP2Score(P2score + 1);
          // P2score++;
          p2_score++;
          setP2Score(p2_score);
        }
      })

      socket.on('leave_queue', () => {
        kill_sockets(socket);
      })

      socket.on('game_end', (res : boolean) => {
        kill_sockets(socket);
        render_game_end(res, canvas, P1Name, P2Name);
      })
    }, []);

    useEffect(function callback() {
      return function () {
          console.log("i change everything");
          socketo.emit("changement of tab");
      };
  }, [location]);

    function kill_sockets(socketi : any)
    {
      socketi.off('game_position');
      socketi.off('game_end');
      socketi.off('update_score');
      socketi.off('game_countdownStart');
      socketi.off('set_names');
    }

  //Wait for context to be ready.
  useEffect(() => {
    if (canvas && ctx)
    {
      const fontSize = (canvas.width / 20).toString();
        ctx.fillStyle = "BLACK";
        ctx.font = fontSize + "px serif";
        ctx.textAlign = "center"
        ctx.fillText("En attente de l'adversaire !", canvas.width / 2, canvas.height / 2);
    }
  }, [ctx])

  let i = 0;
  let inter : any;

  useEffect(() => {
    if (canvas && ctx)
    {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const fontSize = (canvas.width / 20).toString();
      console.log("canvas width = " + canvas.width + " fontSize = " + fontSize);
      ctx.fillStyle = "RED";
      ctx.font = fontSize + "px serif";
      ctx.textAlign = "center"
      ctx.fillText("Le jeu va démarrer dans 4 secondes !", canvas.width / 2, canvas.height / 2);
      inter = setInterval(count_function, 1000);
    }
  }, [countdown])

  function count_function()
  {
    //console.log("count");
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
    console.log("useEffect/game_start " + gameStart);
    if (gameStart === true)
      socket.emit('game_start');
  }, [gameStart]);

  useEffect(() => {
    if (canvas && ctx)
    {
      if (data)
        render(data);
    }
  }, [data])

  const [MoveUp, setMoveUp] = useState<boolean>(false);
  const [MoveDown, setMoveDown] = useState<boolean>(false);
  const [Pad2_MoveUp, setPad2_MoveUp] = useState<boolean>(false);
  const [Pad2_MoveDown, setPad2_MoveDown] = useState<boolean>(false);

  document.addEventListener('keydown', (e) => {
    if (gameStart) {

      if (e.key === 'w' && MoveUp === false)
        setMoveUp(true);

      if (e.key === 's' && MoveDown === false)
        setMoveDown(true);

      if (e.key === "o" && Pad2_MoveUp === false && isBabyPong === true)
        setPad2_MoveUp(true);

      if (e.key === "l" && Pad2_MoveDown === false && isBabyPong === true)
        setPad2_MoveDown(true);
    }
  }, {once : true});

  document.addEventListener('keyup', (e) => {
    if (gameStart) {
      if (e.key === 'w' && MoveUp === true)
        setMoveUp(false);

      if (e.key === 's' && MoveDown === true)
        setMoveDown(false);

      if (e.key === "o" && Pad2_MoveUp === true && isBabyPong === true)
        setPad2_MoveUp(false);

      if (e.key === "l" && Pad2_MoveDown === true && isBabyPong === true)
        setPad2_MoveDown(false);
    }
  }, {once : true});

  useEffect(() => {
    if (gameStart) {
      if (MoveUp === true) {
        socket.emit('MoveUp')
      }
      if (MoveDown === true) {
        socket.emit('MoveDown')
      }
      if (MoveUp === false && MoveDown === false) {
        socket.emit('StopMove');
      }

      if (isBabyPong === true)
      {
        if (Pad2_MoveUp === true) {
          socket.emit('MoveUP2')
        }
        if (Pad2_MoveDown === true) {
          socket.emit('MoveDOWN2')
        }
        if (Pad2_MoveUp === false && Pad2_MoveDown === false) {
          socket.emit('StopMove2');
        }
      }
    }
  }, [MoveUp, MoveDown, Pad2_MoveUp, Pad2_MoveDown]);

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
      for (let i = 0; i <= canvas.height; i += 15 + net.height) {
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
      }
    }
  }

  function drawText(text: string, x: number, y: number, color: string, font: string) {
    //console.log("drawText " + ctx);
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
      drawText(P1score.toString(), canvas.width / 4, canvas.height / 5, '#00000080', "48px serif");

      // Draw score for userRight
      drawText(P2score.toString(), 3 * canvas.width / 4, canvas.height / 5, '#00000080', "48px serif");

      // Draw net
      drawNet();

      //Draw paddles
      drawRect(userLeft.x, data.player1_paddle_y, userLeft.width, userLeft.height, userLeft.color);
      drawRect(userRight.x, data.player2_paddle_y, userRight.width, userRight.height, userRight.color);

      //if mode babypong draw the second paddles
      if (isBabyPong === true && userLeft_Pad2 && userRight_Pad2)
      {
        drawRect(userLeft_Pad2.x, data.player1_paddle2_y, userLeft_Pad2.width, userLeft_Pad2.height, userLeft_Pad2.color);
        drawRect(userRight_Pad2.x, data.player2_paddle2_y, userRight_Pad2.width, userRight_Pad2.height, userRight_Pad2.color);
      }

      //Draw the ball
      drawArc(data.ball_x, data.ball_y, ball.radius, ball.color);
    }
  }

  function render_game_end(winner : boolean, canvas : any, p1 : string, p2 : string)
  {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(imgRef.current, canvas.width * 0.35, canvas.height * 0.3, canvas.width * 0.3, canvas.height * 0.6);
      ctx.fillStyle = '#1dd1a1';
      let fontSize = (canvas.width / 20).toString();
      ctx.font = fontSize + "px serif";
      ctx.fillText(p1_score + " - " + p2_score, canvas.width * 0.5, canvas.height * 0.25);

      if(winner === true) //I won
        ctx.fillText(name1.toUpperCase() + " WON !", canvas.width * 0.5, canvas.height * 0.1);
      else //Opponent won
        ctx.fillText(name2.toUpperCase() + " WON !", canvas.width * 0.5, canvas.height * 0.1);

    }
  }

  function adaptToCanvas(data: dataT, canvas:any)
    {
      if (canvas)
      {
        data.player1_paddle_y = data.player1_paddle_y / 100 * canvas.height;
        data.player2_paddle_y = data.player2_paddle_y / 100 * canvas.height;
        data.ball_y = data.ball_y / 100 * canvas.height;
        data.ball_x = data.ball_x / 200 * canvas.width;
        if (isBabyPong === true)
        {
          data.player1_paddle2_y = data.player1_paddle2_y / 100 * canvas.height;
          data.player2_paddle2_y = data.player2_paddle2_y / 100 * canvas.height;
        }
        return (data);
      }
    }

  return (

    <div className='game-container'>
      <div className='game-players'>
        <h3>{P1Name}</h3>
        <h3>{P2Name}</h3>
      </div>
      {/*<button type='button' onClick={handleStart}>Start game</button>*/}
      <canvas ref={canvasRef} className="pong-container"/>
      <img ref={imgRef} src="coupe.png" className="hidden" alt="Winning cup"/>
      <img ref={firstRef} src="1st.png" className="hidden" alt="First place"/>
      <img ref={secondRef} src="2nd.png" className="hidden" alt="Second place"/>
      {/*onMouseMove={updateMousePosition}*/}
    </div>
  )
}
