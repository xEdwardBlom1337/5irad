class Tile {
    constructor(x, y, player) {
        this.x = x;
        this.y = y;
        this.player = player;
        this.color = player == 0 ? "hotpink" : "limegreen";
    }

    draw() {
        c.save();
        c.fillStyle = this.color;
        c.fillRect(this.x + 3, this.y + 3, tileSize - 3, tileSize - 3);
        c.restore();
    }

    checkWin() {
        let dirPairs = [
                    [0, tileSize],
                    [tileSize, tileSize],
                    [tileSize, 0],
                    [tileSize, -tileSize]
                ];

        for (let pair of dirPairs) {
            let forward = this.lookRow(pair[0], pair[1], 0);
            let backward = this.lookRow(-pair[0], -pair[1], 0);
            if (forward + backward + 1 >= rowLength) return true;
        }
        return false;
    }

    lookRow(xdif, ydif, inRow) {
        let t = searchTile(this.x + xdif, this.y + ydif);
        if (t == null || t.player != this.player) return inRow;
        return t.lookRow(xdif, ydif, inRow + 1);
    }

}