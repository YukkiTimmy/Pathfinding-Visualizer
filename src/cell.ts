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

    setDiv(div: HTMLDivElement) {
        this.div = div;
    }


    expand(grid : Cell[][]) : Cell[] {
        this.div = grid[this.y][this.x].div;
        
        let lastExpandedCell = document.getElementById("current");        
        lastExpandedCell?.removeAttribute("id");
        

        if (!this.isStart) {
            if (this.div?.getAttribute("id") != "end")
                this.div?.setAttribute("id", "current");
            this.div?.classList.replace("grid-cell-candidate", "grid-cell-explored");
        }
            



        let nextCells : Cell[] = [];
        
        let dirX = [-1, 0, 1, 0];
        let dirY = [0, 1, 0, -1];

        for (let i = 0; i < 4; i++) {
            let dx = dirX[i] + this.x;
            let dy = dirY[i] + this.y;

            if (dx >= 0 && dx < grid[0].length && dy >= 0 && dy <= grid.length - 1) {
                if (!grid[dy][dx].isWall) {
                    nextCells.push(new Cell(dx, dy, this));
                    grid[dy][dx].div?.classList.add("grid-cell-candidate");
                }   
            }
        }

        return nextCells;

    }

    calcDistance(endCell : Cell) {
        return Math.abs(this.x - endCell.x) + Math.abs(this.y - endCell.y);
    }

    toggleWall() {
        this.isWall = !this.isWall;
        if (this.isWall) 
            this.div!.classList.add("grid-cell-wall");
        else
            this.div!.classList.remove("grid-cell-wall");
    }
}