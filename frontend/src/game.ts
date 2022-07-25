import {socketo } from './index';
const socket = socketo;

// select canvas element
let canvas = <HTMLCanvasElement>document.getElementById("pong");
var start = document.getElementById("start");

if (canvas != null)
    canvas.width = window.innerWidth * 0.7;

canvas.height = canvas.width * 0.6;

const canvas_size = {
    width : canvas.width,
    height : canvas.height
}

socket.emit('game_settings', canvas_size);

document.addEventListener('resize', () => {
    canvas_size.width = canvas.width;
    canvas_size.height = canvas.height;
    socket.emit('game_settings', canvas_size);
});

// getContext of canvas = methods and properties to draw and do a lot of thing to the canvas
const ctx = canvas.getContext('2d');

// Ball object
const ball = {
    x : canvas.width/2,
    y : canvas.height/2,
    radius : canvas.width * 0.01,
    velocityX : 5,
    velocityY : 5,
    speed : 7,
    color : "BLACK"
}

// User Paddle
const user = {
    x : 10, // left side of canvas
    y : (canvas.height / 2),
    width : canvas.width * 0.01,
    height : canvas.height * 0.2,
    score : 0,
    color : "DEEPSKYBLUE"
}

// COM Paddle
const com = {
    x : canvas.width - 10 - canvas.width * 0.01,
    y : (canvas.height / 2),
    width : canvas.width * 0.01,
    height : canvas.height * 0.2,
    score : 0,
    color : "FIREBRICK"
}

// NET
const net = {
    x : (canvas.width - 2)/2,
    y : 0,
    height : 10,
    width : 2,
    color : "BLACK"
}

// POSITIONS NEEDED TO RENDER THE GAME
const data = {
    player1_paddle_x : user.x,
    player1_paddle_y : user.y,
    player2_paddle_x : com.x,
    player2_paddle_y : com.y,
    ball_x : ball.x,
    ball_y : ball.y
}

// draw a rectangle, will be used to draw paddles
function drawRect(x: any, y: any, w: any, h: any, color: any){
    if (ctx != null)
    {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    }
}

// draw circle, will be used to draw the ball
function drawArc(x: any, y: any, r: any, color: any){
    if (ctx != null)
    {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x,y,r,0,Math.PI*2,true);
        ctx.closePath();
        ctx.fill();
    }
}

let keyPressed : { [index:string] : {} } = {};

document.addEventListener('keydown', (e) => {

    keyPressed[e.key] = true;

    if (keyPressed['w'] == true)
    {
        // if (user.y - 20 <= 0)
        //     user.y = 0;
        // else
        //     user.y -= 20;
        socket.emit('game_movUp', true);
    }
    if (keyPressed['s'] == true)
    {
        // if (user.y + 20 >= canvas.height - user.height)
        //     user.y = canvas.height - user.height;
        // else
        //     user.y += 20;
        socket.emit('game_movDown', true);
    }
});

document.addEventListener('keyup', (e) => {
    if (e.key == 'w')
    {
        socket.emit('game_movUp', false);
        delete keyPressed[e.key];
    }
    if (e.key == 's')
    {
        socket.emit('game_movDown', false);
        delete keyPressed[e.key];
    }
});

// when COM or USER scores, we reset the ball
// function resetBall(){
//     ball.x = canvas.width/2;
//     ball.y = canvas.height/2;
//     //ball.velocityX = -ball.velocityX;
//     ball.velocityX = 5;
//     ball.velocityY = 5;
//     ball.speed = 7;
// }

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text: any,x: any,y: any, color: any){
    if (ctx != null)
    {
        ctx.fillStyle = color;
        ctx.font = "75px fantasy";
        ctx.fillText(text, x, y);
    }
}

// function end_game(winner: any)
// {
//     //clearInterval(loop);

//     if (winner == false)
//     {
//         drawRect(0, 0, canvas.width, canvas.height, "FIREBRICK");
//         drawText("PLAYER 2 WON !", canvas.width * 0.25, canvas.height * 0.2, '#D0AF0A');
//     }
//     else
//     {
//         drawRect(0, 0, canvas.width, canvas.height, "DEEPSKYBLUE");
//         drawText("PLAYER 1 WON !", canvas.width * 0.25, canvas.height * 0.2, '#D0AF0A');
//     }

// }

// render function, the function that does al the drawing
function render(data: any){

    // clear the canvas
    drawRect(0, 0, canvas.width, canvas.height, "WHITE");

    // draw the user score to the left
    drawText(user.score,canvas.width/4,canvas.height/5, '#00000080');

    // draw the COM score to the right
    drawText(com.score,3*canvas.width/4,canvas.height/5, '#00000080');

    drawText("PLAYER 1", canvas.width * 0.12, canvas.height * 0.1, '#00000080');

    drawText("PLAYER 2", canvas.width * 0.62, canvas.height * 0.1, '#00000080');

    // draw the net
    drawNet();

    // draw the user's paddle
    drawRect(data.player1_paddle_x, data.player1_paddle_y, user.width, user.height, user.color);

    // draw the COM's paddle
    drawRect(data.player2_paddle_x, data.player2_paddle_y, user.width, user.height, user.color);

    // draw the ball
    drawArc(data.ball_x, data.ball_y, ball.radius, ball.color);
}

function sleep(ms: any) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function game_start()
{
    let i = 3;
    var seconds_left = document.createTextNode(i.toString());
    var EOS = document.createTextNode(' seconds ...');
    if (start != null)
        start.innerHTML = "The game starts in ";

    render(data);

    while (i > 0)
    {
        if (start != null)
        {
            start.innerHTML = "The game starts in ";
            seconds_left = document.createTextNode(i.toString());
            start.appendChild(seconds_left);
            start.appendChild(EOS);
            await sleep(1000);
        }
            i--;
    }
    if (start != null)
        start.innerHTML = "START !"
    //loop = setInterval(game,1000/framePerSecond);
}

socket.on('game_countdownStart', (args: any) => {game_start()});

socket.on('game_position', (args: any) => {render(data)});

socket.on('game_position', function(pos: any){
    data.player1_paddle_x = pos.player1_paddle_x;
    data.player1_paddle_y = pos.player1_paddle_y;
    data.player2_paddle_x = pos.player2_paddle_x;
    data.player2_paddle_y = pos.player2_paddle_y;
    data.ball_x = pos.ball_x;
    data.ball_y = pos.ball_y;
    render(data);
});

socket.on('game_score', function(scores: any){
    user.score = scores.player1;
    com.score = scores.player2;
});

socket.on('game_winner', function(winner: any){
    //clearInterval(loop);

    if (winner == false)
    {
        drawRect(0, 0, canvas.width, canvas.height, "FIREBRICK");
        drawText("PLAYER 2 WON !", canvas.width * 0.25, canvas.height * 0.2, '#D0AF0A');
    }
    else
    {
        drawRect(0, 0, canvas.width, canvas.height, "DEEPSKYBLUE");
        drawText("PLAYER 1 WON !", canvas.width * 0.25, canvas.height * 0.2, '#D0AF0A');
    }
});
