/* Contient toutes les classes utilisées */



// -------------------------------------------------------------------------------------------------------
// Hexagones, coordonnées ligne et colonne
// -------------------------------------------------------------------------------------------------------

class Hexagon {
    constructor (col, row, taken) {
        this.col = col;
        this.row = row;
        this.taken = taken;
    }

    // Récupérer le centre, en tant que coin
    getCenterC () {
        return new Corner (this.col - this.row, this.col + 2*this.row);
    }
    // Récupérer le centre, en tant que point (coord en pixels)
    getCenterP () {
        return this.getCenterC().getCoordP();
    }

    getCorners () {
        var center = this.getCenterC();
        return allCorners.filter(cor => center.isNeighbor(cor));
    }

    nbCornersFree () {
        return this.getCorners().filter(cor => cor.taken == -1).length;
    }

    draw () {
        var center = this.getCenterP();
        
        ctx.beginPath();
        ctx.moveTo(center.x + sizeHex, center.y);
        for (var i=1; i <= 6; i++) {
            var x = center.x + sizeHex*Math.cos(i*Math.PI/3),
                y = center.y + sizeHex*Math.sin(i*Math.PI/3)
            ctx.lineTo(x, y);
        }
        ctx.stroke();
    }
}



// -------------------------------------------------------------------------------------------------------
// Points euclidiens, coordonnées en pixels
// -------------------------------------------------------------------------------------------------------

class PointEucl {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
}



// -------------------------------------------------------------------------------------------------------
// Coins, coordonnées a et b
// -------------------------------------------------------------------------------------------------------

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

    getNeighbors() {
        return allCorners.filter(cor => this.isNeighbor(cor));
    }

    getHexa () {
        return allHexa.filter(hex => this.isNeighbor(hex.getCenterC()))
    }

    // Indique si le coin créé est le centre d'un hexagone
    isCenter() {
        return (this.a - this.b) % 3 == 0;
    }
    // Indique si le coin fait bien partie du plateau 
    isInside() {
        return (Math.abs(this.a) < 4 && Math.abs(this.b) < 4 && Math.abs(this.a + this.b) < 4)
    }

    // Indique si le coin corner_2 est un voisin direct
    isNeighbor (corner_2) {
        var d1 = this.a - corner_2.a, d2 = this.b - corner_2.b;
        return (Math.abs(d1) <= 1 && Math.abs(d2) <=1 && Math.abs(d1+d2) <= 1)
    }

    // Indique si le point de coordonnées posx, posy est à l'intérieur du cercle
    isInCircle(posx, posy) {
        var coord = this.getCoordP(),
            d = Math.sqrt((posx - coord.x)*(posx - coord.x) + (posy - coord.y)*(posy - coord.y));
		return d <= radiusRound;
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


