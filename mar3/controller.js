stage=null;
view = null;
interval=null;
function setupGame(){
	stage=new Stage(document.getElementById('stage'));

	// https://javascript.info/keyboard-events
	document.addEventListener('keydown', moveByKey);
	document.addEventListener('click', fireByMouse);
	document.addEventListener('mousemove', moveByMouse);

}
function startGame(){
	interval=setInterval(function(){ stage.step(); stage.draw(); },20);
}
function pauseGame(){
	clearInterval(interval);
	interval=null;
}
function moveByKey(event){
	var key = event.key;
	var moveMap = { 
		'a': { "dx": -1, "dy": 0},
		's': { "dx": 0, "dy": 1},
		'd': { "dx": 1, "dy": 0},
		'w': { "dx": 0, "dy": -1}
	};
	if(key in moveMap){
		stage.player.move(moveMap[key].dx, moveMap[key].dy);
	}
}

function fireByMouse(event){
	var randomNum = randint(100);
	stage.player.fire(randomNum);

}

function moveByMouse(event){
	var bounds = $('#stage').offset();
  	mouseX = event.pageX - bounds.left;
	mouseY = event.pageY - bounds.top;
	if(mouseX > 0 && mouseX < 800 && mouseY > 0 && mouseY < 800){
		stage.player.rotate(mouseX, mouseY);
	}
}