
import type { Cell } from "./cell";

type Nullable<T> = T | null;

var stop = false;


export async function depthFirstSearch(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>, speed : number) : Promise<Nullable<Cell>> {
    if (startCell == null || endCell == null) return null;
    
    let stack : Cell[] = [];
    let explored : Cell[] = [];

    stack.unshift(startCell!);
    explored.push(startCell!);

    let finalCell : Nullable<Cell> = null;
    

    while(finalCell == undefined) {
        if(stop) return null;
        
        
        let currentCell = stack.shift()
        currentCell?.div?.setAttribute("id", "current");
        await sleep(speed);
        
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

        currentCell?.div?.setAttribute("id", "");
    }
    

    console.log("STACK SIZE: " + stack.length);
    console.log("CLOSEDLIST SIZE: " + explored.length);
        


    console.log("Lösung gefunden");
    console.log(finalCell);

    return finalCell;
}

function sleep(ms : number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

export function setStop() {
    stop = true;
}
