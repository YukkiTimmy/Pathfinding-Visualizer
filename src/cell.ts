export class Cell {
    x : number;
    y : number;
    isWall : boolean;
    previous? : Cell;
    costs : number;
    isStart : boolean;
    isEnd : boolean;
    div?: HTMLDivElement;

    constructor(x : number, y : number, previous? : Cell) {
        this.x = x;
        this.y = y;
        this.previous = previous;
    

        this.costs = 0;
        this.isWall = false;
        this.isStart = false;
        this.isEnd = false;
        this.div = undefined;
    }

    setIsWall(isWall : boolean) {
        this.isWall = isWall;
    }

    setIsStart(isStart: boolean) {
        this.isStart = isStart;
    }

    setIsEnd(isEnd : boolean) {
        this.isEnd = isEnd;
    }

    setDiv( div: HTMLDivElement) {
        this.div = div;
    }


    expand(grid : Cell[][]) : Cell[] {
        let nextCells : Cell[] = [];

        let dirX = [-1, 0, 1, 0];
        let dirY = [0, -1, 0, 1];

        for (let i = 0; i < 4; i++) {
            let dx = dirX[i] + this.x;
            let dy = dirY[i] + this.y;

            if (dx >= 0 && dx < grid[0].length && dy >= 0 && dy <= grid.length - 1) {
                if (!grid[dy][dx].isWall) {
                    nextCells.push(new Cell(dx, dy, this));
                    grid[dy][dx].div?.classList.add("grid-cell-candidate");
                    // if (this.previous != null)
                    //     grid[this.previous.y][this.previous.x].div?.classList.replace( "grid-cell-candidate", "grid-cell-explored");
                } 
            }
        }

        return nextCells;

    }

    calcDistance(endCell : Cell) {
        return Math.abs(this.x - endCell.x) + Math.abs(this.y - endCell.y);
    }

}