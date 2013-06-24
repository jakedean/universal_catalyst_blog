window.addEventListener('load', eventWindowLoaded, false)

function eventWindowLoaded () {
	canvasApp();
}

function canvasApp () {
	var myCanvas = document.getElementById('myCanvas');
	var ctx = myCanvas.getContext('2d');
  

  circlePrototype = {
  	x : 50,
  	y : 100,
    speed : 10,
    angle : 35,
    xunits : 0,
    yunits : 0
  }

  var platform = {
    x : 300
  }

   var game = {
      state : 'waitingToStart',
      score : 0,
      level : 1
    }

  var platUnits = 0;

	function drawScreen () {

		if (game.state === 'notOver') {
			//outline
			ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

			//inner white background
			ctx.fillStyle = "#FFFFFF"
	    ctx.fillRect(25,25, myCanvas.width-50, myCanvas.height-50);

			//background
			ctx.fillStyle = "#000000"
	    ctx.strokeRect(25,25, myCanvas.width-50, myCanvas.height-50);

	    //position of the ball
	    myCircle.x += xunits;
	    myCircle.y += yunits;
	    ctx.fillStyle = "#00FF00"
	    ctx.beginPath();
	    ctx.arc(myCircle.x, myCircle.y, 15, 0, Math.PI*2, true);
	    ctx.closePath();
	    ctx.fill();

	    //position of the platform
	    platform.x += platUnits;
	    ctx.fillStyle = "#000000";
	    ctx.fillRect(platform.x, myCanvas.height - 60, 150, 35);
	    platUnits = 0;

	    //test if the ball is hittig a wall or the player platform
	    if ((myCircle.x + 15) > myCanvas.width - 30 || (myCircle.x - 15) < 30) {
	    	myCircle.angle = 180 - myCircle.angle;
	    	update();
	    } else if (((myCircle.y + 15 + yunits) > (myCanvas.height - 60) && 
	    	(myCircle.x + xunits) >= platform.x && (myCircle.x - xunits) <= (platform.x + 150))) {
	      myCircle.angle = 360 - myCircle.angle;
	      checkLevel();
        updateScore();
	      update();
	    } else if ((myCircle.y - 15 + yunits) < 25) {
	    	myCircle.angle = 360 - myCircle.angle;
	    	update();
	    } else if (myCircle.y > myCanvas.height-60 && 
	    	(myCircle.x < platform.x || myCircle.x > platform.x + 150)) {
	    		gameOver();
	    	} 
		} else {
			playAgain();
			}
    
	}

	function checkLevel() {
		game.score += 10;
    if (game.score % 100 === 0) {
      game.level += 1;
      myCircle.speed += 1;
    }
	}

	function updateScore() {
		ctx.clearRect(5,5,300,17);
		ctx.fillStyle = '#000000';
    ctx.font = '16px sans-serif';
	  ctx.textAlign = 'center';
	  ctx.fillText('Level: ' + game.level, 35, 20);
	  ctx.font = '16px sans-serif';
	  ctx.textAlign = 'center';
	  ctx.fillText('Score: ' + game.score, 125, 20);
	}

	function update() {
		radians = myCircle.angle * Math.PI/180;
		xunits = Math.cos(radians) * myCircle.speed;
		yunits = Math.sin(radians) * myCircle.speed;
	}

	function startGame() {
    ctx.fillStyle = '#0000FF';
  	ctx.fillRect(25,25, myCanvas.width-50, myCanvas.height-50);
  	ctx.fillStyle = '#000000';
  	ctx.font = '20px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText('Click To Play!', myCanvas.width/2, myCanvas.height/2);
	}

	function gameOver() {
    game.state = 'over';
    game.level = 1;
    game.score = 0;
    ctx.fillStyle = '#FF0000';
  	ctx.fillRect(25,25, myCanvas.width-50, myCanvas.height-50);
  	ctx.fillStyle = '#000000';
  	ctx.font = '20px sans-serif';
  	ctx.textAlign = 'center';
  	ctx.fillText('Game Over', myCanvas.width/2, myCanvas.height/2);
  	ctx.fillText('Click to Play Again', myCanvas.width/2, (myCanvas.height/2 + 50));
	}

  document.getElementById('myCanvas').addEventListener('click', function () {
  	if (game.state === 'over') {
  		play();
  	} else if (game.state === 'waitingToStart') {
      play();
  	}
  });

	function play() {
		game.state = 'notOver';
		myCircle = initCircle();
		clock();
	}

  //Moving the platform

  window.onmousemove = movePlatform;
  
  function locateMousePosition (e) {
	 return {

      'x' : Math.floor(
          e.clientX 
        + document.body.scrollLeft 
        + document.documentElement.scrollLeft 
        - myCanvas.offsetLeft
        ),

      'y' : Math.floor(
          e.clientY 
        + document.body.scrollTop 
        + document.documentElement.scrollTop 
        - myCanvas.offsetTop
        )
    };
  }

  function movePlatform (e) {
   var mousePosition = locateMousePosition(e);
   if (mousePosition.x > (myCanvas.offsetLeft + 25) && 
   mousePosition.x + 150 < ((myCanvas.width - 25) + (myCanvas.offsetLeft))) {
   	platform.x = mousePosition.x; 
   } 
  }


  //the game loop
	function clock () {
		function loop () {
	  	if (game.state === 'notOver') {
	  		update();
	  		drawScreen();
	  		setTimeout(loop, 10);
	  	} else {
	  		gameOver();
	  	}
	  }
	  loop();
	}
  
  function initCircle () {
  	return Object.create(circlePrototype);
  }
  startGame();
}