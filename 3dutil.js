function createBox(width, height, depth, paramColor, shadows){
	var boxGeometry = new THREE.BoxGeometry(width, height, depth);
	var boxMaterial = new THREE.MeshLambertMaterial({
	      	color: paramColor
	    });
	var box = new THREE.Mesh(boxGeometry, boxMaterial);
	box.castShadow = shadows;
	if(shadows == undefined) {
		box.castShadow = true;
	}
	return box;
};

function createText(){
	var shape = new THREE.TextGeometry("Game Over", {font: font, size:0.05, height:0.02});
	var wrapper = new THREE.MeshLambertMaterial({color: 0x00ff00});
	var words = new THREE.Mesh(shape, wrapper);
	shape.computeBoundingBox();
    words.textWidth = shape.boundingBox.max.x - shape.boundingBox.min.x;
	words.position.set(-words.textWidth/2+0.4,tableParams.tableTop,-0.4)
	words.rotation.x = -Math.PI/2;
	words.castShadow = true;
	scene.add(words);
};

function textTextureChange(texture, text, fontSize, backColor, foreColor, margin, align, lineHeight) {
	texture.clear(backColor).drawTextCooked({
			text: text,
			align: align!=undefined?align:"center",
			font: "bolder "+fontSize+"px Verdana",
			fillStyle: foreColor, 
			margin: margin!=undefined?margin:0.2,
			lineHeight: lineHeight!=undefined?lineHeight:0.3
		});
};

function createTextBox(width, height, depth, backColor, foreColor, text, fontSize, textureSizeX, textureSizeY, margin, align, lineHeight){
	var htmlBoxGeometry = new THREE.BoxGeometry(width, height, depth);
	var dynamicTexture	= new THREEx.DynamicTexture(textureSizeX,textureSizeY);
	dynamicTexture.context.font	= "bolder "+fontSize+"px Verdana";
	textTextureChange(dynamicTexture, text, fontSize, backColor, foreColor, margin, align, lineHeight);

	var htmlBoxMaterial = new THREE.MeshLambertMaterial({
	      	map: dynamicTexture.texture
	    });

	var htmlBox = new THREE.Mesh(htmlBoxGeometry, htmlBoxMaterial);
	htmlBox.castShadow = true;
	htmlBox.dynamicTexture = dynamicTexture;
	return htmlBox;
};