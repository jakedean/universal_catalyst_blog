window.addEventListener('load', eventWindowLoaded, false);

function eventWindowLoaded() {
	canvasApp();
}

function canvasSupport() {
	return true;
}

function canvasApp() {

	var theCanvas = document.getElementById('myCanvas');
  var context = theCanvas.getContext('2d');

  var dx = {
  	'u' : 0,
  	'd' : 0,
  	'l' : -1,
  	'r' : 1
  }

  var dy = {
  	'u' : -1,
  	'd' : 1,
  	'l' : 0,
  	'r' : 0
  }

  var opp = {
  	'u' : 'd',
  	'd' : 'u',
  	'l' : 'r',
  	'r' : 'l'
  }
  var lastMove = [];
  var backColor = '#000000'

  drawScreen();
  initMaze();

//-----------------------------------------------------------------
//Creating an array for each column, which each start with 10
// 0's each and become 1's as they are filled.
  function mapArray () {
		var tileArray = [];
		for (a = 0; a < 10; a += 1) {
			tileArray.push([]);
			for (b = 0; b < 10; b += 1) {
				tileArray[a][b] = 0;
			}
		}
		return tileArray;
	}
//------------------------------------------------------------------
//Creating the 10x10 tile map, each column is represented by an array.
  function drawScreen() {
		//background of the screen
		context.shadowOffsetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 0;
		backColor = '#'+Math.floor(Math.random()*16777215).toString(16);
		context.fillStyle = backColor;
		context.fillRect(0,0,theCanvas.width,theCanvas.height);

		//The vertical lines
		for (var i = 50; i < theCanvas.width; i += 50) {
			context.beginPath();
  	  context.moveTo(i,0);
  	  context.lineTo(i,theCanvas.height);
  	  context.closePath;
  	  context.stroke();
		}
		//the hosrizontal lines
		for (var i = 50; i < theCanvas.width; i += 50) {
			context.beginPath();
  	  context.moveTo(0,i);
  	  context.lineTo(theCanvas.width, i);
  	  context.closePath;
  	  context.stroke();
		}
  }
//-----------------------------------------------------------
//Here I choose a starting point randomly.  This is just used 
//for the first move. 
  function initMaze () {
  	theMap = mapArray();
  	var x = (Math.floor(10*(Math.random())));
  	var y = (Math.floor(10*(Math.random())));
  	fillNext(x,y);
  	nextMove(x,y);
  }
//-----------------------------------------------------------
//Now this is the recursive backtracking algorithum that is used
// on every step after the initial starting block is filled.
		
  function nextMove(cx, cy) {
  	var movesArray = randomizeMoves();
  	for (c = 0; c < 4; c += 1) {
  		var x = dx[movesArray[c]];
      var y = dy[movesArray[c]];
    if ((cx + x) <= 9 && (cy + y) <= 9 && 
    	(cx + x) >= 0 && (cy + y) >= 0 && 
    	theMap[cx + x][cy + y] === 0) {
    	lastMove.push(movesArray[c]);
      fillNext((cx + x),(cy + y));
      setTimeout((function (x, y) {
      	return function () {
      		nextMove(x, y);
      	};
      } ((cx + x),(cy + y))), 50);
      return;
    } else if (c < 3) {
    	continue;
    } else {
    	findOpen(cx,cy);
    }
  	}
  }
//---------------------------------------------------------
//This is a function to randomize the array of directions.
  function randomizeMoves () {
   var choices = ['u', 'd', 'l', 'r'];
   var newChoices = [];
   for (var i = 4; i > 0; i -= 1) {
     	var rand = Math.floor(i*(Math.random()));
     	newChoices.push(choices[rand]);
     	choices.splice(rand,1);
   }
   return newChoices;
  }

//---------------------------------------------------------
//This is a function called from within nextMove that will fill 
//the next block when it is open.
  function fillNext (x,y) {
  	theMap[x][y] = 1;
  	context.fillStyle = '#'+Math.floor(Math.random()*16777215).toString(16);
  	context.fillRect((50*x),(50*y),50,50);
  }

//This is the function to fill the squares back in.
function fillLast (x,y) {
  	context.fillStyle = backColor;
  	context.fillRect((50*x),(50*y),50,50);
  }

//---------------------------------------------------------
//this is a function that will allow the maze to backtrack its
//way all the way to the beginning.

function findOpen (cx, cy) {
		var oppDir = opp[lastMove[(lastMove.length - 1)]];
		cx += dx[oppDir];
    cy += dy[oppDir];
    lastMove.pop();
    setTimeout((function (x, y) {
      	return function () {
      		fillLast(x, y);
      		if (lastMove.length > 0) {
			    	findOpen(cx, cy);
			    	return;
			    } else {
			    	  drawScreen();
			    	 initMaze();
			    	 return;
			    }
      	};
      } (cx, cy)), 50);
	}	
}
 