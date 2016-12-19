(function(){
	
	function Paddle() {

		this.Container_constructor();
		this.init();
	}

	var proto = createjs.extend(Paddle,createjs.Container);
	createjs.EventDispatcher.initialize(proto);

	proto.init = function() {

		this.width = Settings.PADDLE_W;
		this.height = Settings.PADDLE_H;
		this.collisionW = this.width;
		this.collisionH = this.height;
		this.regX = this.width / 2;
		this.regY = this.height / 2;
		this.y = Stage.canvas.height - this.height - Settings.PADDLE_PADDING_BOTTOM;
		this.x = Stage.canvas.width / 2;

		this.render();

	}

	proto.render = function() {

		const rect = new createjs.Shape();
		rect.graphics.beginFill(Settings.PADDLE_COLOR).drawRect(0,0,this.width,this.height);
		this.addChild(rect);

	}

	proto.handleEnterFrame = function() {
		
		if(MouseX === undefined) return;

		if(Settings.EFFECT_PADDLE_STRETCH) {

			this.scaleX = 1 + Math.abs(this.x - MouseX) / 100;
			this.scaleX = (this.scaleX >= 2)? this.scaleX = 2 : this.scaleX;
			this.scaleY = 1.5 - this.scaleX * 0.5;
			
		} else {
			this.scaleX = this.scaleY = 1;
		}

		this.x = MouseX;


		if( this.x > Stage.canvas.width - this.width / 2) {
			this.x = Stage.canvas.width - this.width / 2;
			this.scaleX = this.scaleY = 1;
		}
		
		if( this.x < this.width / 2) {
			this.x = this.width / 2;
			this.scaleX = this.scaleY = 1;
		}


	}

	proto.isCollidable = function() {
		return true;
	}

	proto.collide = function() {
		//do nothing
	}

	window.Paddle = createjs.promote(Paddle, 'Container');
}());