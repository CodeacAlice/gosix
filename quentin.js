class Hex {
  constructor(x,y,z){
    this.x=x;
    this.y=y;
    this.z=z;
  }
  hex_to_point(){
    var q = this.x
    var r = this.z
    return new Hex (this.q, this.r)
  }
  checksum(){
    return (this.x + this.y + this.z == 0);
  }
};
var p = new Hex (1,-1,0);
console.log(p.checksum());
class Point {
  constructor(q,r){
    this.q=q;
    this.r=r;
  }
  point_to_hex(){
    var x = this.q
    var z = this.r
    var y = -x-z
    return new Point (this.x, this.y, this.z)
  }
};

function draw(a, b) {
    var canvas = document.getElementById('canvas');
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d'),side = 0,
        size = 100,
        x = a*100,
        y = b*100;
        ctx.beginPath();
        ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
        for (side; side < 7; side++) {
            ctx.lineTo(x + size * Math.cos(side * 2 * Math.PI / 6), y + size * Math.sin(side * 2 * Math.PI / 6));
        }
        ctx.fillStyle = "#fff";
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.fill();
    }
};
draw(1, 1);
draw(1, 2.73);
draw(1, 4.46);
draw(2.5, 1.87);
draw(2.5, 3.6);