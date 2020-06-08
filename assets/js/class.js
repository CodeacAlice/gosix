// Contient toutes les classes utilisées



class Hexagon {
    constructor (row, col, corners, taken) {
        this.row = row;
        this.col = col;
        this.corners = corners;
        this.taken = taken;
    }

    getCenterC () {
        return new Corner (this.row - this.col, this.row + 2*this.col);
    }

    getCenterP () {
        return this.getCenterC().getCoordP();
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



class PointEucl {
	constructor(x,y) {
		this.x = x;
		this.y = y;
	}
}


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

    isCenter() {
        return (this.a - this.b) % 3 == 0;
    }

    isInside() {
        return (Math.abs(this.a) < 4 && Math.abs(this.b) < 4 && Math.abs(this.a + this.b) < 4)
    }

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

    isInCircle(posx, posy) {
        var coord = this.getCoordP(),
            d = Math.sqrt((posx - coord.x)*(posx - coord.x) + (posy - coord.y)*(posy - coord.y));
		return d <= radiusRound;
    }
}


