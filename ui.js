
var UIFramework = function() {
	this.buttonGrid = []; // list of UI Buttons
};

UIFramework.prototype.click = function(x, z) {
	for(var i = 0; i < this.buttonGrid.length; ++i) {
		if(this.buttonGrid[i].contains(x,z)){
			this.buttonGrid[i].onClick();
		}
	}
};

UIFramework.prototype.hover = function(x, z) {
	for(var i = 0; i < this.buttonGrid.length; ++i) {
		this.buttonGrid[i].select(this.buttonGrid[i].contains(x,z));
	}
};

UIFramework.prototype.addButton = function(button){
	this.buttonGrid.push(button);
};

var UIButton = function(title, leftEdge, topEdge, width, depth){
	this.title = title;
	this.leftEdge = leftEdge;
	this.topEdge = topEdge;
	this.rightEdge = this.leftEdge+width;
	this.bottomEdge = this.topEdge+depth;
	

	this.height = 0.01;
	this.color = "#ffffff";
	this.onClick = null;
	this.view = null;
	this.on = false;
};

UIButton.prototype.contains = function(x,z){
	return (this.rightEdge > x && this.leftEdge < x && this.topEdge < z && this.bottomEdge > z);
}

UIButton.prototype.setOnClick = function(func){
	this.onClick = func;
};

UIButton.prototype.createView = function(params) {
	this.view = createTextBox(this.rightEdge - this.leftEdge, this.height, this.topEdge-this.bottomEdge, 
		this.color, "#000000",
		this.title, 40, 128, 64);
	return this.view;
};

UIButton.prototype.select = function(on) {
	if(this.on != on) {
		this.on = on;
		if(on) {
			this.view.dynamicTexture.clear("#00FF00")
				.drawText(this.title, undefined, 40, "#000000");
		} else {
			this.view.dynamicTexture.clear("#ffffff")
				.drawText(this.title, undefined, 40, "#000000");
		}
	}	
};


var AlgorithmUI = function(algo) {
	this.algorithm = algo;
};

var NestedLoopJoinUI = function(algo, bounds) {
	AlgorithmUI.call(this, algo);


	//coordinates
	this.rTLCorner = {x: bounds.rminX, z: bounds.rminZ};
	this.rBRCorner = {x: bounds.rmaxX, z: bounds.rmaxZ};
	this.sCorner;
	this.bufferCorner;
	this.resultsCorner;

	this.rBlocks = [];
	this.sBlocks = [];
	this.writeBlocks = [];
	this.bufferBlocks = [];
};

NestedLoopJoinUI.prototype = Object.create(AlgorithmUI.prototype);

NestedLoopJoinUI.prototype.constructor = NestedLoopJoinUI;

NestedLoopJoinUI.prototype.constructCubes = function(params){
	var r = this.algorithm.r;

	for(var i = 0; i < r.getSize(); ++i) {

	};
};

NestedLoopJoinUI.prototype.addCubes = function(scene) {
	for(var i =0; i < this.rBlocks.length; ++i) {
		scene.add(this.rBlocks[i]);
	}
}


