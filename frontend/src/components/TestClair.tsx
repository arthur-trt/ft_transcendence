import React, { ContextType, CSSProperties, useEffect, useState } from "react";
import useMouse from '@react-hook/mouse-position'
import { randomBytes } from "crypto";
import { socketo } from "..";



export function TestClair () {

	const canRef = React.useRef<HTMLCanvasElement>(null);
	const [mouse, setMouse] = React.useState({ x: 120, y: 120 });

	const [date, setDate] = useState(new Date());
	const [canvas, setCanvas] = useState(null);
	const [socket, setSocket] = useState(socketo);
	const [player, setPlayer] = useState("");
	const [other, setOther] = useState();

	function draw(context : any) {
		if (context != null) {

			context.fillStyle = "#000000";
			console.log('et la ' + mouse.x + ' et ' + mouse.y)
			context.clearRect(0, 0, context.canvas.width, context.canvas.height)
			//context.fillRect (mouse.x, mouse.y, 10, 10);
			if (player == 'Player1')
				context.fillRect(0, mouse.y, 15, 45)
			else
				context.fillRect(0, other, 15, 45)
			//context.fillRect (mouse.x, mouse.y, 10, 10);
			// context.fillStyle = "rgb(200, 0, 0)";
			context.fillStyle = "red";
			if (player == 'Player2')
				context.fillRect(context.canvas.width - 17, mouse.y, 15, 45);
			else
				context.fillRect(context.canvas.width - 17, other, 15, 45)


			// context.fillStyle = "rgba(0, 0, 200, 0.5)";
			// context.fillRect(30, 30, 50, 50);
		}
	}

	const drawin = (ctx : any) => {
		ctx.fillStyle = '#000000'
		ctx.beginPath()
		ctx.arc(50, 100, 20, 0, 2*Math.PI)
		ctx.fill()
	  }

	useEffect(() => {
		document.title = `Cést la ${date} `;
		const socket = socketo;
		setSocket(socket);
		socket.emit('getPlayer');
		console.log(player);

	})

	const updateMousePosition = (ev: any) => {
		console.log('coucou')
		//const rect = canvas.getBoundingClientRect();
		if (canRef.current) {
			const context = canRef.current.getContext("2d")
			if (context) {
				setMouse({ x: ev.clientX - context.canvas.getBoundingClientRect().left, y: ev.clientY - context.canvas.getBoundingClientRect().top })
				console.log(mouse.x + ' et ' + mouse.y)
			}
		}
		socket.emit('test', mouse.y);
	}

	useEffect(() => {
		console.log( 'triggered')
		if (canRef.current) {
			console.log('dedans')
			console.log('par la ' + mouse.x + ' et ' + mouse.y)

			const context = canRef.current.getContext("2d")
			draw(context);
		}
		//window.addEventListener('mousemove', updateMousePosition);
	}, [mouse, other]);

	useEffect(() => {

		const canvas = canRef.current
		if (canvas) {
			const context = canvas.getContext('2d')

		let frameCount = 0
		let animationFrameId = 0;

		//Our draw came here
			const render = () => {
				draw(context)
				animationFrameId = window.requestAnimationFrame(render)
			}
			//render()
			return () => {
				window.cancelAnimationFrame(animationFrameId)
			  }
		}




	  }, [draw])

	useEffect(() => {
		socket.on('Player1', (msg:any, tab:any) => {
			setPlayer('Player1');
		});
		socket.on('Player2', (msg:any, tab:any) => {
			setPlayer('Player2');
		});
		socket.on('othermove', (move:any) => {
			setOther(move);
		});

	}, []);





    return (
      <div>
        <h1>Bonjour, monde ici !</h1>
			<h2>Il est {date.toLocaleTimeString()}.</h2>
			<button onClick={() => setDate(new Date())}></button>
			<canvas ref={canRef} onMouseMove={updateMousePosition}></canvas>
      </div>
    );
}
