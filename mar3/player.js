fire = false;
addBullet = false;

class Player {
    constructor(stage, position, type) {
      this.type = type;
      this.stage = stage;
      this.position = position;
      this.x = position.x;
      this.y = position.y;
      this.angle = 0;

      this.intPosition();
      this.cam_x = this.x;
      this.cam_y = this.y;


      //weapon part
      this.hand = new Weapon("hand", 10, 10);
      this.longgun = new Weapon("longgun", 10, 10);
      this.shortgun = new Weapon("shortgun", 10, 10);
      this.weapon = this.longgun;

      this.smallBullet = 100;
      this.bigBullet = 100;
      this.health = 100;
      // this.direction = direction;
      // this.amunition = amunition;
      this.position = position;
      this.bag = null;
      this.num = 0;
      this.died = false;
      this.velocity = new Pair(rand(20), rand(20));

      
    }


  gameOver(){
    this.stage.addActor(new MapObject(this.stage, new Pair(this.x - 35, this.y - 35), "grave"));  
    if (this.toString() == "AI"){
      this.stage.AI -= 1;
      this.stage.removeActor(this);
    }
    if (this.toString() == "Player"){
      this.stage.removePlayer();
      // this.stage.addActor(new MapObject(this.stage, new Pair(this.x - 35, this.y - 35), "grave"));
      // pauseGame();
    }
  }

  toString(){
    return this.type;
  }

  dropWeapon(wpName){
    if (wpName == "longgun"){
      this.longgun = null;
    } if (wpName == "shortgun"){
      this.shortgun = null;
    }
  }

  changeWeapon(wp){
    this.weapon = wp;
  }

  pickWeapon(weapon) {
    this.weapon = weapon;
  }

  drawOnePart(context, dx, dy, part) {
    var image = new Image();
    image.src = "icons/" + part + ".png";
    context.drawImage(image, this.cam_x + dx, this.cam_y + dy);
    // console.log("player" + this.x, this.y);
  }

  draw(context, xView, yView) {
    //
    // var xRange = [this.x - 40 - 65, this.x + 40]
    // var yRange = [this.y - 40 - 60, this.y + 40]


    // var xRange1 = [this.x - 65, this.x + 40]
    // var yRange1 = [this.y - 100, this.y + 40]
    context.strokeRect(this.cam_x -40 , this.cam_y -40, 80, 80);


    //draw scores

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    this.cam_x = this.x - xView;
    this.cam_y = this.y - yView;
    context.translate(this.cam_x, this.cam_y);
    context.rotate(this.angle);
    context.beginPath();
    context.translate(-this.cam_x, -this.cam_y);

    if (this.bag) {
      this.drawOnePart(context, -100, -105, this.bag);
    }
    this.drawOnePart(context, -64, -64, "player");

    // hand hitting
    if (this.weapon.toString() == "hand" && this.type == "Player") {
      if (fire) {
        if (this.num > 50) {
          this.drawOnePart(context, -100, -100, "leftHit");
        } else {
          this.drawOnePart(context, -100, -100, "rightHit");
        }
      } else {
        this.drawOnePart(context, -100, -100, this.weapon.toString());
      }
    } else {
      this.drawOnePart(context, -100, -100, this.weapon.toString());
    }
    context.restore();
    context.closePath();
    
  }

  step(){
    // console.log(this.toString(), this.health, this.x, this.y);
    if (this.health <= 0){
      this.gameOver();
      // pauseGame();
    }

    //AI move
    if (this.type == "AI"){
      var startAx = this.x - 300;
      var endAx = this.x + 300;
      var startAy = this.y - 300;
      var endAy = this.y + 300;
      var p1 = this.stage.player;

      // console.log(startAx, endAx, startAy, endAy);
      // console.log("p1: ", p1.x, "p2: ", p1.y);

      if (p1 && p1.x > startAx && p1.x < endAx && p1.y > startAy && p1.y < endAy){
        this.rotate(p1.cam_x, p1.cam_y);
        
        var randNum = Math.floor(rand(50));
        console.log(randNum);
        if (randNum == 1){
          this.fire();
        }
        console.log(this.angle);
      } else {
        this.move(0.1, 0.1);
      }




      // this.move(0.3, 0.3);
      // this.position.y=this.position.y+this.velocity.y;
        
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


    // if (this.died == true){
    //   if (this.toString() == "AI"){
    //     this.stage.AI -= 1;
    //   r1}
    //   this.stage.addActor(new MapObject(this.stage, new Pair(this.x - 35, this.y - 35), "grave"))
    //   this.stage.removeActor(this);
    //   if (this.toString == "Player"){
    //     this.stage.removePlayer();
    //   }
    // }

    var xRange = [this.x - 40 - 65, this.x + 100]
    var yRange = [this.y - 40 - 60, this.y + 40]


    var xRange1 = [this.x - 40 - 30, this.x + 40]
    var yRange1 = [this.y - 45 -10 , this.y + 40]
    var xstart = this.x - 40 - 30;
    var xend = this.x + 40;
    var ystart = this.y - 55;
    var yend = this.y + 40;


    for (var i = 0; i < this.stage.actors.length; i++) {
      var currentActor = this.stage.actors[i];
      // console.log(currentActor.constructor.name);
      if (currentActor.constructor.name == "Amunition"){
        var xBullet = currentActor.x;
        var yBullet = currentActor.y;
        // console.log(this.toString(), this.health, this.angle);
        console.log(xBullet, yBullet, "122222");
        if ( xBullet > xstart && xBullet < xend && yBullet > ystart && yBullet < yend){
          this.health -= currentActor.getDamage();
          currentActor.disappear();
          // console.log(this.toString(), this.health, this.angle);
          // console.log(currentActor, currentActor.range);
        }
      }

      //pick up items////////////
      if (currentActor.constructor.name == "MapObject" && this.toString() == "Player"){
        var xObject = currentActor.x;
        var yObject = currentActor.y;
        if ( xObject > xRange[0] && xObject < xRange[1] && yObject > yRange[0] && yObject < yRange[1]){
          console.log("jinqulr1111");
          if (currentActor.toString() == "bagObject" && this.bag == null){
            this.bag = "bag";
            this.stage.removeActor(currentActor);
          }
          else if (currentActor.toString() == "smallBulletObject"){
            this.smallBullet += 10;
            this.stage.removeActor(currentActor);
          }
          else if (currentActor.toString() == "bigBulletObject"){
            this.bigBullet += 10;
            this.stage.removeActor(currentActor);
          }
          else if (currentActor.toString() == "longgunObject"){
            if (this.bag != null){
              if (this.longgun == null){
                this.longgun = new Weapon("longgun", 10, 10);
                this.stage.removeActor(currentActor);
                if (this.weapon.toString() == "hand"){
                  this.weapon = this.longgun;
                }
              }
            } else {
              if (this.shortgun == null && this.longgun == null){
                this.longgun = new Weapon("longgun", 10, 10);
                this.stage.removeActor(currentActor);
                if (this.weapon.toString() == "hand"){
                  this.weapon = this.longgun;
                }
              }
            }
          }
          else if (currentActor.toString() == "shortgunObject"){
            if (this.bag != null){
              if (this.shortgun == null){
                this.shortgun = new Weapon("shortgun", 10, 10);
                this.stage.removeActor(currentActor);
                if (this.weapon.toString() == "hand"){
                  this.weapon = this.shortgun;
                }
              }
            } else {
              if (this.longgun == null && this.shortgun == null){
                this.shortgun = new Weapon("shortgun", 10, 10);
                this.stage.removeActor(currentActor);
                if (this.weapon.toString() == "hand"){
                  this.weapon = this.shortgun;
                }
              }
            }
          }

          // this.weapon = new Weapon("longgun", 10, 10);
          // this.stage.removeActor(currentActor);
        }
      }
    }
    /////////////////////

  }

  move(dx, dy) {
    if (this.x <= 1120 && this.x >= 600){
      this.x += 1 * dx;
      this.y += 1 * dy;
    }
    this.x += 20 * dx;
    this.y += 20 * dy;

    // bounce off the walls
    if (this.x < 20) {
      this.x = 20;
    }
    if (this.x > this.stage.room.map.width - 20) {
      this.x = this.stage.room.map.width - 20;
    }
    if (this.y < 20) {
      this.y = 20;
    }
    if (this.y > this.stage.room.map.height - 20) {
      this.y = this.stage.room.map.height - 20;
    }
  }

  rotate(mouseX, mouseY) {
    this.angle = Math.atan2(mouseY - this.cam_y, mouseX - this.cam_x) - Math.PI / 2;
  }

  intPosition() {
    this.x = Math.round(this.x);
    this.y = Math.round(this.y);
  }

  fire(num) {
    fire = true;
    if(this.weapon.toString() == "hand"){
      this.num = num;
      setTimeout(this.stopFireing, 200);
    }
    if(this.weapon.toString() == "longgun" && this.bigBullet != 0){
      var startX = this.x + (Math.cos(this.angle) - 100 * Math.sin(this.angle));
      var startY = this.y + (Math.sin(this.angle) + 100 * Math.cos(this.angle));

      var angle = new Pair(-Math.sin(this.angle), Math.cos(this.angle));
      // if (this.angle)
      if (this.angle >= -3.14 && this.angle <= -1.88){
        startX -= 10;
        startY -= 20;
      } else if (this.angle >= -1.88 && this.angle <= -1){
        startX -= 10;
        startY -= 30;
      }
      else if (this.angle >= 0.2 && this.angle <= 1.7){
        startX -= 20;
        startY -= 10;
      }
      else if (this.angle >= -5 && this.angle <= -3.1){
        startX -= 20;
        startY -= 20;
      }
      var startPos = new Pair(startX, startY);
      var amunition = new Amunition(this.stage, "bigBullet", angle, startPos, 40, 20);
      this.stage.addActor(amunition);
      this.bigBullet -= 1;
    }
    if(this.weapon.toString() == "shortgun" && this.smallBullet != 0){
      var startX = this.x + (Math.cos(this.angle) - 100 * Math.sin(this.angle));
      var startY = this.y + (Math.sin(this.angle) + 100 * Math.cos(this.angle));

      var angle = new Pair(-Math.sin(this.angle), Math.cos(this.angle));
      if (this.angle >= -3.14 && this.angle <= -1.88){
        startX -= 10;
        startY -= 20;
      } else if (this.angle >= -1.88 && this.angle <= -1){
        startX -= 10;
        startY -= 30;
      }
      else if (this.angle >= 0.2 && this.angle <= 1.7){
        startX -= 20;
        startY -= 10;
      }
      else if (this.angle >= -5 && this.angle <= -3.1){
        startX -= 20;
        startY -= 20;
      }
      var startPos = new Pair(startX, startY);

      var amunition = new Amunition(this.stage, "smallBullet", angle, startPos, 20, 10);
      this.stage.addActor(amunition);
      this.smallBullet -= 1;
    }

  }

  stopFireing() {
    fire = false;
  }
}