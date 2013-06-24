window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasApp() {
	var myCanvas = document.getElementById('myCanvas');
	var ctx = myCanvas.getContext('2d');

	var game = {
    'gameState' : 'ready',
    'level' : 1,
    'score' : 0
	};

	var snakePrototype = {
		'createSnake': createSnake,
		'moveSnake': moveSnake,
		'drawSnake': drawSnake,
		'redrawSnake' : redrawSnake,
		'update' : update,
	  'currentSpeed' : 250
	};

	function drawScreen() {
		//outline
		ctx.strokeRect(0,0,myCanvas.width, myCanvas.height);

		//background
    ctx.strokeRect(25,25, myCanvas.width-50, myCanvas.height-50);

    //verical lines
    for (var i = 25; i < myCanvas.width-25; i += 35) {
    	ctx.beginPath();
    	ctx.moveTo(i,25);
    	ctx.lineTo(i,myCanvas.height-25);
    	ctx.closePath;
    	ctx.stroke();
    }

    //the horizonal lines
    for (var i = 25; i < myCanvas.width-25; i += 35) {
    	ctx.beginPath();
    	ctx.moveTo(25,i);
    	ctx.lineTo(myCanvas.width-25,i);
    	ctx.closePath;
    	ctx.stroke();
    }
	}

	//Generate our 20x20 tile array
	function makeTileArray() {
		var tileArray = []
		for (i = 0; i < 20; i += 1) {
      tileArray.push([]);
      for(x = 0; x < 20; x += 1) {
      	tileArray[i].push(0);
      }
		}
		return tileArray;
	}

	//Create our inital snake
	function createSnake(column, row) {
		this.snakeBody = [];
		if (column - 3 >= 0 && column - 3 <= 19) {
			for (x = 0; x > -5; x -= 1) {
				snakeMap[(column + x)][row] = 1;
				if (x === 0) {
					ctx.fillStyle = '#0000FF';
				} else {
					ctx.fillStyle = '#000000';
				} if (x >= -3) {
					ctx.fillRect(((35*(column + x))+25),((35*row)+25),35,35);
					this.snakeBody.push([(column + x),row]);
				} else {
					this.lastTile = [(column + x),row];
				}
			  
			}

		} else {
      for (x = 0; x < 5; x += 1) {
				snakeMap[(column + x)][row] = 1;
				if (x === 0) {
					ctx.fillStyle = '#0000FF';
				} else {
					ctx.fillStyle = '#000000';
				}if (x <= 3) {
					ctx.fillRect(((35*(column + x))+25),((35*row)+25),35,35);
			    this.snakeBody.push([(column + x),row]);
				} else {
					this.lastTile = [(column + x),row];
				}
			}
		}
		return this;
	};

	function generateFood () {
		var row = Math.floor(20*Math.random());
		var column = Math.floor(20*Math.random());
		for (i = 0; i < mySnake.snakeBody.length; i += 1) {
			if (mySnake.snakeBody[i][0] === column && mySnake.snakeBody[i][1] === row) {
        generateFood();
        return;
			} else {
				continue;
			}
		}
		snakeMap[column][row] = "F";
		ctx.fillStyle = '#00FF00'; 
    ctx.fillRect(((35*column)+25),((35*row)+25),35,35);
	}

	function starter() {
		var row = Math.floor(20*Math.random());
		var column = Math.floor(20*Math.random());
	  return Object.create(snakePrototype).createSnake(column, row);
	};

	function drawSnake() {
		var snakeLength = this.snakeBody.length;
    for (x = 0; x < snakeLength; x += 1) {
    	if (x === 0) {
				ctx.fillStyle = '#0000FF';
			} else {
				ctx.fillStyle = '#000000';
			}
			ctx.fillRect(((35*(this.snakeBody[x][0]))+25),((35*(this.snakeBody[x][1]))+25),35,35);
		}
		if (mySnake.tailStatus === 'take it') {
			ctx.clearRect(((35*(this.lastTile[0]))+25),((35*(this.lastTile[1]))+25),35,35);
			ctx.strokeRect(((35*(this.lastTile[0]))+25),((35*(this.lastTile[1]))+25),35,35);
		}
		mySnake.tailStatus = 'take it';	
  } 
	

	function initSnake() {
		snakeMap = makeTileArray();
		return starter();
	}

  window.onkeydown = moveSnake;

  document.getElementById('myCanvas').addEventListener('click', function () {
  	if (game.gameState === 'over') {
  		playAgain();
  	}
  });

  function update () {
  	updateScore(game.level, game.score);
  	var snakeHead = mySnake.snakeBody[0];
  	if (this.direction === 'left') {
  		var leftMove = [(snakeHead[0] - 1), snakeHead[1]];
  		if (checkSpace(leftMove) === true) {
  			mySnake.snakeBody.unshift(leftMove);
  			if (mySnake.tailStatus === 'take it') {
  				mySnake.lastTile = mySnake.snakeBody.pop();
  			}
  		} else {
  			gameOver();
  		}	
  	} else if (this.direction === 'up') {
  		var upMove = [snakeHead[0],(snakeHead[1] - 1)];
  		if (checkSpace(upMove) === true) {
  		  mySnake.snakeBody.unshift(upMove);
  		  if (mySnake.tailStatus === 'take it') {
        mySnake.lastTile = mySnake.snakeBody.pop();
        }	
  		} else {
  			gameOver();
  		} 
  	} else if (this.direction === 'right') {
  		var rightMove = [(snakeHead[0] + 1), snakeHead[1]];
  		if (checkSpace(rightMove) === true) {
        mySnake.snakeBody.unshift(rightMove);
        if (mySnake.tailStatus === 'take it') {
          mySnake.lastTile = mySnake.snakeBody.pop(rightMove);
        } 
  		} else {
  			gameOver();
  		}
  	} else if (this.direction === 'down') {
  		var downMove = [snakeHead[0],(snakeHead[1] + 1)];
  		if (checkSpace(downMove) === true) {
  			mySnake.snakeBody.unshift(downMove); 
  			if (mySnake.tailStatus === 'take it') {
  				mySnake.lastTile = mySnake.snakeBody.pop();
  			}
  		} else {
  			gameOver();
  		}
  	}
  }

  function gameOver () {
  	game.gameState = 'over';
  }

  function updateScore (level, score) {
  	ctx.clearRect(5,5,300,17);
    ctx.font = '16px sans-serif';
	  ctx.textAlign = 'center';
	  ctx.fillText('Level: ' + level, 35, 20);
	  ctx.font = '16px sans-serif';
	  ctx.textAlign = 'center';
	  ctx.fillText('Score: ' + score, 125, 20);
  }

  function checkSpace (move) {
  	for (i = 0; i < mySnake.snakeBody.length; i += 1) {
  		if (move[0] === mySnake.snakeBody[i][0] && move[1] === mySnake.snakeBody[i][1]) {
        return false;
  		} else if (move[0] >= 0 && move[0] <= 19 && move[1] >= 0 && move[1] <= 19
  			&& snakeMap[move[0]][move[1]] === 'F') {
        game.score += 10;
        snakeMap[move[0]][move[1]] = 0;
        mySnake.tailStatus = 'leave it';
        generateFood();
        if (game.score % 100 === 0) {
        	game.level += 1;
        	mySnake.currentSpeed -= 50;
        } 
  		} else {
  			continue;
  		}
  	} 
  	return true;
  }

	function moveSnake() {
    if (event.keyCode === 37) {
    	mySnake.direction = 'left';
    } else if (event.keyCode === 38) {
    	mySnake.direction = 'up';
    } else if (event.keyCode === 39) {
    	mySnake.direction = 'right';
    } else if (event.keyCode === 40) {
    	mySnake.direction = 'down';
    }
	}

	function redrawSnake() {
		if (mySnake.snakeBody[0][0] >= 0 && mySnake.snakeBody[0][0] <= 19
			  && mySnake.snakeBody[0][1] >= 0 && mySnake.snakeBody[0][1] <= 19) {
      mySnake.drawSnake();
		} else {
			gameOver();
		}
	}

	function clock() {
    var loop = function () {
    	if (game.gameState !== 'over') {
    		mySnake.update();
    	  mySnake.redrawSnake();
    	  setTimeout(loop, mySnake.currentSpeed);
      } else {
      ctx.fillStyle = '#FF0000';
	  	ctx.fillRect(25,25, myCanvas.width-50, myCanvas.height-50);
	  	ctx.fillStyle = '#000000';
	  	ctx.font = '20px sans-serif';
	  	ctx.textAlign = 'center';
	  	ctx.fillText('Game Over', myCanvas.width/2, myCanvas.height/2);
	  	ctx.fillText('Click to Play Again', myCanvas.width/2, (myCanvas.height/2 + 50));
	    }
    }	
    loop();
 	}

 	function playAgain() {
 		ctx.clearRect(0,0, myCanvas.width, myCanvas.height);
 		game.gameState = 'notOver';
 		game.level = 1;
 		game.score = 0;
 		drawScreen();
	  mySnake = initSnake();
	  generateFood();
	  mySnake.direction = '';
	  mySnake.tailStatus = 'take it';
	  clock();
 	}

	drawScreen();
	var mySnake = initSnake();
	generateFood();
	mySnake.direction = '';
	mySnake.tailStatus = 'take it';
	clock();
}

