
class Amunition {
	constructor(stage, type, velocity, position, range, damage) {
		this.stage = stage;
		this.type = type;
		this.velocity = velocity;
		this.position = position;
		this.range = range;
		this.damage = damage;
		this.intPosition();
		this.cam_x = this.x;
        this.cam_y = this.y;

	}

	getDamage(){
		return this.damage;
	}

	toString() {
		return this.type;
	}

	disappear(){
		this.range = 0;
	}

	step() {
		// console.log(this.velocity.x, this.velocity.y);
		this.x = this.x + this.velocity.x * 10;
		this.y = this.y + this.velocity.y * 10;
		this.range -= 1;
		if (this.range <= 0){
			this.stage.removeActor(this);
		}

		//damage
		
	}

	intPosition() {
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}


	draw(context, xView, yView) {
		// context.save();
		// context.beginPath();
		// console.log(this.x, this.y);
		this.cam_x = this.x - xView;
		this.cam_y = this.y - yView;

		// context.strokeRect(this.cam_x, this.cam_y, 32, 32);

		var image = new Image();
		image.src = "icons/" + this.type + ".png";
		context.drawImage(image, this.cam_x, this.cam_y);
		// context.restore();
	}

	getRange() {
		return this.range;
	}

}