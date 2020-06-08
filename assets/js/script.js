/* Eléments pour le dessin */
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

var originX = c.width/2;
var originY = c.height / 2

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
class HexCube {
	constructor(x,y,z) {
		this.x=x;
		this.y=y;
		this.z=z;
	}

	checkSum () {
		return (this.x + this.y + this.z) == 0;
	}

	toAxial() {
		var q = this.x;
		var r = this.z
		return new HexAxial(q, r);
	}
}

class HexAxial {
	constructor(q,r, corners, nbCornersFree) {
		this.q = q;
		this.r = r;
		this.corners = corners;
		this.nbCornersFree = nbCornersFree;
	}

	toCube () {
		var x = this.q;
		var z = this.r;
		var y = - x - z;
		return new HexCube(x,y,z)
	}

	pointy_hex_to_pixel() {
	    var x = sizeHex * (Math.sqrt(3) * this.q  +  Math.sqrt(3)/2 * this.r);
	    var y = sizeHex * (3./2 * this.r);
	    return new PointEucl(x,y,this)
	}
	flat_hex_to_pixel() {
	    var x = sizeHex * 3/2 * this.q;
	    var y = sizeHex * (Math.sqrt(3)/2 * this.q + Math.sqrt(3) * this.r);
	    return new PointEucl(x,y)
	}

	drawhex(itisflat) {
		if (itisflat) {this.flat_hex_to_pixel().drawFlatHex(this)}
		else {
			this.pointy_hex_to_pixel().drawPointyHex()
		}
	}
}

class PointEucl {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}

	drawPointyHex () {
		moveEucl(this.x, this.y);
		posPen['angle'] = 0;
		movePol (sizeHex, 30, false);
		movePol (0, -60, false);
		for (var i=1; i<=6; i++) {
			movePol(sizeHex, -60, true);
			new Corner(Math.round(posPen['posX']),Math.round(posPen['posY']), true).addInAllCorner();
		}
		//ctx.stroke();
	}

	drawFlatHex (hex) {
		moveEucl(this.x, this.y);
		posPen['angle'] = 0;
		movePol (sizeHex, 60, false);
		posPen['angle'] -= 60;
		for (var i=1; i<=6; i++) {
			movePol(sizeHex, -60, true);
			var corn = new Corner(Math.round(posPen['posX']),Math.round(posPen['posY']), [hex], true);
			corn.addInAllCorner(hex);
			hex.corners.push(corn)
		}
		//ctx.stroke();
	}


}

class Corner {
	constructor(x, y, hexagones, notAlreadyClicked, takenBy) {
		this.x = x;
		this.y = y;
		this.hexagones = hexagones;
		this.notAlreadyClicked = notAlreadyClicked;
		this.takenBy = takenBy;
	}

	makeCircle(color) {
		ctx.fillStyle = color;
		ctx.beginPath(); 
		ctx.arc(this.x, this.y, radiusRound, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}

	addInAllCorner(hex) {
		var notInThere = true;
		var indexA = 0;
		while (notInThere && indexA < allCorner.length) {
			if (allCorner[indexA].x == this.x && allCorner[indexA].y == this.y) {
				notInThere = false;
				allCorner[indexA].hexagones.push(hex)
			}
			indexA ++;
		}
		if (notInThere) {allCorner.push(this)}
	}

	imInTheCircle(posx, posy) {
		var d = Math.sqrt((posx - this.x)*(posx - this.x) + (posy - this.y)*(posy - this.y));
		return d <= radiusRound
	}
}
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
	console.log('click')
	colorCircle = "black";
	var x = event.clientX - originX;
	var y = event.clientY - originY;
	var ind = 0;
	var noCircleClicked = true;
	console.log(x, y);
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

