var Stage;
var Queue;
var MouseX;
var MouseY;
var Main;
var Scenes;

function main() {

	Stage = new createjs.Stage('canvas');

	createjs.ColorPlugin.install();

	Queue = new createjs.LoadQueue();
	Queue.installPlugin(createjs.Sound);
	createjs.Sound.alternateExtensions = ["mp3"];
	Queue.addEventListener('complete',handleComplete);
	Queue.addEventListener('progress',handleProgress);
	Queue.addEventListener('fileload',handleFileLoad);
	Queue.loadManifest([
		{src: "assets/sounds/ball-paddle.mp3", id: "ball-paddle"},
		{src: "assets/sounds/ball-wall.mp3", id: "ball-wall"},
		{src: "assets/sounds/juicy_breakout-theme.mp3", id: "theme"},
		{src: "assets/sounds/pling1.mp3", id: "pling1"},
		{src: "assets/sounds/pling2.mp3", id: "pling2"},
		{src: "assets/sounds/pling3.mp3", id: "pling3"},
		{src: "assets/sounds/pling4.mp3", id: "pling4"},
		{src: "assets/sounds/pling5.mp3", id: "pling5"},
		{src: "assets/sounds/pling6.mp3", id: "pling6"},
		{src: "assets/sounds/pling7.mp3", id: "pling7"},
		{src: "assets/sounds/pling8.mp3", id: "pling8"},
		{src: "assets/sounds/pling9.mp3", id: "pling9"},
		{src: "assets/sounds/pling10.mp3", id: "pling10"},
		{src: "assets/sounds/pling11.mp3", id: "pling11"},
		{src: "assets/sounds/pling12.mp3", id: "pling12"},
	]);

	window.init();

}


function handleComplete(e) {
	//console.log('complete');
}

function handleProgress(e) {
	//console.log('progress');
}

function handleFileLoad(e) {
	//console.log({'what': 'FILE LOADED', id: e.item.id, src: e.item.src, sound: e.item.sound});;
	//console.log(queue.getResult('wall'));
	createjs.Sound.play(e.item.id);
}


window.init = function() {

	drawBackground();

	this.paddle = new Paddle();
	Stage.addChild(this.paddle);

	this.lines = [];
	var line = new BouncyLine({length:Stage.canvas.width, thickness: 20, color: '#842727', bounceSide: 'right', disable: true});
	line.x = Stage.canvas.width/2;
	line.y = 0;
	this.lines.push(line);
	Stage.addChild(line);
	var line = new BouncyLine({length:Stage.canvas.height, thickness: 20, color: '#842727', vertical: true, bounceDirection: -1, bounceSide: 'left', disable: true});
	line.x = 0;
	line.y = Stage.canvas.height/2;
	this.lines.push(line);
	Stage.addChild(line);
	var line = new BouncyLine({length:Stage.canvas.height, thickness: 20, color: '#842727', vertical: true, bounceSide: 'right', disable: true});
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

		if(Settings.EFFECT_BLOCK_RESET_ANIMATION) {
			block.y = - 100;
			block.rotation = Math.floor(Math.random() * 360) - 180;
			block.scaleX = block.scaleY = 2;
			const delay = Math.random()*100;
			createjs.Tween.get(block).wait(delay).to({rotation: 0},500, createjs.Ease.quartOut);
			createjs.Tween.get(block).wait(delay).to({y: y, scaleX: 1, scaleY: 1},600, createjs.Ease.bounceOut);		
		}
	}

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener('tick',handleEnterFrame);
	Stage.addEventListener('stagemousemove',handleMouseMove);
	Stage.addEventListener('click', addBall)	
	Stage.on('block_hitted',blockHitted);

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

window.blockHitted = function(e) {

	const hitted = e.block;

	//animate all blocks
	blocks.map((block) => {
		
		block.jellyEffect();
	});
}
window.handleEnterFrame = function(e) {

	if(e.paused) return;
	
	this.paddle.handleEnterFrame();

	this.balls.map((ball) => {
		ball.update()
		ball.checkCollision(this.paddle);

		this.blocks.map((block) => {
			block.render();

			ball.checkCollision(block);
		});

		this.lines.map((line) => {

			// enable or disable border's bouncing !
			if(Settings.EFFECT_BORDER_BOUNCE) {
				line.enable();				
			}

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