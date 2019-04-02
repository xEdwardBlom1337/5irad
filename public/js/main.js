let socket = io('localhost:8000');
let canvas = document.getElementById('canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.lineWidth = 3;

const tileSize = 25;

let tiles = [];

socket.on('joinSuccess', function(data) {
    console.log(data);
    document.getElementById('room').innerHTML = data;
    document.getElementById("panel").classList.toggle("hidden");
});

socket.on('fullRoom', function() {
    alert('This room is full');
});


socket.on('gameOver', function() {
    alert('GAME OVER');
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

    c.strokeStyle = "rgb(240, 240, 240)";
    c.beginPath();
    for (let x = 1.5 + translation.x % tileSize; x < canvas.width; x += tileSize) {
        c.moveTo(x, 0);
        c.lineTo(x, canvas.height);
    }
    for (let y = 1.5 + translation.y % tileSize; y < canvas.height; y += tileSize) {
        c.moveTo(0, y);
        c.lineTo(canvas.width, y);
    }
    c.stroke();

    c.strokeStyle = "red";
    c.strokeRect(translation.x + 1.5, translation.y + 1.5, 250, 250);

    requestAnimationFrame(animate);
}

function join() {
    animate();
    socket.emit('joinRoom', document.getElementById('room-code').value);
}