import type { Cell } from "../cell";
import { stop, sleep, getPath, getSpeed } from "../index";


type Nullable<T> = T | null;


export async function depthFirstSearch(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>) {
    if (startCell == null || endCell == null) return null;
    
    
    
    let stack : Cell[] = [];
    let explored : Cell[] = [];
    
    stack.unshift(startCell!);
    explored.push(startCell!);
    
    let finalCell : Nullable<Cell> = null;
    
    
    while(stack.length > 0 && finalCell == null ) {
        if(stop) return getPath(null);
        let speed = getSpeed();
        if (speed > 0) await sleep(speed);

        
        let currentCell = stack.shift()
        
        if (currentCell == null) return null;

        if (currentCell.x == endCell.x && currentCell.y == endCell.y)
            finalCell = currentCell;
        
        currentCell?.expand(grid).forEach(element => {
            let cellAlreadyExplored = false;
            for (let i = 0; i < explored.length; i++)
                if (explored[i].x == element.x && explored[i].y == element.y)
                    cellAlreadyExplored = true;
                
    
    
    
            if (!cellAlreadyExplored) {
                stack.unshift(element);
                explored.push(element);
            } 
            
        });
    }
    

    console.log("STACK SIZE: " + stack.length);
    console.log("CLOSEDLIST SIZE: " + explored.length);
        


    console.log("Lösung gefunden");
    console.log(finalCell);

    getPath(finalCell);
}

