import type { Cell } from "./cell";
import { stop, sleep, getPath } from "./index";

type Nullable<T> = T | null;


export async function breadFirstSearch(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>, speed : number) {
    if (startCell == null || endCell == null) return null;
    
    let queue : Cell[] = [];
    let explored : Cell[] = [];

    queue.unshift(startCell!);
    explored.push(startCell!);

    let finalCell : Nullable<Cell> = null;
    

    while(finalCell == undefined) {
        if(stop) return null;
        
        if (speed > 0) await sleep(speed);

        
        let currentCell = queue.shift()
        
        if (currentCell == null) return null;
        if (currentCell.x == endCell.x && currentCell.y == endCell.y)
            finalCell = currentCell;
        


        currentCell?.expand(grid).forEach(element => {
            let cellAlreadyExplored = false;
            for (let i = 0; i < explored.length; i++)
                if (explored[i].x == element.x && explored[i].y == element.y)
                    cellAlreadyExplored = true;
                
    
    
    
            if (!cellAlreadyExplored) {
                queue.push(element);
                explored.push(element);
            } 
            
        });
    }
    

    console.log("STACK SIZE: " + queue.length);
    console.log("CLOSEDLIST SIZE: " + explored.length);
        


    console.log("Lösung gefunden");
    console.log(finalCell);

    getPath(finalCell);
}
