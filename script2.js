var Game = Game	|| {};
var Keyboard = Keyboard || {};
var Component = Component || {};
 
 Keyboard.Keymap = {
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
}; 

Keyboard.ControllerEvents = function() {
	
	var self = this;
	this.pressKey = null;
	this.keymap = Keyboard.Keymap;
	
	document.onkeydown = function(event) {
		self.pressKey = event.which;
	};
	
	this.getKey = function() {
		return this.keymap[this.pressKey];
	};
};

Component.Stage = function(canvas, conf){
	this.keyEvent = new Keyboard.ControllerEvents();
	this.X = new Array(canvas.width / 10);
	this.Y = new Array (canvas.height / 10);
	this.direction = 'right';
	this.inGame = true;
	this.score = 0;
	
	this.food = {
		X  : 0,
		Y : 0
	};
	
	this.conf = {
		fps : 100,
		size : 7,
	};
	
	if (typeof conf == 'object') {
    for (var key in conf) {
      if (conf.hasOwnProperty(key)) {
        this.conf[key] = conf[key];
      }
    }
  }

};

Component.Snake = function(canvas, conf) {
	
	this.left = false;
	this.right = true;
	this.up = false;
	this.down = false;
	
	this.stage = new Component.Stage(canvas, conf);
	
	this.moveRight = function() {
		this.left = false;
		this.right = true;
		this.up = false;
		this.down = false;
	}
	this.moveLeft = function() {
		this.left = true;
		this.right = false;
		this.up = false;
		this.down = false;
	}
	this.moveUp = function() {
		this.left = false;
		this.right = false;
		this.up = true;
		this.down = false;
	}
	this.moveDown = function() {
		this.left = false;
		this.right = false;
		this.up = false;
		this.down = true;
	}
	
	
	this.initSnake = function() {
		
		for (var i = 0; i < this.stage.conf.size; i++){
			
			this.stage.X[i] = 10 - i;
			this.stage.Y[i] = 10;
		}
		
		this.left = false;
		this.right = true;
		this.up = false;
		this.down = false;
		
		
		
	};
	
	this.initSnake();
	
	this.initFood = function(){
		
		this.stage.food.X = Math.round(Math.random() * 50);
		this.stage.food.Y = Math.round(Math.random() * 50);
	}
	
	this.initFood();
	
	
	this.restart = function() {
		
		this.stage.inGame = true;
		this.stage.direction = 'right';
		
		this.stage.X = new Array(canvas.width / 10);
		this.stage.Y = new Array (canvas.height / 10);
		
		this.stage.conf.size = 7;
		
		this.stage.keyEvent.pressKey = 39;
		
		this.stage.score = 0;
		
		
		
		this.initFood();
		this.initSnake();
		
		
	};
};

Game.Draw = function(context, snake){
	
	this.drawStage = function() {
		
		var keyPress = snake.stage.keyEvent.getKey();
	
	if (typeof(keyPress) != 'undefined') {
      snake.stage.direction = keyPress;
    }
    
    // Draw White Stage
		context.fillStyle = "black";
		context.fillRect(0, 0, 500, 500);
		
	switch (snake.stage.direction) {
      case 'right':
	  if (!snake.left){
        snake.moveRight();
	  } else {
		  snake.stage.direction = 'right'
	  }
		break;
      case 'left':
	  if (!snake.right){
        snake.moveLeft();
		} else {
		  snake.stage.direction = 'left'
	  }
		break;
      case 'up':
        if (!snake.down){
		snake.moveUp();
		} else {
		  snake.stage.direction = 'up'
        }
		break;
      case 'down':
	  if (!snake.up){
        snake.moveDown();
		} else {
		  snake.stage.direction = 'down'
	  }
		break;
    }

	
	this.move = function(){
		for (var z = snake.stage.conf.size; z > 0; z--){
			snake.stage.X[z] = snake.stage.X[z - 1];
			snake.stage.Y[z] = snake.stage.Y[z - 1];
		}
		
		if (snake.left){
		snake.stage.X[0]--;
		}
		
		if (snake.right){
		snake.stage.X[0]++;
		}
		
		if (snake.down){
		snake.stage.Y[0]++;
		}
		
		if (snake.up){
		snake.stage.Y[0]--;
		}
	}
	
	
	this.checkCollision = function(){
		
		for (var j = snake.stage.conf.size; j > 0; j--){
			
			if ((snake.stage.X[0] == snake.stage.X[j]) && (snake.stage.Y[0] == snake.stage.Y[j])){
				
				snake.stage.inGame = false;
				
			}
			
		}
		
		if (snake.stage.Y[0] >= 50){
			snake.stage.inGame = false;
			
		}
		
		
		if (snake.stage.X[0] >= 50){
			snake.stage.inGame = false;
			
		}
		
		
		if (snake.stage.Y[0] < 0){
			snake.stage.inGame = false;
	
		}
		
		
		if (snake.stage.X[0] < 0){
			snake.stage.inGame = false;
		}
		
		if (!snake.stage.inGame){
			snake.restart();
			return;
		}
		
		if (snake.stage.X[0] == snake.stage.food.X && snake.stage.Y[0] == snake.stage.food.Y){
			snake.stage.conf.size++;
			snake.stage.score++;
			snake.initFood();

		}
		
	}
	
	this.checkCollision();
	this.move();
	
	context.fillStyle = 'white';
	context.font = "20px Calibri";
	context.fillText(snake.stage.score + '',10,20);

	this.drawCell(snake.stage.food.X, snake.stage.food.Y, 'food');
	
	for (var q = 0; q < snake.stage.conf.size; q++){
		this.drawCell(snake.stage.X[q], snake.stage.Y[q], 'snake');
	}
	};
	
	this.drawCell = function(x, y, t){
		context.fillStyle = 'rgb(170, 170, 170)';
		
		if (t === 'food'){
			context.fillStyle = 'rgb(196, 109, 109)';
		}
		
		context.beginPath();
		context.arc((x * 10), (y * 10), 5, 0, 2 * Math.PI)
		context.fill();
	};
};


Game.Snake = function(elementId, conf) {
  
  // Sets
  var canvas   = document.getElementById(elementId);
  var context  = canvas.getContext("2d");
  var snake    = new Component.Snake(canvas, conf);
  var gameDraw = new Game.Draw(context, snake);
  
  // Game Interval
  setInterval(function() {gameDraw.drawStage();}, snake.stage.conf.fps);
};


/**
 * Window Load
 */
window.onload = function() {
  var snake = new Game.Snake('stage', {fps: 100, size: 7});
};
