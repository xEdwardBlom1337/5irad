const tileSize = 25;

class Tile {
    constructor(x, y, player) {
        this.x = x;
        this.y = y;
        this.player = player;
    }

    checkWin(tiles) {
        let dirPairs = [
                    [0, tileSize],
                    [tileSize, tileSize],
                    [tileSize, 0],
                    [tileSize, -tileSize]
                ];

        for (let pair of dirPairs) {
            let forward = this.lookRow(pair[0], pair[1], 0, tiles);
            let backward = this.lookRow(-pair[0], -pair[1], 0, tiles);
            if (forward + backward + 1 >= 5) return true;
        }
        return false;
    }

    lookRow(xdif, ydif, inRow, tiles) {
        let t = searchTile(this.x + xdif, this.y + ydif, tiles);
        if (t == null || t.player != this.player) return inRow;
        return t.lookRow(xdif, ydif, inRow + 1, tiles);
    }

}

function searchTile(x, y, tiles) {
    for (let t of tiles) {
        if (t.x == x && t.y == y) {
            return t;
        }
    }
    return null;
}

function indexOf(element, arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] == element) {
            return i
        }
    }
    return null;
}

class Room {
    constructor() {
        this.roomCode = 'abc';
        this.players = [];
        this.round = 0;
        this.tiles = [];
        this.gameOver = false;
    }
}

module.exports.Tile = Tile;
module.exports.Room = Room;
module.exports.searchTile = searchTile;
module.exports.indexOf = indexOf;
