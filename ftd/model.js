function randint(n){ return Math.round(Math.random()*n); }
function rand(n){ return Math.random()*n; }

class Stage {
	constructor(canvas){
		this.canvas = canvas;
	
		this.actors=[]; // all actors on this stage (monsters, player, boxes, ...)
		this.player=null; // a special actor, the player
	
		// the logical width and height of the stage
		this.width=canvas.width;
		this.height=canvas.height;

		// Add the player to the center of the stage
		// this.addPlayer(new Player(this, Math.floor(this.width/2), Math.floor(this.height/2)));
	
		// Add in some Balls
		var total=1;
		while(total>0){
			var x=Math.floor((Math.random()*this.width)); 
			var y=Math.floor((Math.random()*this.height)); 
			if(this.getActor(x,y)===null){
				var velocity = new Pair(rand(20), rand(20));
				var red=randint(255), green=randint(255), blue=randint(255);
				var radius = randint(20);
				var alpha = Math.random();
				var colour= 'rgba('+red+','+green+','+blue+','+alpha+')';
				var position = new Pair(x,y);
				var b = new Ball(this, position, velocity, colour, radius);
				this.addActor(b);
				total--;
			}
		}

		//Add player
		var x = Math.floor(this.width/2);
		var y = Math.floor(this.height/2);
		var midPosition = new Pair(x, y);
		var p1 = new Player(this, midPosition);
		this.addPlayer(p1);
		
	}

	addPlayer(player){
		this.addActor(player);
		this.player=player;
	}

	removePlayer(){
		this.removeActor(this.player);
		this.player=null;
	}

	addActor(actor){
		this.actors.push(actor);
	}

	removeActor(actor){
		var index=this.actors.indexOf(actor);
		if(index!=-1){
			this.actors.splice(index,1);
		}
	}

	// Take one step in the animation of the game.  Do this by asking each of the actors to take a single step. 
	// NOTE: Careful if an actor died, this may break!
	step(){
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].step();
		}
	}

	draw(){
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, this.width, this.height);
		for(var i=0;i<this.actors.length;i++){
			this.actors[i].draw(context);
			this.player.draw(context);
		}
	}

	// return the first actor at coordinates (x,y) return null if there is no such actor
	getActor(x, y){
		for(var i=0;i<this.actors.length;i++){
			if(this.actors[i].x==x && this.actors[i].y==y){
				return this.actors[i];
			}
		}
		return null;
	}
} // End Class Stage

class Pair {
	constructor(x,y){
		this.x=x; this.y=y;
	}

	toString(){
		return "("+this.x+","+this.y+")";
	}

	normalize(){
		var magnitude=Math.sqrt(this.x*this.x+this.y+this.y);
		this.x=this.x/magnitude;
		this.y=this.y/magnitude;
	}
}

class Ball {
	constructor(stage, position, velocity, colour, radius){
		this.stage = stage;
		this.position=position;
		this.intPosition(); // this.x, this.y are int version of this.position

		this.velocity=velocity;
		this.colour = colour;
		this.radius = radius;
	}
	
	headTo(position){
		this.velocity.x=(position.x-this.position.x);
		this.velocity.y=(position.y-this.position.y);
		this.velocity.normalize();
	}

	toString(){
		return this.position.toString() + " " + this.velocity.toString();
	}

	step(){
		this.position.x=this.position.x+this.velocity.x;
		this.position.y=this.position.y+this.velocity.y;
			
		// bounce off the walls
		if(this.position.x<0){
			this.position.x=0;
			this.velocity.x=Math.abs(this.velocity.x);
		}
		if(this.position.x>this.stage.width){
			this.position.x=this.stage.width;
			this.velocity.x=-Math.abs(this.velocity.x);
		}
		if(this.position.y<0){
			this.position.y=0;
			this.velocity.y=Math.abs(this.velocity.y);
		}
		if(this.position.y>this.stage.height){
			this.position.y=this.stage.height;
			this.velocity.y=-Math.abs(this.velocity.y);
		}
		this.intPosition();
	}
	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}
	draw(context){
		context.fillStyle = this.colour;
   		// context.fillRect(this.x, this.y, this.radius,this.radius);
		context.beginPath(); 
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false); 
		context.fill();   
	}
}

class Player {
	constructor(stage, position){
		this.stage = stage;
		this.weapon = "hand";
		// this.health = health;
		// this.direction = direction;
		// this.amunition = amunition;
		this.position = position;
		this.intPosition();
		this.radius = 20;
		this.image = ["player"].concat(this.weapon);
		this.bag = null;
		this.hitting = false;
	}

	hit(){
		if (!this.hitting){
			console.log("ccccccccc");
			this.hitting = true;
			// this.weapon = "leftHit";
			setTimeout(this.stopHitting, 500);
		}
	}

	stopHitting(){
		console.log('111');
		this.hitting = false;
		// this.weapon = "longgun";
		// setTimeout(this.stopHitting(), 10000);
		console.log(this.weapon);
		console.log(this.hitting);
	}

	move(dx, dy){
		this.x += 10 * dx;
		this.y += 10 * dy;

		if(this.x < 20){
			this.x = 20;
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

	intPosition(){
		this.x = Math.round(this.position.x);
		this.y = Math.round(this.position.y);
	}

	step(){

	}

	drawOnePart(context, dx, dy, part){
		var image = new Image();
		image.src = "icons/" + part + ".png";
		context.drawImage(image, this.x + dx, this.y + dy);
	}


	draw(context){

		if (this.bag){
			this.drawOnePart(context, -75, -80, this.bag);
		}
		this.drawOnePart(context, -40, -40, "player");
		console.log(this.hitting);
		// this.drawOnePart(context, -75, -75, this.weapon);

		if (this.hitting){
			this.drawOnePart(context, -75, -75, "leftHit");
		} else {
			this.drawOnePart(context, -75, -75, "hand");
		}
		// this.drawOnePart(context, -75, -75, "bag");

		// var image = new Image();
		// image.src = 'icons/player.png';
		// context.drawImage(image, this.x, this.y, 50, 40);

		// var image = new Image();
		// image.src = 'icons/hand.png';
		// context.drawImage(image, this.x, this.y - 40, 50, 40);


		// context.fillStyle = 'black';
		// context.beginPath(); 
		// context.arc(this.x, this.y, 20, 0, 2 * Math.PI, false); 
		// context.fill(); 


	}

}


