let socket = io('localhost:8000');
let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const tileSize = 25;
const rowLength = 5;

let tiles = [];

socket.on('joinSuccess', function(data) {
    console.log(data);
});

socket.on('move', function(tile) {
    tiles.push(tile);
});

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
        socket.emit('tryMove', {
            x: x,
            y: y
        })
    } else {
        translation.x += e.clientX - mouseStart.x;
        translation.y += e.clientY - mouseStart.y;
    }
});

function draw(obj) {
    c.save();
    c.fillStyle = obj.color;
    c.fillRect(obj.x + 3, obj.y + 3, tileSize - 3, tileSize - 3);
    c.restore();
}

function animate() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    c.save();
    c.translate(translation.x, translation.y);
    for (let t of tiles) {
        draw(t);
    }
    c.restore();
    

    requestAnimationFrame(animate);
}

socket.emit('joinRoom');
animate();