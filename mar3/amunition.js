
class Amunition {
	constructor(stage, type, velocity, position, range, damage) {
		this.stage = stage;
		this.type = type;
		this.velocity = velocity;
		this.position = position;
		this.range = range;
		this.damage = damage;
		this.intPosition();

	}

	getDamage(){
		return this.damage;
	}

	toString() {
		return this.type;
	}

	step() {
		// console.log(this.velocity.x, this.velocity.y);
		this.x = this.x + this.velocity.x * 10;
		this.y = this.y + this.velocity.y * 10;
		this.range -= 1;

		//damage
		
	}

	intPosition() {
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}


	draw(context) {
		// context.save();
		// context.beginPath();
		// console.log(this.x, this.y);
		var image = new Image();
		image.src = "icons/" + this.type + ".png";
		context.drawImage(image, this.x, this.y);
		// context.restore();
	}

	getRange() {
		return this.range;
	}

}