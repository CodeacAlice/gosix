/* Eléments pour le dessin */
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

var originX = c.width/2;
var originY = c.height/2

ctx.translate(originX, originY);

var posPen = {
	posX: 0,
	posY: 0,
	angle: 0.0};

var sizeHex = 70;
var radiusRound = 10;

var colorCircle = "white";
var colorPlayer1 = "green";
var colorPlayer2 = "red";

//Fonction pour tourner selon un certain angle et avancer, en traçant ou non une ligne
function movePol (dist, angle, draw) {
	var x = posPen['posX'];
	var y = posPen['posY'];
	var newAngle = posPen['angle'] + angle;

	var angleRad = newAngle * Math.PI / 180;
	var newX = x + dist*Math.cos(angleRad);
	var newY = y + dist*Math.sin(angleRad);

	posPen['posX'] = newX;
	posPen['posY'] = newY;
	posPen['angle'] = newAngle;

	if (draw) {
		ctx.lineTo(newX, newY);
		//ctx.stroke();
	}
	else {ctx.moveTo(newX, newY);}

	return posPen
}

//Fonction pour se déplacer au point de coordonnées (x,y) en traçant ou non une ligne
function moveEucl (x, y, draw) {
	posPen['posX'] = x;
	posPen['posY'] = y;

	if (draw) {
		ctx.lineTo(x, y);
		//ctx.stroke();
	}
	else {ctx.moveTo(x, y);}
}


/* Implémenter les systèmes de coordonnées des hexagones */

var allCorner = [];

/* Faire le pavage */
var plateau = [new HexAxial(0, 0, [])];
function pavageHex(iWantFlatHex) {
	plateau.push(new HexAxial(-1, 0,[]));
	plateau.push(new HexAxial(-1, 1,[]));
	plateau.push(new HexAxial(0, 1,[]));
	plateau.push(new HexAxial(0, -1,[]));
	plateau.push(new HexAxial(1, -1,[]));
	plateau.push(new HexAxial(1, 0,[]));

	for (var k = 0; k < plateau.length; k++) {
		plateau[k].drawhex(iWantFlatHex);
	}
	ctx.stroke();

	for (var k = 0; k < allCorner.length; k++) {
		allCorner[k].makeCircle(colorCircle);
	}
}

window.onload = pavageHex(true);



/* Click on a circle */
var turn = 0;

function clickOnCorners(event) {
	colorCircle = "black";
	var x = event.clientX - originX;
	var y = event.clientY - originY;
	var ind = 0;
	var noCircleClicked = true;
	while (noCircleClicked && ind < allCorner.length) {
		if (allCorner[ind].imInTheCircle(x,y) && allCorner[ind].notAlreadyClicked) {
			noCircleClicked = false;
			allCorner[ind].notAlreadyClicked = false;
			allCorner[ind].takenBy = turn;

			if (turn == 0) {
				allCorner[ind].makeCircle(colorPlayer1);
			}
			else {allCorner[ind].makeCircle(colorPlayer2);}
			turn = (turn+1)%2
		}
		ind++
	}
}

