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

function createTextBox(width, height, depth, backColor, foreColor, text, fontSize, textureSizeX, textureSizeY){
	var htmlBoxGeometry = new THREE.BoxGeometry(width, height, depth);
	var dynamicTexture	= new THREEx.DynamicTexture(textureSizeX,textureSizeY);
	dynamicTexture.context.font	= "bolder 24px Verdana";

	dynamicTexture.clear(backColor)
		.drawText(text, undefined, fontSize, foreColor);

	var htmlBoxMaterial = new THREE.MeshBasicMaterial({
	      	map: dynamicTexture.texture
	    });
	var htmlBox = new THREE.Mesh(htmlBoxGeometry, htmlBoxMaterial);
	htmlBox.castShadow = true;
	htmlBox.dynamicTexture = dynamicTexture;
	return htmlBox;
};