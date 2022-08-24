
import type { Cell } from "../cell";
import { stop, sleep, getPath, getSpeed } from "../index";

type Nullable<T> = T | null;


export async function uniformCostSearch(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>) {
    if (startCell == null || endCell == null) return null;
    
    let openList : Cell[] = [];
    let closedList : Cell[] = [];

    openList.push(startCell!);

    let finalCell : Nullable<Cell> = null;
    
    
    while(finalCell == undefined) {
        if(stop) return getPath(null);
        
        let speed = getSpeed();
        if (speed > 0) await sleep(speed);
        
        
        
        let currentCell = openList.shift()
        
        if (currentCell == null) return null;
        if (currentCell.x == endCell.x && currentCell.y == endCell.y) finalCell = currentCell;
        
        currentCell.costs = currentCell.calcDistance(endCell);
        closedList.push(currentCell);
        
        
        
        
        currentCell?.expand(grid).forEach(element => {
            let cellAlreadyExplored = false;
            element.costs = element.calcDistance(endCell);

            for (let i = 0; i < closedList.length; i++)
                if (closedList[i].x == element.x && closedList[i].y == element.y)
                    cellAlreadyExplored = true;
            
            for (let i = 0; i < openList.length; i++)
                if (openList[i].x == element.x && openList[i].y == element.y)
                    cellAlreadyExplored = true;

    
    
            if (!cellAlreadyExplored)
                openList.push(element);
            else if(element.costs < currentCell!.costs)
                currentCell = element;
            
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
