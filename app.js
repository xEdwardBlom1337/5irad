let express = require('express');
let app = express();
let server = require('http').Server(app);
let io = require('socket.io').listen(server);
let tools = require('./tools');

server.listen(8000, function () {
    console.log('Server is listening');
});

app.use(express.static(__dirname + '/public'));
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

const tileSize = 25;

let rooms = [];
io.on('connection', function(socket) {
    
    socket.on('joinRoom', function(data) {
        let roomIndex = null;
        for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].roomCode == data) roomIndex = i;
        }

        if (roomIndex != null) {
            if (rooms[roomIndex].players.length < 2) {
                socket.room = rooms[roomIndex];
            } else {
                socket.emit('fullRoom');
                return;
            }
        } else {
            socket.room = new tools.Room;
            rooms.push(socket.room);
        }
        socket.join(socket.room.roomCode);
        if (socket.room.players.length == 0) {
            socket.room.players[0] = socket.id;
        } else {
            socket.room.players[1] = socket.id;
        }
        socket.emit('joinSuccess', {
            room: "Connected to room: " + socket.room.roomCode, 
            turn: tools.indexOf(socket.id, socket.room.players)
        });
        console.log("Player joined room " + socket.room.roomCode +
                    ": " + socket.id);
    });

    socket.on('tryMove', function(data) {
        if (socket.room == undefined) return;
        if (socket.room.gameOver) return;
        if (socket.room.players.length != 2) return;
        if (socket.id != socket.room.players[socket.room.round % 2]) return;

        x = data.x < 0 ? data.x - data.x % tileSize - tileSize : data.x - data.x % tileSize;
        y = data.y < 0 ? data.y - data.y % tileSize - tileSize : data.y - data.y % tileSize;
        let lastMove = socket.room.tiles[socket.room.tiles.length-1];
        if (lastMove != null) {
            let distance = Math.sqrt(Math.pow(lastMove.x - x, 2) + Math.pow(lastMove.y - y, 2));
            if (distance > 250) return;
        }
        if (tools.searchTile(x, y, socket.room.tiles) == null) {
            socket.room.tiles.push(new tools.Tile(x, y, socket.id));
            let playerIndex = tools.indexOf(socket.id, socket.room.players);
            io.sockets.in(socket.room.roomCode).emit('move', {
                x: x,
                y: y,
                color: playerIndex == 0 ? 'hotpink' : 'limegreen'
            });
            if (socket.room.tiles[socket.room.tiles.length-1].checkWin(socket.room.tiles)) {
                socket.room.gameOver = true;
                io.sockets.in(socket.room.roomCode).emit('gameOver');
            }
            socket.room.round++;
        } 
    });

});