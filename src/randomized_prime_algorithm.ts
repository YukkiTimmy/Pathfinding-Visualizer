import type { Cell } from "./cell";
import { sleep, setStartCell, setEndCell } from "./index";


export async function randomizedPrimeAlgorithm(grid : Cell[][]) : Promise<Cell[][]> {
    let maze = grid;


    // place a wall in every cell
    for(let y = 0; y < maze.length; y++) {
        for(let x = 0; x < maze[y].length; x++) {
            maze[y][x].isWall = true;
            maze[y][x].div?.classList.add("grid-cell-wall");
        }
    }  


    // choose random startPosition
    let startCell : Cell = maze[Math.floor(Math.random() * maze.length)][Math.floor(Math.random() * maze[0].length)];
    let frontier : Cell[] = [];

    frontier.push(startCell);

    let nextCell : Cell = startCell!;
    
    while(frontier.length > 0) {
        
        let rdm = Math.floor(Math.random() * frontier.length);
        
        nextCell = frontier[rdm];
        frontier.splice(rdm, 1);

        if (nextCell.isWall)
            nextCell.toggleWall();

        document.getElementById("current")?.removeAttribute("id");
        nextCell.div?.setAttribute("id", "current");
        
        if (nextCell.previous) {
            let tmpX = (nextCell.previous!.x - nextCell.x) / 2 + nextCell.x
            let tmpY = (nextCell.previous!.y - nextCell.y) / 2 + nextCell.y
            
            if (maze[tmpY][tmpX].isWall)
                maze[tmpY][tmpX].toggleWall();
        }

        let dirX = [-2, 0, 2, 0];
        let dirY = [0, 2, 0, -2];

        for (let i = 0; i < 4; i++) {
            let dx = dirX[i] + nextCell.x;
            let dy = dirY[i] + nextCell.y;

            if (dx >= 0 && dx < maze[0].length && dy >= 0 && dy <= maze.length - 1) {
                if (maze[dy][dx].isWall) {
                    maze[dy][dx].previous = nextCell;
                    frontier.push(maze[dy][dx]);
                }   
            }
        }
    }

    setStartCell(grid, startCell.x, startCell.y);
    setEndCell(grid, nextCell.x, nextCell.y);

    return maze;
}
