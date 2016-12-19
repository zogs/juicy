var Stage;
var Queue;
var MouseX;
var MouseY;
var Settings;
var Main;
var Scenes;

function main() {

	Stage = new createjs.Stage('canvas');

	Settings = settings;

	window.init();

}


window.init = function() {

	drawBackground();

	this.paddle = new Paddle();
	Stage.addChild(this.paddle);

	this.lines = [];
	var line = new BouncyLine({length:Stage.canvas.width, thickness: 20});
	line.x = Stage.canvas.width/2;
	line.y = 0;
	this.lines.push(line);
	Stage.addChild(line);
	var line = new BouncyLine({length:Stage.canvas.height, thickness: 20, direction: 'vertical', bounceDirection: -1});
	line.x = 0;
	line.y = Stage.canvas.height/2;
	this.lines.push(line);
	Stage.addChild(line);
	var line = new BouncyLine({length:Stage.canvas.height, thickness: 20, direction: 'vertical'});
	line.x = Stage.canvas.width;
	line.y = Stage.canvas.height/2;
	this.lines.push(line);
	Stage.addChild(line);

	this.balls = [];
	this.addBall();

	this.blocks = [];
	for(let i=0; i < 80; i++) {
		const x = 120 + (i % 10) * (Settings.BLOCK_W + 10);
		const y = 50 + (Math.floor(i/10) * (Settings.BLOCK_H + 20));

		const block = new Block({x:x, y:y});
		this.blocks.push(block);
		Stage.addChild(block);
	}

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick',handleEnterFrame);
	Stage.addEventListener('stagemousemove',handleMouseMove);
	Stage.addEventListener('click', addBall)	

	window.onkeyup = keyUpHandler;
	window.onkeydown = keyDownHandler;

}

window.addBall = function() {
	const ball = new Ball();
	this.balls.push(ball);
	Stage.addChild(ball);
}


window.drawBackground = function() {

	this.background = new createjs.Shape();
	background.graphics.beginFill(Settings.BACKGROUND_COLOR);
	background.graphics.drawRect(0,0,Stage.canvas.width, Stage.canvas.height);
	Stage.addChild(background);

}
window.handleEnterFrame = function(e) {

	if(e.paused) return;
	
	this.paddle.handleEnterFrame();

	this.balls.map((ball) => {
		ball.move()
		ball.checkCollision(this.paddle);

		this.blocks.map((block) => {
			ball.checkCollision(block);
		});

		this.lines.map((line) => {
			ball.checkCollision(line);
		})

	});

	Stage.update();
}

window.handleMouseMove = function(e) {

	MouseX = e.stageX;
	MouseY = e.stageY;

}

window.pause = function() {

	if(createjs.Ticker.paused) {
		createjs.Ticker.setPaused(false);
	} else {
		createjs.Ticker.setPaused(true);
	}
}

window.keyDownHandler = function(e)
{

   switch(e.key)
   {
    case 'p':  window.pause(); break;
   } 
}

window.keyUpHandler = function(e)
{
 
}