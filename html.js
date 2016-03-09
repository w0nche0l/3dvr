var nlj = new NestedLoopJoinAlgorithm(20,32,4);
nlj.randomInit(2,2);


var rText = document.getElementById("nljr");
var sText = document.getElementById("nljs");
var bText = document.getElementById("nljb");
var changeText = document.getElementById("changes");
var resultText = document.getElementById("result");
var pseudoCodeText = document.getElementById("pseudo");

function write(){
	rText.innerHTML = nlj.r.toString();
	sText.innerHTML = nlj.s.toString();
	bText.innerHTML = nlj.buffer.toString();
	changeText.innerHTML = changeArrayToString(nlj.changeList);
	resultText.innerHTML = nlj.result.toString();
	pseudoCode();
}

write();
function progress() {
	if(nlj.changeList.length > 0) {
		console.log("applying changes");
		nlj.applyChanges();
		nlj.clearChanges();
	} else {
		console.log("calculating");
		nlj.next();
	}
	write();
};

function pseudoCode() {
	pseudoCodeText.innerHTML = "";
	for(var i = 0; i < nlj.pseudoCode.length; ++i) {
		if(i == nlj.lineNum) {
			pseudoCodeText.innerHTML += "<div style='background-color:yellow; white-space:pre;'>"+ nlj.pseudoCode[i]  + "</div>"; 
		} else {
			pseudoCodeText.innerHTML += "<div style='white-space:pre;'>" + nlj.pseudoCode[i]  + "</div>"; 
		}
		
	}
}
