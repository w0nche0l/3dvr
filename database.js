var BufferData = function(blockNum, blockSize) {
	this.blockNum = blockNum;
	this.dataRun = new DataRun(this.blockNum, this.blockSize);
};

var DataEntry = function(object){
	if(object == undefined){
		this.data = {};
	} else {
		this.data = object;
	}

	this.status = "none"; // "new", "deleted"
};

DataEntry.prototype.getData = function(){
	return this.data; 
};

DataEntry.prototype.getDataByKey = function(key){
	return this.data[key];
};

DataEntry.prototype.toString = function() {
	return JSON.stringify(this.data);
};

DataEntry.clone = function(otherDataEntry) {
	return new DataEntry(JSON.parse(JSON.stringify(otherDataEntry.getData())));
};

DataEntry.combine = function(de1, de2) {
	var obj = {};
	var d1 = de1.getData();
	for(var key in d1) {
		obj[key] = d1[key];
	}
	var d2 = de2.getData();
	for(var key in d2) {
		obj[key] = d2[key];
	}
	return new DataEntry(obj);
};

var DataRun = function(object, blockSize){
	this.data = [];
	this.blockSize = blockSize;
	if(Array.isArray(object)) {
		for(var i = 0; i < object.length; ++i) {
			this.data.push(new DataEntry(object[i]));
		}
	} else if (Number.isInteger(object)){ // is blockNum
		for(var i = 0; i < object; ++i) {
			this.data.push(new DataEntry());
		}
	}
};

DataRun.prototype.getRun = function(){
	return this.data;
};

DataRun.prototype.getSize = function(){
	return this.data.length;
};

DataRun.prototype.getDataEntry = function(index) {
	return this.data[index];
};

DataRun.prototype.setDataEntry = function(index, dataEntry){
	this.data[index] = dataEntry;
};	

DataRun.prototype.blockForData = function(dataNum){
	return Math.floor(dataNum / this.blockSize);
};

DataRun.prototype.getBlockSize = function(){
	return this.blockSize;
};

DataRun.prototype.toString = function(){
	var string = "[";
	for (var i = 0; i < this.data.length; ++i) {
		if(i%this.blockSize == 0) {
			string+="<br>";
		}

		string+=this.data[i].toString();
		string+=",";
	}
	string+="]";
	return string;
};

//unfinished
DataRun.prototype.randomInit = function(size, nameArray, doShuffle) {
	this.size = size;
	this.data = [];
	for(var i = 0; i < this.size; ++i) {
		var obj = {};
		obj["id"] = i;
		var id = i;
		for(var j = 0; j < nameArray.length; ++j) {
			var randomInt = Math.floor(Math.random()*100);
			obj[nameArray[j]] = randomInt;
		}
		this.data.push(new DataEntry(obj));
	}
	if(doShuffle === true){
		shuffle(this.data);
	}
};

var Algorithm = function(rSize, sSize, blockSize){
	this.blockSize = blockSize;
	this.r = new DataRun(rSize, blockSize);
	this.s = new DataRun(sSize, blockSize);
	this.result = new DataRun(undefined, blockSize);
	this.buffer = new DataRun(undefined, blockSize);
	this.resultBlockIndex = 0;

	this.functionLine = function(){
		return this.start();
	};
	this.finish = true;
	this.lineNum = 0;
	this.ioCount = 0;
	this.changeList = [];
};

Algorithm.prototype.next = function(){
	if(this.finish == true) {
		return false;
	} else {
		this.functionLine = this.functionLine();
		if(this.functionLine == null) {
			this.finish = true;
		}
	}
};

Algorithm.prototype.applyChanges = function() {
	for(var i = 0; i < this.changeList.length; ++i) {
		applyChange(this.changeList[i]);
	}
	this.changeList = [];
}

Algorithm.prototype.pseudoCode = "";

Algorithm.prototype.start = function(){
	return null;
};

var NestedLoopJoinAlgorithm = function(rSize, sSize, blockSize, optimized) {
	Algorithm.call(this, rSize, sSize, blockSize);
	this.finish = false;

	this.buffer = new DataRun(blockSize*3, blockSize);

	if(optimized === undefined){
		optimized = false;
	} else {
		this.optimized = optimized;
	}

	this.rIndex = 0;
	this.sIndex = 0;
	this.writeIndex = 0;
	this.rBlockIndex = -1;
	this.sBlockIndex = -1;
};

NestedLoopJoinAlgorithm.prototype = Object.create(Algorithm.prototype); // See note below

// Set the "constructor" property to refer to NestedLoopJoinAlgorithm
NestedLoopJoinAlgorithm.prototype.constructor = NestedLoopJoinAlgorithm;

NestedLoopJoinAlgorithm.prototype.randomInit = function(rSize, sSize) {
	this.r.randomInit(rSize, ["age"]);
	this.s.randomInit(sSize, ["happiness"]);
};

var nljpsuedo = "  For each tuple r in R do\n     For each tuple s in S do\n        If r and s satisfy the join condition\n           Then output the tuple <r,s>".split("\n");
NestedLoopJoinAlgorithm.prototype.pseudoCode = nljpsuedo;

NestedLoopJoinAlgorithm.prototype.start = function(){
	if(this.optimized) {
		return this.blockR;
	} else {
		return this.tupleR;
	}
};

NestedLoopJoinAlgorithm.prototype.tupleR = function(){
	if(this.optimized) {

	} else {
		if(this.rIndex >= this.r.getSize()) {
			this.rIndex = 0;
			this.finish = true;
			return null;
		}

		this.lineNum = 1;
		//read block for R
		var newRBlockIndex = this.r.blockForData(this.rIndex);
		if(newRBlockIndex > this.rBlockIndex) {
			this.rBlockIndex = newRBlockIndex;
			this.changeList.push(createChange("read", this.r, this.rBlockIndex, this.buffer, 0));
		}

		this.rIndex++;
		return this.tupleS;
	}
};

NestedLoopJoinAlgorithm.prototype.tupleS = function(){
	if(this.optimized){

	} else {
		if(this.sIndex >= this.s.getSize()) {
			this.sIndex = 0;
			return this.tupleR;
		}

		this.lineNum = 2;

		//read block for S
		var newSBlockIndex = this.s.blockForData(this.sIndex);
		if(newSBlockIndex != this.sBlockIndex) {
			this.sBlockIndex = newSBlockIndex;
			this.changeList.push(createChange("read", this.s, this.sBlockIndex, this.buffer, 1));
		}

		this.sIndex++;
		return this.compare;
	}
};

NestedLoopJoinAlgorithm.prototype.compare = function() {
	if(this.optimized){

	} else {
		this.lineNum = 3;

		var rIndexInBuffer = 0+(this.rIndex-1)%this.r.blockSize;
		var rEntry = this.buffer.getDataEntry(rIndexInBuffer);
		var sIndexInBuffer = 1*this.buffer.blockSize+(this.sIndex-1)%this.s.blockSize;
		var sEntry = this.buffer.getDataEntry(sIndexInBuffer);

		if(rEntry.getDataByKey("id") == sEntry.getDataByKey("id")) {
			console.log("match found");
			this.changeList.push(createChange("combine", 
				this.buffer, rIndexInBuffer, 
				this.buffer, sIndexInBuffer, 
				this.buffer, this.writeIndex+2*this.buffer.blockSize));
			this.writeIndex++;
		}

		if(this.writeIndex >= this.buffer.getBlockSize()) {
			this.writeIndex = 0;
			this.changeList.push(createChange("write", this.buffer, 2, this.result, this.resultBlockIndex));
			this.resultBlockIndex++;
		}

		return this.tupleS;
	}
};


var validChanges = ["read", "write", "combine"];
function createChange(type, db1, id1, db2, id2, cd, cdi) {
	if (validChanges.indexOf(type) === -1) {
		console.log("invalid change type!");
	}
	var object = {};
	object["type"] = type; 
	if(type == "read" || type == "write"){
		object["fromdb"] = db1;
		object["fromblock"] = id1;
		object["todb"] = db2;
		object["toblock"] = id2;
	} else if (type == "combine") {
		object["origin1"] = db1;
		object["index1"] = id1;
		object["origin2"] = db2;
		object["index2"] = id2;
		object["changeDestination"] = cd;
		object["changeIndex"] = cdi;
	}
	return object;
};

function applyChange(change){
	if(change.type != "combine" && change.fromdb.getBlockSize() != change.todb.getBlockSize()) {
		console.error("block sizes do not match!");
	}
	//copy entire lbock
	if(change.type == "read" || change.type == "write") {
		var blockSize = change.fromdb.getBlockSize();
		console.log(blockSize);
		for(var i = 0; i < blockSize; ++i) {
			if(change.fromdb.getDataEntry(change.fromblock*blockSize + i) == undefined) {
				continue;
			}
			change.todb.setDataEntry(
				change.toblock*blockSize + i, 
				DataEntry.clone(change.fromdb.getDataEntry(change.fromblock*blockSize + i)));
		}
	} else if (change.type == "combine") {
		change.changeDestination.setDataEntry(change.changeIndex, 
			DataEntry.combine(
				change.origin1.getDataEntry(change.index1),
				change.origin2.getDataEntry(change.index2)));
	}
};
