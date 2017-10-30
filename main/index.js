'use strict';

//
// YOUR CODE GOES HERE...
//
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
// ░░░░░░░░░░▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄░░░░░░░░░░░
// ░░░░░░░░▄▀░░░░░░░░░░░░▄░░░░░░░▀▄░░░░░░░░
// ░░░░░░░░█░░▄░░░░▄░░░░░░░░░░░░░░█░░░░░░░░
// ░░░░░░░░█░░░░░░░░░░░░▄█▄▄░░▄░░░█░▄▄▄░░░░
// ░▄▄▄▄▄░░█░░░░░░▀░░░░▀█░░▀▄░░░░░█▀▀░██░░░
// ░██▄▀██▄█░░░▄░░░░░░░██░░░░▀▀▀▀▀░░░░██░░░
// ░░▀██▄▀██░░░░░░░░▀░██▀░░░░░░░░░░░░░▀██░░
// ░░░░▀████░▀░░░░▄░░░██░░░▄█░░░░▄░▄█░░██░░
// ░░░░░░░▀█░░░░▄░░░░░██░░░░▄░░░▄░░▄░░░██░░
// ░░░░░░░▄█▄░░░░░░░░░░░▀▄░░▀▀▀▀▀▀▀▀░░▄▀░░░
// ░░░░░░█▀▀█████████▀▀▀▀████████████▀░░░░░░
// ░░░░░░████▀░░███▀░░░░░░▀███░░▀██▀░░░░░░░
// ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//
// Nyan cat lies here...
//


window.App.onToken = (token) => {
	if (!token.length)
		return alert('Enter correct name please');
	console.log('token', token);
	// const socket = new WebSocket('wss://ws.rudenko.tech/life/api/?token='+token);
	const socket = new WebSocket('ws://localhost:8080?token='+token);

	socket.addEventListener('open', (event)=> {
		console.log('opened state ', event);
		// socket.send('Hello Server!');
	});

	let myGame;

	socket.addEventListener('message', (event)=> {
		try {
			let msg = JSON.parse(event.data);
			console.log(msg);
			if (msg.type === 'INITIALIZE')	 {
				// initialise game with incoming data
				// LifeGame(user: Object, setting: Object): LifeGame instance - конструктор
				// LifeGame.init(): void - метод инициализации игры
				myGame = new LifeGame(msg.data.user, msg.data.settings);
				myGame.init();
				myGame.setState(msg.data.state);
				myGame.send = (point) => {
					socket.send(JSON.stringify({
						type: 'ADD_POINT',
						data: point
					}));
				};
			} else if (msg.type === 'UPDATE_STATE') { 
				myGame.setState(msg.data);
			}
		} catch(err) {
			console.log(err);
		}
	});
	socket.addEventListener('error', (event)=> {
		console.log('Error from server ', event.data);
	});
	socket.addEventListener('close', (event)=> {
		console.log('Server closed connection ', event.data);
	});
}