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

var cube1 = new HexCube(1,-1,0);




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

	pointy_hex_to_pixel(size) {
	    var x = size * (Math.sqrt(3) * this.q  +  Math.sqrt(3)/2 * this.r)
	    var y = size * (3./2 * this.r)
	    return [x, y]
	}

	drawPointyHex (size) {
		var euclCenter = this.pointy_hex_to_pixel(size);
		moveEucl(euclCenter[0], euclCenter[1]);
		posPen[2] = 0;
		movePol (size, 30, false);
		movePol (0, -60, false);
		for (var i=1; i<=6; i++) {
			movePol(size, -60, true)
		}
		//ctx.stroke();
	}
}

var ax1 = new HexAxial(3,-2);
var p0 = new HexAxial(0,0);


/* Dessiner un hexagone */
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");

ctx.translate(c.width / 2, c.height / 2);

var posPen = [0, 0, 0.0];

function movePol (dist, angle, draw) {
	var x = posPen[0];
	var y = posPen[1];
	var newAngle = posPen[2] + angle;

	var angleRad = newAngle * Math.PI / 180;
	var newX = x + dist*Math.cos(angleRad);
	var newY = y + dist*Math.sin(angleRad);

	posPen = [newX, newY, newAngle];

	if (draw) {
		ctx.lineTo(newX, newY);
		//ctx.stroke();
	}
	else {ctx.moveTo(newX, newY);}

	return posPen
}

function moveEucl (x, y, draw) {
	posPen[0] = x;
	posPen[1] = y;

	if (draw) {
		ctx.lineTo(x, y);
		//ctx.stroke();
	}
	else {ctx.moveTo(x, y);}
}




/* Faire le pavage */
var qmax = 0;
var rmax = 0;

var qmaxNotFound = true;
var rmaxNotFound = true;
var itwillStop = 1

while (qmaxNotFound) {
	var testQ = new HexAxial(qmax, 0);
	var x = testQ.pointy_hex_to_pixel(50)[0];

	if(x/2 > c.width) {
		qmaxNotFound = false;
	}
	else {
		qmax ++;
	}
}

while (rmaxNotFound) {
	var testR = new HexAxial(0, rmax);
	var y = testR.pointy_hex_to_pixel(50)[1];

	if(y/2 > c.height) {
		rmaxNotFound = false;
	}
	else {
		rmax++;
	}
}

var plateau = [];
for (var qIt = Math.round(1-qmax/2); qIt<qmax/2; qIt++) {
	for (var rIt = Math.round(1-rmax/2); rIt < rmax/2; rIt++) {
		plateau.push(new HexAxial(qIt, rIt))
	}
}



// var pl0 = new HexAxial (0,0);
// var pl1 = new HexAxial (0,1);
// var pl2 = new HexAxial (0,-1);
// var pl3 = new HexAxial (-1,1);
// var pl4 = new HexAxial (-1,0);
// var pl5 = new HexAxial (1,0);
// var pl6 = new HexAxial (1,-1);

// var plateau = [pl0, pl1, pl2, pl3, pl4, pl5, pl6];

for (var k = 0; k < plateau.length; k++) {
	plateau[k].drawPointyHex(50);
	console.log(plateau[k]);
}
ctx.stroke();