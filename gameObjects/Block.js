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
		this.regX = this.width / 2;
		this.regY = this.height / 2;
		this.y = params.y;
		this.x = params.x;

		this.render();

	}

	proto.render = function() {

		const rect = new createjs.Shape();
		rect.graphics.beginFill(Settings.BLOCK_COLOR).drawRect(0,0,this.width,this.height);
		this.addChild(rect);

	}

	proto.handleEnterFrame = function() {
		


	}

	proto.collide = function() {

		this.collidable = false;

		Stage.removeChild(this);
	}

	proto.isCollidable = function() {
		return this.collidable;
	}

	window.Block = createjs.promote(Block, 'Container');
}());