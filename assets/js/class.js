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
        return new Corner (this.col - this.row, this.col + 2*this.row, this.taken);
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

    // Prendre l'hexagon par le joueur d'id 'player_id'
    take (player_id) {
        this.taken = player_id;
        allPlayers[player_id].updateScore();

        this.getCenterC().drawCircle();
        this.getCorners().filter(cor => cor.taken == player_id).forEach(cor => {
            cor.taken = -1;
            cor.drawCircle();
        })
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
// Coins, coordonnées axiales
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

    drawCircle () {
        var coord = this.getCoordP(), color = (this.taken == -1) ? colorDefault : allPlayers[this.taken].color;
        ctx.fillStyle = color;
        ctx.beginPath(); 
        ctx.arc(coord.x, coord.y, radiusRound, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    }
}




// -------------------------------------------------------------------------------------------------------
// Joueur
// -------------------------------------------------------------------------------------------------------

class Player {
	constructor(id, color, victories) {
		this.id = id;
        this.color = color;
        this.victories = victories;
    }

    getHexa() { return allHexa.filter(hex => hex.taken == this.id); }
    getCorners() { return allCorners.filter(cor => cor.taken == this.id); }

    getScore() { return this.getHexa().length; }

    
    updateScore() {
        $('#score_'+this.id).text(this.getScore());
    }

    updateVictories() {
        $('#victories_'+this.id).text(this.victories);
    }
    increaseVictories() {
        this.victories ++;
        this.updateVictories();
    }

    createDiv() {
        var div = $('<div>'), span1 = $('<span>'), span2 = $('<span>'), input = $('<input>');
        span1.attr('id', 'score_'+this.id).text(this.getScore());
        span2.attr('id', 'victories_'+this.id).text(this.victories);
        input.attr('type', 'color').attr('data-id', this.id).val(this.color);

        div.attr('id', 'player_'+this.id).addClass('player').css('border-color', this.color)
            .html('Joueur '+(this.id+1)+'<br>Score : ').append(span1)
            .append('<br>Victoires : ').append(span2)
            .append('<br>').append(input);
        $('#players-container').append(div);
    }

    turn() {
        $('.player').css('box-shadow', 'none');
        $('#player_'+this.id).css("box-shadow", "0 0 20px -5px "+this.color);
    }

    wins() {
        alert("Victoire du joueur "+(this.id+1)+" !");
        $('.player').css('box-shadow', 'none');
        this.increaseVictories();

        canvas.off('click');
        turn = -1;
    }

    changeColor(color) {
        this.color = color;
        this.getCorners().forEach(cor => cor.drawCircle());
        this.getHexa().forEach(hex => hex.getCenterC().drawCircle());
        $('#player_'+this.id).css('border-color', this.color);
        if (turn == this.id) {this.turn();}
    }
}


