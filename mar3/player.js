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
      this.weapon = new Weapon("hand", 10, 10);
      this.hand = new Weapon("hand", 10, 10);
      this.longgun = null;
      this.shortgun = null;

      this.smallBullet = 0;
      this.bigBullet = 0;
      this.health = 100;
      // this.direction = direction;
      // this.amunition = amunition;
      this.position = position;
      this.bag = null;
      this.num = 0;
      this.died = false;
    }

  gameOver(){
    this.died = true;
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
    if (this.died == true){
      this.drawOnePart(context, -64, -64, "grave");
    } else {
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
  }

  step(){
    console.log(this.health);
    if (this.health <= 0){
      this.gameOver();
    }
    var xRange = [this.x - 40 - 65, this.x + 40]
    var yRange = [this.y - 40 - 60, this.y + 40]

    for (var i = 0; i < this.stage.actors.length; i++) {
      var currentActor = this.stage.actors[i];
      // console.log(currentActor.constructor.name);
      if (currentActor.constructor.name == "Amunition"){
        var xBullet = currentActor.x;
        var yBullet = currentActor.y;
        console.log(xBullet, yBullet);
        if ( xBullet > xRange[0] && xBullet < xRange[1] && yBullet > yRange[0] && yBullet < yRange[1]){
          this.health -= currentActor.getDamage();
        }
      }

      //pick up items////////////
      if (currentActor.constructor.name == "MapObject"){
        var xObject = currentActor.x;
        var yObject = currentActor.y;
        if ( xObject > xRange[0] && xObject < xRange[1] && yObject > yRange[0] && yObject < yRange[1]){
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
              if (this.shortgun == null){
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
              if (this.longgun == null){
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
    this.x += 10 * dx;
    this.y += 10 * dy;

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
      var startX = this.cam_x + (Math.cos(this.angle) - 100 * Math.sin(this.angle));
      var startY = this.cam_y + (Math.sin(this.angle) + 100 * Math.cos(this.angle));

      var angle = new Pair(-Math.sin(this.angle), Math.cos(this.angle));
      var startPos = new Pair(startX, startY);
      var amunition = new Amunition(this.stage, "bigBullet", angle, startPos, 40, 10);
      this.stage.addActor(amunition);
      this.bigBullet -= 1;
    }
    if(this.weapon.toString() == "shortgun" && this.smallBullet != 0){
      var startX = this.cam_x + (Math.cos(this.angle) - 100 * Math.sin(this.angle));
      var startY = this.cam_y + (Math.sin(this.angle) + 100 * Math.cos(this.angle));

      var angle = new Pair(-Math.sin(this.angle), Math.cos(this.angle));
      var startPos = new Pair(startX, startY);
      var amunition = new Amunition(this.stage, "smallBullet", angle, startPos, 20, 5);
      this.stage.addActor(amunition);
      this.smallBullet -= 1;
    }

  }

  stopFireing() {
    fire = false;
  }
}