class MapObject{
	constructor(stage, position, type){
		this.stage = stage;
		this.position = position;
		this.type = type;
		this.intPosition();
	}

	toString(){
		return this.type;
	}


	intPosition() {
    this.x = Math.round(this.position.x);
    this.y = Math.round(this.position.y);
    }

	draw(context){
		// context.save();
		// context.beginPath();
		var image = new Image();
		image.src = "icons/" + this.type + ".png";
		context.drawImage(image, this.x-this.stage.camera.xView, this.y-this.stage.camera.yView);


		// context.restore();
	}

	step(){

	}
}