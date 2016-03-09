
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
	this.view = createTextBox(this.rightEdge - this.leftEdge, this.height, -this.topEdge+this.bottomEdge, 
		this.color, "#000000",
		this.title, 24, 128, 64);
	return this.view;
};

UIButton.prototype.select = function(on) {
	if(this.on != on) {
		this.on = on;
		if(on) {
			textTextureChange(this.view.dynamicTexture, this.title, 24, "#00FF00", "#000000", 0.2);
		} else {
			textTextureChange(this.view.dynamicTexture, this.title, 24, "#FFFFFF", "#000000", 0.2);
		}
	}	
};


var DataEntryUI = function(name, index, dataEntry, parentBlock){
	this.name = name;
	this.index = index;
	this.dataEntry = dataEntry;
	this.parentBlock = parentBlock;

	this.backColor = "#FFFFFF";
	this.foreColor = "#000000"
	this.text = dataEntry.toBlockString();
};

DataEntryUI.prototype.createCube = function(){
	var cubeSize = this.parentBlock.parent.cubeSize;
	var fontSize = this.parentBlock.parent.fontSize;
	var margin = this.parentBlock.parent.margin;
	var align = this.parentBlock.parent.align
	var lineHeight = this.parentBlock.parent.lineHeight;
	this.cube = createTextBox(
		cubeSize, cubeSize, cubeSize, 
		this.backColor, this.foreColor, 
		this.text, fontSize, 64, 64, margin, align, lineHeight);
};

DataEntryUI.prototype.addCube = function(scene) {
	console.log("adding cube");
	scene.add(this.cube);
};

var DataBlockUI = function(name, blockSize, run, index, parent, origin) {
	this.name = name;
	this.size = blockSize;
	this.run = run;
	this.index = index;
	this.parent = parent;
	this.entries = [];
	this.origin = origin;


	for(var i = 0; i < this.size; ++i) {
		this.size*this.index+i;
		this.entries.push(new DataEntryUI(
			name+"p"+i, 
			this.index*this.size+i, 
			this.run.getDataEntry(this.size*this.index+i), 
			this));	
	}
};

DataBlockUI.prototype.constructCubes = function(){
	for(var i = 0; i < this.entries.length; ++i){
		this.entries[i].createCube();
		this.entries[i].cube.position.z = this.origin.z;
		this.entries[i].cube.position.x = this.origin.x+this.parent.cubeSize*i;
		this.entries[i].cube.position.y = this.origin.y;
	}
};

DataBlockUI.prototype.addCubes = function(scene) {
	for(var i =0; i < this.entries.length; ++i) {
		this.entries[i].addCube(scene);
	}
};

var DataRunUI = function (name, run, widthInBlocks) {
	this.name = name;
	this.run = run;
	this.blocks = [];
	this.blockSize = this.run.getBlockSize();
	this.width = widthInBlocks;
	this.cubeSize = 0.04;
	this.cubeMargin = 0.02;
	this.fontSize = 20;
	this.margin = undefined; // for now...
	this.align = undefined;
	this.lineHeight = undefined;
};

DataRunUI.prototype.setOrigin = function(x,z, y){
	this.originX = x;
	this.originZ = z;
	this.originY = y;
};

DataRunUI.prototype.constructCubes = function() {
	var block;
	var counter = 0;
	for(var i = 0; i < this.run.getSize(); ++i){
		if(i % this.blockSize == 0) {
			var blockCount = Math.floor(i/this.blockSize);
			var x = blockCount % this.width;
			var z = Math.floor(blockCount/this.width); 


			var blockOrigin = {
				x: this.originX + (this.cubeSize*this.blockSize+this.cubeMargin)*x,
				z: this.originZ - (this.cubeSize+this.cubeMargin)*z,
				y: this.originY+this.cubeSize/2,
			};

			block = new DataBlockUI(
				this.name+"b"+counter, 
				this.blockSize, 
				this.run, 
				blockCount,
				this,
				blockOrigin);
			block.constructCubes();
			this.blocks.push(block);
		}
	};
};

DataRunUI.prototype.addCubes = function(scene) {
	for (var i =0; i < this.blocks.length; ++i) {
		this.blocks[i].addCubes(scene);
	}
}

var AlgorithmUI = function(algo) {
	this.algorithm = algo;
};


var NestedLoopJoinUI = function(algo, tableTop) {
	AlgorithmUI.call(this, algo);

	this.rBlocks = new DataRunUI("r", this.algorithm.r, 3);
	this.rBlocks.setOrigin(-.5, -1, tableTop);

	this.sBlocks = new DataRunUI("s", this.algorithm.s, 3);
	this.sBlocks.setOrigin(0, -1, tableTop);

	this.writeBlocks = new DataRunUI("result", this.algorithm.result, 3);
	this.writeBlocks.setOrigin(-.3, -.85, tableTop);

	this.bufferBlocks = new DataRunUI("buffer", this.algorithm.buffer, 3);
	this.bufferBlocks.setOrigin(-.3, -.65, tableTop);
};

NestedLoopJoinUI.prototype = Object.create(AlgorithmUI.prototype);

NestedLoopJoinUI.prototype.constructor = NestedLoopJoinUI;

NestedLoopJoinUI.prototype.constructCubes = function(){
	this.rBlocks.constructCubes();
	this.sBlocks.constructCubes();
	this.writeBlocks.constructCubes();
	this.bufferBlocks.constructCubes();
};

NestedLoopJoinUI.prototype.addCubes = function(scene) {
	this.rBlocks.addCubes(scene);
	this.sBlocks.addCubes(scene);
	this.writeBlocks.addCubes(scene);
	this.bufferBlocks.addCubes(scene);
}


