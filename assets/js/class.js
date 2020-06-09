/* Contient toutes les classes utilisées */


// Les hexagones
class Hexagon {
    constructor (col, row, corners, taken) {
        this.col = col;
        this.row = row;
        this.corners = corners;
        this.taken = taken;
    }

    getCenterC () {
        return new Corner (this.col - this.row, this.col + 2*this.row);
    }

    getCenterP () {
        return this.getCenterC().getCoordP();
    }

    nbCornersFree () {
        return this.corners.map(name => allCorners[name]).filter(cor => cor.taken == -1).length;
    }

    findCorners () {
        var center = this.getCenterC(), rep = [];
        rep.push( new Corner (center.a+1, center.b  ));
        rep.push( new Corner (center.a  , center.b+1));
        rep.push( new Corner (center.a-1, center.b+1));
        rep.push( new Corner (center.a-1, center.b  ));
        rep.push( new Corner (center.a  , center.b-1));
        rep.push( new Corner (center.a+1, center.b-1));
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


// Point euclidien, x et y sont les coordonnées en pixel
class PointEucl {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
}


// Les coins, 
class Corner {
    constructor (a, b, taken) {
        this.a = a;
        this.b = b;
        this.taken = taken;
    }

    getCoordP () {
        var x = sizeHex*(this.a + this.b/2), y = sizeHex*this.b*Math.sqrt(3)/2;
        return new PointEucl(x, y);
    }

    drawCircle (color) {
        var coord = this.getCoordP();
        ctx.fillStyle = color;
        ctx.beginPath(); 
        ctx.arc(coord.x, coord.y, radiusRound, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }

    // Indique si le coin créé est le centre d'un hexagone
    isCenter() {
        return (this.a - this.b) % 3 == 0;
    }
    // Indique si le coin fait bien partie du plateau (à enlever ?)
    isInside() {
        return (Math.abs(this.a) < 4 && Math.abs(this.b) < 4 && Math.abs(this.a + this.b) < 4)
    }

    // Indique si le coin corner_2 est voisin un direct
    isNeighbor (corner_2) {
        var d1 = this.a - corner_2.a, d2 = this.b - corner_2.b;
        return (Math.abs(d1) <= 1 && Math.abs(d2) <=1 && Math.abs(d1+d2) <= 1)
    }

    getNeighbors() {
        return Object.keys(allCorners).map(key => allCorners[key])
                .filter(cor => this.isNeighbor(cor));
    }

    getHexa () {
        return allHexa.filter(hex => this.isNeighbor(hex.getCenterC()))
    }

    // Indique si le point de coordonnées posx, posy est à l'intérieur du cercle
    isInCircle(posx, posy) {
        var coord = this.getCoordP(),
            d = Math.sqrt((posx - coord.x)*(posx - coord.x) + (posy - coord.y)*(posy - coord.y));
		return d <= radiusRound;
    }
}


