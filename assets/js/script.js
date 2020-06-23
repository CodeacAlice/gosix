
// -------------------------------------------------------------------------------------------------------
// Constantes 
// -------------------------------------------------------------------------------------------------------

// Tailles
const sizeHex = 70;
const radiusRound = 10;

// Couleurs
const colorDefault = "white";
const colorPlayers = ["#00ff00", "#ff0000"];

// Canvas
const canvas = $('#gosixCanvas');
const c = canvas[0];
const ctx = c.getContext("2d");

const originX = c.width/2;
const originY = c.height/2

ctx.translate(originX, originY);

// Erreur
const errorText = "Erreur : ce coin ne peut être pris."




// -------------------------------------------------------------------------------------------------------
// Démarrage
// -------------------------------------------------------------------------------------------------------

let allHexa = [], allCorners = [], allPlayers = [];
let turn = 0;

// Création des hexagones
for (var i = -1; i <= 1; i++) {
	for (var j = -1; j <= 1; j++) {
		if (Math.abs(i+j) < 2) {
			var hexa = new Hexagon(i,j, -1);
			allHexa.push(hexa);
		}
	}
}

// Création des coins
for (var i=-3; i <= 3; i++) {
	for (var j=-3; j <= 3; j++) {
		var corner = new Corner (i,j, -1);
		if (!corner.isCenter() && corner.isInside()) {
			allCorners.push(corner);
		}
	}
}

// Création des joueurs
for (var i = 0; i <= 1; i ++) {
	var player = new Player(i, colorPlayers[i], 0);
	allPlayers.push(player);
	player.createDiv();
}


// Commencer une partie
function start() {
	canvas.off('click');
	ctx.clearRect(-originX, -originY, 2*originX, 2*originY);

	allHexa.forEach(hex => {hex.taken = -1; hex.draw()});
	allCorners.forEach(cor => {cor.taken = -1; cor.drawCircle()});
	allPlayers.forEach(pl => pl.updateScore())
	
	allPlayers[0].turn(); turn = 0;
	canvas.click(clickOnCorners);
}

window.onload = start();



// -------------------------------------------------------------------------------------------------------
// Tour de jeu
// -------------------------------------------------------------------------------------------------------

// Clic sur un cercle
function clickOnCorners(e) {
	var x = e.pageX - c.offsetLeft - originX,
		y = e.pageY - c.offsetTop - originY;

	// Si on a cliqué sur le coin 'cor', qui est libre
	var cor = allCorners.filter(corner => (corner.taken == -1 && corner.isInCircle(x,y)))[0];
	if (cor) { 
		cor.taken = turn;

		var equal = false, hexa_taken = [];

		cor.getHexa().forEach(hex => {
			// Si un hexagone 'hex' du coin cliqué est maintenant couvert
			if (hex.taken == -1 && hex.nbCornersFree() === 0) { 
				var chains = [[],[]];

				// Fonction récursive pour trouver les coins récupérés par un même joueur reliés
				function makeChain(corner, player) {
					if (chains[0].length + chains[1].length+chains.length < 50) {
						corner.getNeighbors().forEach(nei => {
							if (nei.taken == player && chains[player].indexOf(nei) == -1) {
								chains[player].push(nei)
								makeChain(nei, player);
							}
						})
					}
					
				}

				// Pour chaque coin de l'hexagone, on cherche et store les coins pris par chaque joueur
				hex.getCorners().forEach(corh => {
					var pl = corh.taken;
					if (chains[pl].indexOf(corh) == -1) {
						chains[pl].push(corh);
						makeChain(corh, pl);
					}
				})

				// On compte les résultats
				var l0 = chains[0].length, l1 = chains[1].length;
				if (l0 == l1) {equal = true;}
				else {
					if (l0 > l1) {var pl = 0} else {var pl = 1}
					hexa_taken.push({hexagon: hex, player: pl});
				}
			}
		})


		// S'il y a une égalité, on ne peut pas prendre le coin
		if (equal) {
			alert(errorText);
			cor.taken = -1;
		}
		// Sinon, on prend le coin et on gère les nouveaux hexagones pris
		else {
			cor.drawCircle();
			hexa_taken.forEach(pair => {pair.hexagon.take(pair.player)})
			
			// Si un joueur a gagné
			var winner = allPlayers.filter(pl => pl.getScore() >= 4)[0];
			if (winner) {winner.wins();}
			else {
				turn = (turn+1)%2;
				allPlayers[turn].turn();
			}
		}
	}
}





// -------------------------------------------------------------------------------------------------------
// Changement de couleur
// -------------------------------------------------------------------------------------------------------

$('input').on('change', function(){
	allPlayers[$(this).attr('data-id')].changeColor(this.value);
})





// -------------------------------------------------------------------------------------------------------
// Affichage des règles
// -------------------------------------------------------------------------------------------------------

$('h3').click(function(){
	$('#rules, .fas').toggleClass('hide');
})
