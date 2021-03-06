(function(){
	
	function Ball() {

		this.Container_constructor();
		this.init();
	}

	var proto = createjs.extend(Ball,createjs.Container);
	createjs.EventDispatcher.initialize(proto);

	proto.init = function() {

		this.width = Settings.BALL_W;
		this.height = Settings.BALL_H;
		this.regX = this.width / 2;
		this.regY = this.height / 2;
		this.color = Settings.BALL_COLOR || '#FFF';
		this.y = paddle.y - paddle.height/2;
		this.x = paddle.x;

		this.velocityX = (Math.random() * Settings.BALL_VELOCITY) - Settings.BALL_VELOCITY / 2;
		this.velocityY = - Settings.BALL_VELOCITY;

		this.shape = new createjs.Shape();
		this.gfx = this.shape.graphics;
		this.addChild(this.shape);

		this.render();

	}

	proto.render = function() {

		this.gfx.clear().beginFill(this.color).drawRect(0,0,this.width,this.height);
	}

	proto.update = function() {

		this.render();
		this.move();
	}

	proto.move = function() {
	
		if( Settings.EFFECT_BALL_ROTATION) {
			var rotation = Math.atan2(this.velocityY, this.velocityX) / Math.PI * 180;			
			this.rotation = rotation;
		} else {
			this.rotation = 0;
		}


		if( this.y <= Settings.BORDER_W + this.height / 2) {
			this.collide(1,-1);
		}
		if( this.x >= Stage.canvas.width - Settings.BORDER_W - this.width / 2) {
			this.collide(-1,1);
		}
		if( this.x <= Settings.BORDER_W + this.width / 2) {
			this.collide(-1,1);
		}
		if( this.y >= Stage.canvas.height - Settings.BORDER_W - this.height / 2) {
			this.collide(1,-1);
		}


		this.x += this.velocityX;
		this.y += this.velocityY;

	}

	proto.handleCollision = function(side) {
		console.log('collision',side);
		if(side == 'top' || side == 'bottom') this.velocityY *= -1;
		if(side == 'left' || side == 'right') this.velocityX *= -1;

	}

	proto.checkCollision = function(block) {

		//top
		if(block.isCollidable() && this.isColliding(block)) {


			//back the ball out of the block			
			while(this.isColliding(block)) {
				this.x = this.x - this.velocityX ;
				this.y = this.y - this.velocityY ;												
			}

			block.collide(this);

			// top
			if (this.y <= block.y - block.collisionH / 2 && this.velocityY > 0) this.collide(1, -1, block, 'top');
			// bottom
			else if (this.y >= block.y + block.collisionH / 2 && this.velocityY < 0) this.collide(1, -1, block, 'bottom');
			// left
			else if (this.x <= block.x - block.collisionW / 2) this.collide(-1, 1, block, 'left');
			// right
			else if (this.x >= block.x + block.collisionW / 2) this.collide(-1, 1, block, 'right');
			// wtf!
			else this.collide(-1, -1, block, 'unknow');
		}
	}

	proto.isColliding = function(block) {
		return 	this.x > block.x - block.collisionW / 2 && this.x < block.x + block.collisionW / 2 && this.y > block.y - block.collisionH / 2 && this.y < block.y + block.collisionH / 2
	}

	proto.collide = function(multiplierX, multiplierY, block, direction) {

		this.velocityX *= multiplierX;
		this.velocityY *= multiplierY;


		if(Settings.EFFECT_BALL_COLLIDE_SCALE) {
			createjs.Tween.get(this).to({scaleX: 4, scaleY: 4}, 50, createjs.Ease.quartIn)
				.to({scaleX: 1, scaleY: 1}, 100, createjs.Ease.quartOut)
		}

		if(Settings.EFFECT_BALL_COLLIDE_COLOR) {
			this.color = '#FFF';
			createjs.Tween.get(this).to({alpha: 0.8},50).to({alpha: 1},100).call(function() { this.color = Settings.BALL_COLOR });
		}
		//console.log('colliding '+ direction + ' this block :', block);
		//
		createjs.Sound.play("ball_wall");

	}

	window.Ball = createjs.promote(Ball, 'Container');
}());