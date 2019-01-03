/* Eléments pour le dessin */
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

ctx.translate(c.width / 2, c.height / 2);

var posPen = {
	posX: 0,
	posY: 0,
	angle: 0.0};

var sizeHex = 70;
var radiusRound = 10;
ctx.fillStyle = "white";

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
	constructor(q,r) {
		this.q = q;
		this.r = r;
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
	    return new PointEucl(x,y)
	}
	flat_hex_to_pixel() {
	    var x = sizeHex * 3/2 * this.q;
	    var y = sizeHex * (Math.sqrt(3)/2 * this.q + Math.sqrt(3) * this.r);
	    return new PointEucl(x,y)
	}

	drawhex(itisflat) {
		if (itisflat) {this.flat_hex_to_pixel().drawFlatHex()}
		else {this.pointy_hex_to_pixel().drawPointyHex()}
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
		}
		//ctx.stroke();
	}

	drawFlatHex () {
		moveEucl(this.x, this.y);
		posPen['angle'] = 0;
		movePol (sizeHex, 60, false);
		posPen['angle'] -= 60;
		for (var i=1; i<=6; i++) {
			// movePol(radiusRound, -60, false)
			movePol(sizeHex, -60, true);
			// ctx.stroke();
			
			// ctx.beginPath(); 
			//moveEucl(posPen['posX'], posPen['posY'],false);
			new Corner(Math.round(posPen['posX']),Math.round(posPen['posY'])).addInAllCorner();
		}
		//ctx.stroke();
	}
}

class Corner {
	constructor(x, y) {
		this.x = x;
		this.y = y
	}

	makeCircle() {
		ctx.beginPath(); 
		ctx.arc(this.x, this.y, radiusRound, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.fill();
	}

	addInAllCorner() {
		var notInThere = true;
		var indexA = 0;
		while (notInThere && indexA < allCorner.length) {
			if (allCorner[indexA].x == this.x && allCorner[indexA].y == this.y) {
				notInThere = false
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
var plateau = [new HexAxial(0, 0)];
function pavageHex(iWantFlatHex) {
	

	plateau.push(new HexAxial(-1, 0));
	plateau.push(new HexAxial(-1, 1));
	plateau.push(new HexAxial(0, 1));
	plateau.push(new HexAxial(0, -1));
	plateau.push(new HexAxial(1, -1));
	plateau.push(new HexAxial(1, 0));

	for (var k = 0; k < plateau.length; k++) {
		plateau[k].drawhex(iWantFlatHex);
	}
	ctx.stroke();

	for (var k = 0; k < allCorner.length; k++) {
		allCorner[k].makeCircle();
	}
}

window.onload = pavageHex(true);


// ctx.fillStyle = "red";
// ctx.fillRect(0, 0, 150, 80); 

function showCoords(event) {
  var x = event.clientX - c.width/2;
  var y = event.clientY - c.height/2;
  var ind = 0;
  var noCircleClicked = true;
  while (noCircleClicked && ind < allCorner.length) {
	  if (allCorner[ind].imInTheCircle(x,y)) {
	  	noCircleClicked = false;
	  	ctx.fillStyle = "black";
	  	allCorner[ind].makeCircle();
	  }
	  ind++
	}
}

