import type { Cell } from "./cell";
import { stop, sleep, getPath } from "./index";

type Nullable<T> = T | null;


export async function aStar(grid: Cell[][], startCell : Nullable<Cell>, endCell : Nullable<Cell>, speed : number) {
    if (startCell == null || endCell == null) return null;
    
    let openList : Cell[] = [];
    let closedList : Cell[] = [];


    startCell.costs = 0;
    openList.push(startCell!);

    
    let finalCell : Nullable<Cell> = null;
    

    while(finalCell == undefined) {
        if(stop) return null;
        

        if (speed > 0) await sleep(speed);


        let currentCell : Cell = openList.reduce(function(prev, current) {
            return (prev.costs < current.costs) ? prev : current
        });

        openList = openList.filter(obj => {return obj !== currentCell});

        
        if (currentCell == null) return null;
        if (currentCell.x == endCell.x && currentCell.y == endCell.y) finalCell = currentCell;
        
        closedList.push(currentCell);


        currentCell?.expand(grid).forEach(element => {
            element.costs = element.costs + element.calcDistance(endCell);


            let cellAlreadyExplored = false;
            for (let i = 0; i < closedList.length; i++)
                if (closedList[i].x == element.x && closedList[i].y == element.y)
                    cellAlreadyExplored = true;
                

    
    
            if (!cellAlreadyExplored) {
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
