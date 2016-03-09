
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
	if(dataEntry != undefined) {
		this.text = dataEntry.toBlockString();
	} else {
		this.text ="empty";
	}
};

DataEntryUI.prototype.createOrphanCube = function(copyStyle){
	var cubeSize = copyStyle.cubeSize;
	var fontSize = copyStyle.fontSize;
	var margin = copyStyle.margin;
	var align = copyStyle.align
	var lineHeight = copyStyle.lineHeight;
	var orphanCube = createTextBox(
		cubeSize, cubeSize, cubeSize, 
		copyStyle.backColor, copyStyle.foreColor, 
		this.text, fontSize, 64, 64, margin, align, lineHeight);
	orphanCube.position.x = this.cube.position.x;
	orphanCube.position.y = this.cube.position.y;
	orphanCube.position.z = this.cube.position.z;
	return orphanCube;
};

DataEntryUI.prototype.createCube = function(){
	var cubeSize = this.parentBlock.parent.cubeSize;
	var fontSize = this.parentBlock.parent.fontSize;
	var margin = this.parentBlock.parent.margin;
	var align = this.parentBlock.parent.align
	var lineHeight = this.parentBlock.parent.lineHeight;
	this.cube = createTextBox(
		cubeSize, cubeSize, cubeSize, 
		this.parentBlock.parent.backColor, this.parentBlock.parent.foreColor, 
		this.text, fontSize, 64, 64, margin, align, lineHeight);
	return this.cube;
};

DataEntryUI.prototype.refresh = function() {
	if(this.dataEntry != undefined) {
		this.text = this.dataEntry.toBlockString();
	}	
	console.log("refreshing self");
	textTextureChange(this.cube.dynamicTexture, 
		this.dataEntry.toBlockString(), 
		this.parentBlock.parent.fontSize, 
		this.parentBlock.parent.backColor, 
		this.parentBlock.parent.foreColor, 
		this.parentBlock.parent.lineHeight);
};

DataEntryUI.prototype.addCube = function(scene) {
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

DataBlockUI.prototype.refresh = function() {
	for(var i = 0; i < this.entries.length; ++i) {
		this.entries[i].refresh();
	}
}

var DataRunUI = function (name, run, widthInBlocks) {
	this.name = name;
	this.run = run;
	this.blocks = [];
	this.blockSize = this.run.getBlockSize();
	this.width = widthInBlocks;
	this.cubeSize = 0.04;
	this.cubeMargin = 0.02;
	this.fontSize = 20;
	this.backColor = "#FFFFFF";
	this.foreColor = "#000000"
	this.margin = undefined; // for now...
	this.align = undefined;
	this.lineHeight = undefined;
};

DataRunUI.prototype.getBlock = function(blockNum){
	return this.blocks[blockNum];
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

DataRunUI.prototype.refreshBlock = function(blockNum) {
	this.blocks[blockNum].refresh();
};

DataRunUI.prototype.getElement = function(index) {
	return this.blocks[Math.floor(index/this.blockSize)].entries[index% this.blockSize];
};

var AlgorithmUI = function(algo) {
	this.algorithm = algo;
};


var NestedLoopJoinUI = function(algo, tableTop) {
	AlgorithmUI.call(this, algo);

	this.rBlocks = new DataRunUI("r", this.algorithm.r, 3);
	this.rBlocks.setOrigin(-.5, -1, tableTop + this.rBlocks.cubeSize*4);
	this.rBlocks.backColor = "#FCF3AE";
	this.rCursor = createBox(0.06, 0.06, 0.06, "#FCF3AE", false, 0.5);


	this.sBlocks = new DataRunUI("s", this.algorithm.s, 3);
	this.sBlocks.setOrigin(-.5, -1, tableTop + this.rBlocks.cubeSize*2);
	this.sBlocks.backColor = "#D1FFD7";
	this.sCursor = createBox(0.06, 0.06, 0.06, "#D1FFD7", false, 0.5);

	this.writeBlocks = new DataRunUI("result", this.algorithm.result, 3);
	this.writeBlocks.setOrigin(-.3, -.85, tableTop);
	this.writeCursor = createBox(0.06, 0.06, 0.06, "#FFFFFF", false, 0.5);

	this.bufferBlocks = new DataRunUI("buffer", this.algorithm.buffer, 3);
	this.bufferBlocks.setOrigin(-.3, -.65, tableTop);
	this.bufferBlocks.backColor = "#BCD5FF";

	this.rBufferCursor = createBox(0.06, 0.06, 0.06, "#FCF3AE", false, 0.5);
	this.sBufferCursor = createBox(0.06, 0.06, 0.06, "#D1FFD7", false, 0.5);
	this.writeBufferCursor = createBox(0.06, 0.06, 0.06, "#FFFFFF", false, 0.5);

	this.ioCounter = createTextBox(0.1, 
	0.005, 
	0.1, 
	"#FFFFFF", 
	"#000000", ""+this.algorithm.ioCount, 48, 128, 128);
	this.ioCounter.rotation.x = Math.PI/2;
	this.ioCounter.position.x = 0.3;
	this.ioCounter.position.y = tableTop+0.1/2;
	this.ioCounter.position.z = -1;

	this.codeLevels = [0.13, 0.02, -.09, -.20]
	this.highlightBox = createBox(2, 0.1, 0.01, "#FFFF00", false, 0.3);
	this.highlightBox.position.z = -2.03;
	this.highlightBox.position.y = this.codeLevels[0];
	this.highlightBox.position.x = 0;
		

	this.rLabel = createTextBox(0.08, 
	0.08, 
	0.08, 
	"#333333", 
	"#FFFFFF", "R", 48, 128, 128);
	this.rLabel.position.x = -.6;
	this.rLabel.position.z = -1;
	this.rLabel.position.y = tableTop + this.rBlocks.cubeSize*4+0.04;

	this.sLabel = createTextBox(0.08, 
	0.08, 
	0.08, 
	"#333333", 
	"#FFFFFF", "S", 48, 128, 128);
	this.sLabel.position.x = -.6;
	this.sLabel.position.z = -1;
	this.sLabel.position.y = tableTop + this.rBlocks.cubeSize*1+0.04;


	this.bufferLabel = createTextBox(0.08, 
	0.08, 
	0.08, 
	"#333333", 
	"#FFFFFF", "Buffer", 48, 128, 128);
	this.bufferLabel.position.x = -.4;
	this.bufferLabel.position.z = -.65;
	this.bufferLabel.position.y = tableTop+0.045;

	this.outLabel = createTextBox(0.08, 
	0.08, 
	0.08, 
	"#333333", 
	"#FFFFFF", "Out", 48, 128, 128);
	this.outLabel.position.x = -.4;
	this.outLabel.position.z = -.85;
	this.outLabel.position.y = tableTop+0.045;
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

	scene.add(this.rCursor);
	scene.add(this.sCursor);
	scene.add(this.writeCursor);
	scene.add(this.rBufferCursor);
	scene.add(this.sBufferCursor);
	scene.add(this.writeBufferCursor);
	scene.add(this.ioCounter);
	scene.add(this.highlightBox);
	scene.add(this.rLabel);
	scene.add(this.sLabel);
	scene.add(this.bufferLabel);
	scene.add(this.outLabel);
};

NestedLoopJoinUI.prototype.getRunUI = function(db) {
	if(this.algorithm.r == db) {
		return this.rBlocks;
	} else if(this.algorithm.s == db) {
		return this.sBlocks;
	} else if (this.algorithm.buffer == db) {
		return this.bufferBlocks;
	} else if (this.algorithm.result == db) {
		return this.writeBlocks;
	}
}

NestedLoopJoinUI.prototype.refreshBlock = function(db, blockNum) {
	console.log("refresh block!");
	this.getRunUI(db).refreshBlock(blockNum);
}

NestedLoopJoinUI.prototype.refreshCounters = function() {
	textTextureChange(this.ioCounter.dynamicTexture, ""+this.algorithm.ioCount, 48, "#FFFFFF", "#000000");

	this.highlightBox.position.y = this.codeLevels[this.algorithm.lineNum-1];
}


NestedLoopJoinUI.prototype.refreshCursors = function(){


	var rIndex = this.algorithm.rIndex;
	if(rIndex > -1){
		var block = this.rBlocks.getElement(rIndex).cube;
		this.rCursor.position.copy(block.position);
	}

	var sIndex = this.algorithm.sIndex;
	if(sIndex > -1) {	
		var sBlock = this.sBlocks.getElement(sIndex).cube;
		this.sCursor.position.copy(sBlock.position);
	}

	var rBufferIndex = this.algorithm.compareRIndex;
	console.log("rbuf"  + rBufferIndex);
	if(rBufferIndex > -1) {
		var rBufferBlock = this.bufferBlocks.getElement(rBufferIndex).cube;
		this.rBufferCursor.position.copy(rBufferBlock.position);
	}	

	var sBufferIndex = this.algorithm.compareSIndex;
	console.log("sbuf"  + sBufferIndex);
	if(sBufferIndex > -1){
		var sBufferBlock = this.bufferBlocks.getElement(sBufferIndex).cube;
		this.sBufferCursor.position.copy(sBufferBlock.position);
	}
	
};