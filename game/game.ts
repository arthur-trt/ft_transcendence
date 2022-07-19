// select canvas element
var canvas = document.getElementById("pong");
var start = document.getElementById("start");

canvas.width = window.innerWidth * 0.7;

canvas.height = canvas.width * 0.6;

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

// draw a rectangle, will be used to draw paddles
function drawRect(x, y, w, h, color){
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

// draw circle, will be used to draw the ball
function drawArc(x, y, r, color){
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2,true);
    ctx.closePath();
    ctx.fill();
}

let keyPressed = {};

document.addEventListener('keydown', (e) => {

    keyPressed[e.key] = true;
    
    if (keyPressed['w'] == true)
    {
        if (user.y - 20 <= 0)
            user.y = 0;
        else
            user.y -= 20;
    }
    if (keyPressed['s'] == true)
    {
        if (user.y + 20 >= canvas.height - user.height)
            user.y = canvas.height - user.height;
        else
            user.y += 20;
    }
});

document.addEventListener('keyup', (e) => {
    delete keyPressed[e.key];
});

// when COM or USER scores, we reset the ball
function resetBall(){
    ball.x = canvas.width/2;
    ball.y = canvas.height/2;
    //ball.velocityX = -ball.velocityX;
    ball.velocityX = 5;
    ball.velocityY = 5;
    ball.speed = 7;
}

// draw the net
function drawNet(){
    for(let i = 0; i <= canvas.height; i+=15){
        drawRect(net.x, net.y + i, net.width, net.height, net.color);
    }
}

// draw text
function drawText(text,x,y, color){
    //ctx.fillStyle = '#00000080';
    ctx.fillStyle = color;
    ctx.font = "75px fantasy";
    ctx.fillText(text, x, y);
}

function end_game(winner)
{
    clearInterval(loop);

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

}

// render function, the function that does al the drawing
function render(){
    
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
    drawRect(user.x, user.y, user.width, user.height, user.color);
    
    // draw the COM's paddle
    drawRect(com.x, com.y, com.width, com.height, com.color);
    
    // draw the ball
    drawArc(ball.x, ball.y, ball.radius, ball.color);
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

var client = {};
client.socket = io.connect();

let framePerSecond = 60;
let loop;

async function game_start()
{
    let i = 3;
    var seconds_left = document.createTextNode(i.toString());
    var EOS = document.createTextNode(' seconds ...');
    start.innerHTML = "The game starts in ";

    render();
    
    while (i > 0)
    {
        start.innerHTML = "The game starts in ";
        seconds_left = document.createTextNode(i.toString());
        start.appendChild(seconds_left);
        start.appendChild(EOS);
        await sleep(1000);
        i--;
    }
    start.innerHTML = "START !"
    //loop = setInterval(game,1000/framePerSecond);
}

client.socket.on('game_countdownStart', game_start());

//game_start();