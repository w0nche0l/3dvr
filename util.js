function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function arrayToString(array){
  var string = "[";
  for (var i = 0; i < array.length; ++i) {
    string+=JSON.stringify(array[i]);
    string+=",";
  }
  string+="]";
  return string;
}


function changeArrayToString(array){
  var string = "[";
  for (var i = 0; i < array.length; ++i) {
    if(array[i].type != "combine"){
      string+=array[i].type + " " + array[i].fromblock + " " + array[i].toblock;
      string+=",";
    } else {
      string+=array[i].type + " " + array[i].index1 + " " + array[i].index2 + " " + array[i].changeIndex;
      string+=",";
    }
  }
  string+="]";
  return string;
}