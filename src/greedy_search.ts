
import type { Cell } from "./cell";
import { stop } from "./index";

type Nullable<T> = T | null;


export async function greedySearch(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>, speed : number) : Promise<Nullable<Cell>> {
    if (startCell == null || endCell == null) return null;
    
    let openList : Cell[] = [];
    let closedList : Cell[] = [];

    openList.unshift(startCell!);
    closedList.push(startCell!);

    let finalCell : Nullable<Cell> = null;
    

    while(finalCell == undefined) {
        if(stop) return null;
        
        
        let currentCell = openList.shift()
        await sleep(speed);
        
        if (currentCell == null) return null;

        if (currentCell.x == endCell.x && currentCell.y == endCell.y)
            finalCell = currentCell;
        
        currentCell?.expand(grid).forEach(element => {
            let cellAlreadyExplored = false;
            for (let i = 0; i < closedList.length; i++)
                if (closedList[i].x == element.x && closedList[i].y == element.y)
                    cellAlreadyExplored = true;
                

    
    
            if (!cellAlreadyExplored) {
                element.costs = element.calcDistance(endCell);
                openList.push(element);
                closedList.push(element);
            }
            
        });

        openList.sort((a , b ) => {
            return a.costs - b.costs;
        })
    }
    

    console.log("OPENLSIT SIZE: " + openList.length);
    console.log("CLOSEDLIST SIZE: " + closedList.length);
        


    console.log("Lösung gefunden");
    console.log(finalCell);

    return finalCell;
}

function sleep(ms : number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}
