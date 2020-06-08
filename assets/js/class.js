// Contient toutes les classes utilisées



class Hexagon {
    constructor (row, col, corners, taken) {
        this.row = row;
        this.col = col;
        this.corners = corners;
        this.taken = taken;
    }

    getCenterC () {
        return new Corner2 (this.row - this.col, this.row + 2*this.col);
    }

    getCenterP () {
        return this.getCenterC().getCoordP();
    }

    findCorners () {
        var center = this.getCenterC(), rep = [];
        rep.push( new Corner2 (center.a+1, center.b  ));
        rep.push( new Corner2 (center.a  , center.b+1));
        rep.push( new Corner2 (center.a-1, center.b+1));
        rep.push( new Corner2 (center.a-1, center.b  ));
        rep.push( new Corner2 (center.a  , center.b-1));
        rep.push( new Corner2 (center.a+1, center.b-1));
        return rep;
    }

    makeCorners () {
        var corners = this.findCorners(), all = [];
        corners.forEach(cor => {
            var name = '' + cor.a + cor.b;
            if (!allCorners.hasOwnProperty(name)) {
                allCorners[name] = cor;
            }
            all.push(name);
        })
        this.corners = all;
        return this;
    }

    draw () {
        var corners = this.corners.map(cor => {
            return allCorners[cor].getCoordP();
        });
        
        ctx.beginPath();
        ctx.moveTo(corners[0].x, corners[0].y);
        corners.forEach(c => { ctx.lineTo(c.x, c.y); })
        ctx.lineTo(corners[0].x, corners[0].y);
        ctx.stroke();
    }
}



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


class Corner2 {
    constructor (a, b, taken) {
        this.a = a;
        this.b = b;
        this.taken = taken;
    }

    getCoordP () {
        var x = sizeHex*(this.a + this.b/2), y = sizeHex*this.b*Math.sqrt(3)/2;
        return new PointEucl(x, y);
    }

    isCenter() {
        return (this.a - this.b) % 3 == 0;
    }

    drawCircle (color) {
        var coord = this.getCoordP();
        ctx.fillStyle = color;
        ctx.beginPath(); 
        ctx.arc(coord.x, coord.y, radiusRound, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}


