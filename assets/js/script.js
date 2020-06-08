/* Eléments pour le dessin */
const c = document.getElementById("myCanvas");
const ctx = c.getContext("2d");

const originX = c.width/2;
const originY = c.height/2

ctx.translate(originX, originY);

const sizeHex = 70;
const radiusRound = 10;

const colorCircle = "white";
const colorPlayers = ["green", "red"];

let turn = 0;
let allCorners = {}, allHexa = [];



// Pavage initial
function pavageHex() {
	for (var i = -1; i <= 1; i++) {
		for (var j = -1; j <= 1; j++) {
			if (Math.abs(i+j) < 2) {
				var hexa = new Hexagon(i,j);
				allHexa.push(hexa);
				hexa.makeCorners().draw();
				hexa.taken = -1;
			}
		}
	}
	Object.keys(allCorners).forEach(key => {
		allCorners[key].drawCircle(colorCircle);
		allCorners[key].taken = -1;
	})
}

window.onload = pavageHex();



// Clic sur un cercle
function clickOnCorners(event) {
	var x = event.clientX - originX;
	var y = event.clientY - originY;
	var corners = Object.keys(allCorners).map(key => allCorners[key]).filter(cor => cor.taken == -1);
	for (let cor of corners) {
		if (cor.isInCircle(x,y)) {
			cor.taken = turn;
			cor.drawCircle(colorPlayers[turn]);

			turn = (turn+1)%2;
			break;
		}
	}
}

