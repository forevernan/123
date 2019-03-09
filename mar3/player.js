fire = false;
addBullet = false;


class Player{
    constructor(stage, position){
        this.stage = stage;
        this.position = position;
        this.x = position.x;
        this.y = position.y;
        this.angle = 0;

        this.intPosition();
        this.weapon = new Weapon("longGun", 10, 10);
        console.log(this.weapon.toString());
        
		// this.health = health;
		// this.direction = direction;
		// this.amunition = amunition;
		this.position = position;
		this.bag = null;
		this.num = 0;

    }

    pickWeapon(weapon){
    	this.weapon = weapon;
    }

    drawOnePart(context, dx, dy, part){
		var image = new Image();
		image.src = "icons/" + part + ".png";
		context.drawImage(image, this.x + dx, this.y + dy);
	}

    draw(context){
    	context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(this.x, this.y);

        context.rotate(this.angle);
        context.beginPath(); 

        context.translate(-this.x, -this.y);
        // var img = new Image();   // Create new img element
        // img.src = 'icons/north.svg';
        // context.drawImage(img, this.x-7, this.y-12); 
        if (this.bag){
			this.drawOnePart(context, -100, -105, this.bag);
		}
		this.drawOnePart(context, -64, -64, "player");
		// this.drawOnePart(context, -75, -75, this.weapon);
		
		// hand hitting
		if (this.weapon.toString() == "hand"){
			console.log(fire);
			if (fire){
				if (this.num > 50){
					this.drawOnePart(context, -100, -100, "leftHit");
				} else {
					this.drawOnePart(context, -100, -100, "rightHit");
				}
			} else {
				this.drawOnePart(context, -100, -100, this.weapon.toString());
			}
		} else {
			this.drawOnePart(context, -100, -100, this.weapon.toString());
			if (fire){
				console.log(this.x-6, this.y+100);
				this.drawOnePart(context, -6, 100, "bigBullet");
			}
			
		}
		context.restore();

	}

	// 	if (fire == true){
	// 		if (this.weapon.toString() == "hand"){
	// 			if (this.num > 50){
	// 				this.drawOnePart(context, -100, -100, "leftHit");
	// 			} else{
	// 				this.drawOnePart(context, -100, -100, "rightHit");
	// 			}
	// 		}
	// 	} 
	// 	else {
	// 		this.drawOnePart(context, -100, -100, this.weapon.toString());
	// 	}
	// }
		
    
    step(){}

    // randomOne(){

    // }

    move(dx, dy){
        this.x += 10*dx;
        this.y += 10*dy;

        // bounce off the walls
		if(this.x<20){
			this.x=20;
		}
		if(this.x>this.stage.width-20){
			this.x=this.stage.width-20;
		}
		if(this.y<20){
			this.y=20;
		}
		if(this.y>this.stage.height-20){
			this.y=this.stage.height-20;
		}
    }

    rotate(mouseX, mouseY){
        this.angle = Math.atan2(mouseY-this.y, mouseX-this.x)-Math.PI/2;
    }

    intPosition(){
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
    }

    fire(num){
    	console.log("running fire");
    	fire = true;
    	this.num = num;
    	addBullet = true;
   

    	var startX = this.x + (Math.cos(this.angle) - 100 * Math.sin(this.angle));
    	var startY = this.y + (Math.sin(this.angle) + 100 * Math.cos(this.angle));

    	// var startX = this.x - 100 * Math.sin(this.angle);
    	// var startY = this.y + 100 * Math.cos(this.angle);


    	console.log(this.angle);
    	console.log(startX, startY);

    	var angle = new Pair(-Math.sin(this.angle), Math.cos(this.angle));
    	var startPos = new Pair(startX, startY);
    	var amunition = new Amunition("smallBullet", angle, startPos);
		this.stage.addActor(amunition);
    	setTimeout(this.stopFireing, 200);

    }

    stopFireing(){
    	fire = false;
    }
    
 //    hit(num){
 //         = true;
 //        if (num > 50){
 //        	this.weapon = "leftHit";
 //        } else{
 //        	this.weapon = "rightHit";
 //        }
 //        setTimeout(this.stopHitting, 150);
	// }

	// stopHitting(){
 //        hit = false;
	// }
}