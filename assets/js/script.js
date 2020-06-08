/* Eléments pour le dessin */
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

const originX = c.width/2;
const originY = c.height/2

ctx.translate(originX, originY);

var posPen = {
	posX: 0,
	posY: 0,
	angle: 0.0};

const sizeHex = 70;
const radiusRound = 10;

const colorCircle = "white";
const colorPlayer1 = "green";
const colorPlayer2 = "red";



/* TESTS */
//var hexTest = new Hexagon(0,0);
let allCorners = {}, allHexa = [];

/* hexTest.makeCorners();
hexTest.draw(); */
for (var i = -1; i <= 1; i++) {
	for (var j = -1; j <= 1; j++) {
		if (Math.abs(i+j) < 2) {
			var hexa = new Hexagon(i,j);
			allHexa.push(hexa);
			hexa.makeCorners().draw();
		}
	}
}
Object.keys(allCorners).forEach(key => {
	allCorners[key].drawCircle(colorCircle);
	allCorners[key].taken = -1;
})






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

//window.onload = pavageHex(true);



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

