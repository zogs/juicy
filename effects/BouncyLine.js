(function(){
	
	function BouncyLine(params) {

		this.Container_constructor();
		params = params || {};
		this.init(params);
	}

	var proto = createjs.extend(BouncyLine,createjs.Container);
	createjs.EventDispatcher.initialize(proto);

	proto.init = function(params) {

		this.width = params.length || 500;
		this.height = params.thickness || 30;
		this.color = params.color || '#FFF';
		this.amplitude = params.amplitude || 3;		
		this.direction = params.direction || 'horizontal';
		this.bounceDirection = params.bounceDirection || 1;
		this.collisionW = this.width;
		this.collisionH = this.height;

		//if vertical line
		if(this.direction !== 'horizontal') {
			this.collisionW = this.height;
			this.collisionH = this.width;
			this.rotation = 90;
		}

		this.bouncer = new createjs.Point(0,0);
		this.render();

	}

	proto.render = function() {

		this.removeAllChildren();

		let bounceX = 0;
		let bounceY1 = this.bouncer.y - this.height / 2;
		let bounceY2 = this.bouncer.y + this.height / 2;

		const line = new createjs.Shape();
		line.graphics
			.beginFill(this.color)
			.setStrokeStyle(0)
			.moveTo(-this.width/2,-this.height/2)
			.quadraticCurveTo(bounceX,bounceY1,this.width/2,-this.height/2)
			.lineTo(this.width/2,this.height/2)
			.quadraticCurveTo(bounceX,bounceY2,-this.width/2,this.height/2)
			.closePath();

			/*
			.lineTo(this.bouncer_point.x, this.bouncer_point.y - this.height/2)
			.lineTo(this.width / 2, - this.height/2)
			.lineTo(this.width / 2, this.height/2)
			.lineTo(this.bouncer_point.x, this.bouncer_point.y + this.height/2)
			.lineTo(- this.width/2, this.height / 2)
			.lineTo(- this.width/2, - this.height/2)
			.closePath();
			*/
		this.addChild(line);

		/*
		var circle = new createjs.Shape();
		circle.graphics.beginFill('red').drawCircle(0,0,10);
		this.addChild(circle);
		*/

	}

	proto.handleEnterFrame = function() {

	}

	proto.isCollidable = function() {
		return true;
	}

	proto.collide = function() {
		
		console.log('hit bouncy line !!!');
		var tween = createjs.Tween.get(this.bouncer, {override: true})
			.to({y: this.bouncer.y + (this.height * this.amplitude * this.bounceDirection)},50)
			.to({y: 0}, 500, createjs.Ease.bounceOut);
		tween.on('change',proxy(this.render,this));
	}

	window.BouncyLine = createjs.promote(BouncyLine, 'Container');
}());