(function(){
	
	function Block(params) {

		this.Container_constructor();
		params = params || {};
		this.init(params);
	}

	var proto = createjs.extend(Block,createjs.Container);
	createjs.EventDispatcher.initialize(proto);

	proto.init = function(params) {

		this.width = Settings.BLOCK_W;
		this.height = Settings.BLOCK_H;
		this.collisionW = this.width;
		this.collisionH = this.height;
		this.collidable = true;
		this.color = (Settings.BLOCK_COLOR)? Settings.BLOCK_COLOR : '#FFF';
		this.regX = this.width / 2;
		this.regY = this.height / 2;
		this.y = params.y;
		this.x = params.x;

		this.shape = new createjs.Shape();
		this.gfx = this.shape.graphics;
		this.addChild(this.shape);

		this.render();

	}

	proto.render = function() {

		this.gfx.clear().beginFill(this.color).drawRect(0,0,this.width,this.height);

	}


	proto.collide = function() {

		this.collidable = false;

		const ev = new createjs.Event('block_hitted');
		ev.block = this;
		Stage.dispatchEvent(ev);

		Stage.removeChild(this);
	}

	proto.isCollidable = function() {
		return this.collidable;
	}

	proto.jellyEffect = function() {

		var amp = 1 + Math.random()*0.5;
		var rot = Math.random()*90 - 45;
		createjs.Tween.get(this).to({scaleX: amp, scaleY: amp, rotation: rot},50).to({scaleX: 1, scaleY: 1, rotation: 0});
	}

	window.Block = createjs.promote(Block, 'Container');
}());