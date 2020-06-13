
// -------------------------------------------------------------------------------------------------------
// Constantes de base
// -------------------------------------------------------------------------------------------------------

const sizeHex = 70;
const radiusRound = 10;

const colorDefault = "white";
const colorPlayers = ["green", "red"];



// -------------------------------------------------------------------------------------------------------
// Dessin
// -------------------------------------------------------------------------------------------------------

const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

const originX = c.width/2;
const originY = c.height/2

ctx.translate(originX, originY);




// -------------------------------------------------------------------------------------------------------
// Démarrage
// -------------------------------------------------------------------------------------------------------

let allHexa = [], allCorners = [], allPlayers = [];

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
}

// Pavage initial
function pavageHex() {
	allHexa.forEach(hexa => {hexa.draw()});
	allCorners.forEach(corner => {corner.drawCircle(colorDefault)});
}

window.onload = pavageHex();



// -------------------------------------------------------------------------------------------------------
// Tour de jeu
// -------------------------------------------------------------------------------------------------------

let turn = 0;

// Clic sur un cercle
function clickOnCorners(e) {
	var x = e.pageX - $('#myCanvas')[0].offsetLeft - originX,
		y = e.pageY - $('#myCanvas')[0].offsetTop - originY;

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
			alert("Rule 618: this corner cannot be taken");
			cor.taken = -1;
		}
		// Sinon, on prend le coin et on gère les nouveaux hexagones pris
		else {
			cor.drawCircle(colorPlayers[turn]);
			turn = (turn+1)%2;
			hexa_taken.forEach(pair => {pair.hexagon.take(pair.player)})
		}

	}
	
}

