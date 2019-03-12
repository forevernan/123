class StoneObject{
	constructor(stage, position, type){
		this.stage = stage;
		this.position = position;
		this.type = type;
		this.intPosition();
		this.cam_x = this.x;
        this.cam_y = this.y;
	}

	toString(){
		return this.type;
	}


	intPosition() {
    this.x = Math.round(this.position.x);
    this.y = Math.round(this.position.y);
    }

	draw(context, xView, yView){
		// context.save();
		// context.beginPath();
		this.cam_x = this.x - xView;
		this.cam_y = this.y - yView;

		if (this.toString() == "smallStone"){
			context.strokeRect(this.cam_x + 15, this.cam_y + 15, 70, 70);
			var image = new Image();
			image.src = "icons/" + this.type + ".png";
			context.drawImage(image, this.cam_x, this.cam_y);
		}
		else if (this.toString() == "bigStone"){
			context.strokeRect(this.cam_x + 5, this.cam_y + 5, 145, 145);
			var image = new Image();
			image.src = "icons/" + "bigStone" + ".png";
			context.drawImage(image, this.cam_x, this.cam_y);
		}
		// if (this.type = "house"){
		// 	context.strokeRect(this.cam_x, this.cam_y, 100, 100);
		// 	var image = new Image();
		// 	image.src = "icons/" + this.type + ".png";
		// 	context.drawImage(image, this.cam_x, this.cam_y);
		// }
		// var xstart = this.x - 15;
	 //    var xend = this.x + 15;
	 //    var ystart = this.y - 15;
	 //    var yend = this.y + 15;
		// for (var i = 0; i < this.stage.actors.length; i++) {
	 //      var currentActor = this.stage.actors[i];
	 //      if (currentActor.constructor.name == "Amunition"){
	 //        var xBullet = currentActor.x;
	 //        var yBullet = currentActor.y;
	 //        if ( xBullet > xstart && xBullet < xend && yBullet > ystart && yBullet < yend){
	 //          this.type = "smallStone";
	 //          currentActor.disappear();
	 //          // console.log(this.toString(), this.health, this.angle);
	 //          // console.log(currentActor, currentActor.range);
	 //        }
	 //      }
	 //  }


		// context.restore();
	}

	step(){
		if (this.toString() == "smallStone"){
			var xstart = this.x - 10;
		    var xend = this.x + 80;
		    var ystart = this.y - 10;
		    var yend = this.y + 75;
			for (var i = 0; i < this.stage.actors.length; i++) {
		      var currentActor = this.stage.actors[i];
		      if (currentActor.constructor.name == "Amunition"){
		        var xBullet = currentActor.x;
		        var yBullet = currentActor.y;
		        if ( xBullet > xstart && xBullet < xend && yBullet > ystart && yBullet < yend){
		          this.stage.removeActor(this);
		          currentActor.disappear();
		          // console.log(this.toString(), this.health, this.angle);
		          // console.log(currentActor, currentActor.range);
	        		}
	      		}
	  		}		
		}
		if (this.toString() == "bigStone"){
			var xstart = this.x - 30;
		    var xend = this.x + 135;
		    var ystart = this.y - 10;
		    var yend = this.y + 155;
			for (var i = 0; i < this.stage.actors.length; i++) {
		      var currentActor = this.stage.actors[i];
		      if (currentActor.constructor.name == "Amunition"){
		        var xBullet = currentActor.x;
		        var yBullet = currentActor.y;
		        if ( xBullet > xstart && xBullet < xend && yBullet > ystart && yBullet < yend){
		          this.type = "smallStone";
		          currentActor.disappear();
		          // console.log(this.toString(), this.health, this.angle);
		          // console.log(currentActor, currentActor.range);
	        		}
	      		}
	  		}		
		}
	}
}