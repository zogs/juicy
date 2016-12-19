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
		this.amplitude = params.amplitude || 2;		
		this.vertical = params.vertical || false;
		this.bounceDirection = params.bounceDirection || 1;
		this.bounceSide = params.bounceSide || 'both';
		this.bounceTime = params.bounceTime || 500;
		this.disabled = params.disable || false;
		this.collisionW = this.width;
		this.collisionH = this.height;

		//if vertical line
		if( this.vertical === true) {
			this.collisionW = this.height;
			this.collisionH = this.width;
			this.rotation = 90;
		}

		this.bouncerL = new createjs.Point(0,- this.height/2);
		this.bouncerR = new createjs.Point(0, this.height/2);

		this.shape = new createjs.Shape();
		this.gfx = this.shape.graphics;
		this.addChild(this.shape);

		this.render();



	}

	proto.render = function() {

		this.gfx.clear()
			.beginFill(this.color)
			.setStrokeStyle(0)
			.moveTo(-this.width/2,-this.height/2)
			.quadraticCurveTo(0, this.bouncerL.y, this.width/2, -this.height/2)
			.lineTo(this.width/2,this.height/2)
			.quadraticCurveTo(0, this.bouncerR.y, -this.width/2, this.height/2)
			.closePath();
	}

	proto.handleEnterFrame = function() {

	}

	proto.isCollidable = function() {
		return true;
	}

	proto.collide = function() {
		
		if(this.disabled === true) return;

		if( this.bounceSide == 'right' || this.bounceSide == 'both') {
			var tween = createjs.Tween.get(this.bouncerR, {override: true})
				.to({y: this.bouncerR.y + (this.height * this.amplitude * this.bounceDirection)},this.bounceTime/10)
				.to({y: this.height/2}, this.bounceTime, createjs.Ease.bounceOut);
		}

		if( this.bounceSide == 'left' || this.bounceSide == 'both') {
			var tween = createjs.Tween.get(this.bouncerL, {override: true})
				.to({y: this.bouncerL.y + (this.height * this.amplitude * this.bounceDirection)},this.bounceTime/10)
				.to({y: -this.height/2}, this.bounceTime, createjs.Ease.bounceOut);
		}

		//update graphics on every frame of the tween
		tween.on('change',proxy(this.render,this));			
	}

	proto.disable = function() {
		this.disabled = true;
	}

	proto.enable = function() {
		this.disabled = false;
	}

	window.BouncyLine = createjs.promote(BouncyLine, 'Container');
}());