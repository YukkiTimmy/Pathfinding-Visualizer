import type { Cell } from "../cell";
import { stop, sleep, getPath, getSpeed } from "../index";

type Nullable<T> = T | null;


export async function greedySearch(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>) {
    if (startCell == null || endCell == null) return null;
    
    let openList : Cell[] = [];
    let closedList : Cell[] = [];

    openList.unshift(startCell!);
    closedList.push(startCell!);

    let finalCell : Nullable<Cell> = null;
    

    while(finalCell == undefined) {
        if(stop) return getPath(null);
        
        let speed = getSpeed();
        if (speed > 0) await sleep(speed);
        
        
        
        let currentCell = openList.shift()
        
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

    getPath(finalCell);
}
