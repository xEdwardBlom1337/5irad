let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 25;
c.fillStyle = "hotpink";

let tiles = [];
let round = 0;

function searchTile(x, y) {
    for (let t of tiles) {
        if (t.x == x && t.y == y) {
            return t;
        }
    }
    return null;
}


document.addEventListener("click", function(e){
    let x = e.clientX - e.clientX % tileSize;
    let y = e.clientY - e.clientY % tileSize;
    if (searchTile(x, y) == null) {
        tiles.push(new Tile(x, y, round % 2));
        round++;
    }
});


function animate() {
    for (let t of tiles) {
        t.draw();
    }

    if (tiles.length > 4) {
        let lastTile = tiles[tiles.length-1];
        if (lastTile.checkWin()) {
            console.log("GAME OVER");
            console.log("Player " + Number(lastTile.player + 1) + " (" + lastTile.color + ") won");
            
            return;
        }
    }
    

    requestAnimationFrame(animate);
}

animate();