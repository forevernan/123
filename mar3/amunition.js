
class Amunition{
	constructor(type, velocity, position){
		this.type = type;
		this.velocity = velocity;
		this.position = position;
		this.intPosition();

	}

	toString(){
		return this.type;
	}

	step(){
		// console.log(this.velocity.x, this.velocity.y);
		this.position.x=this.position.x+this.velocity.x * 10;
		this.position.y=this.position.y+this.velocity.y * 10;
		this.intPosition();
	}

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}


	draw(context){
		context.save();
		context.beginPath();
		// console.log(this.x, this.y);
		var image = new Image();
		image.src = "icons/" + this.type + ".png";
		context.drawImage(image, this.x, this.y);
		context.restore();
	}

}