let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 25;
const rowLength = 5;

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


let mouseStart = {
    x: 0,
    y: 0
};
let translation = {
    x: 0,
    y: 0
}
document.addEventListener("mousedown", function(e){
    mouseStart.x = e.clientX;
    mouseStart.y = e.clientY;
});
document.addEventListener("mouseup", function(e){
    if (e.clientX == mouseStart.x && e.clientY == mouseStart.y) {
        let x = e.clientX - translation.x;
        let y = e.clientY - translation.y;
        x = x < 0 ? x - x % tileSize - tileSize : x - x % tileSize;
        y = y < 0 ? y - y % tileSize - tileSize : y - y % tileSize;
        if (searchTile(x, y) == null) {
            tiles.push(new Tile(x, y, round % 2));
            round++;
        }
    } else {
        translation.x += e.clientX - mouseStart.x;
        translation.y += e.clientY - mouseStart.y;
    }
});


function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(translation.x, translation.y);
    for (let t of tiles) {
        t.draw();
    }
    c.restore();

    if (tiles.length > 4) {
        let lastTile = tiles[tiles.length-1];
        if (lastTile.checkWin()) {
            console.log("Player " + Number(lastTile.player + 1) + " (" + lastTile.color + ") won");
            
            return;
        }
    }
    

    requestAnimationFrame(animate);
}

animate();