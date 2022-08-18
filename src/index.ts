
import { Cell } from "./cell";
import { depthFirstSearch } from "./depth_first_search";
import { breadFirstSearch} from "./breadth_first_search";
import { greedySearch } from "./greedy_search";
import { uniformCostSearch } from "./uniform_cost_search";
import { aStar } from "./astar";

const WIDTH : number = 40;
const HEIGHT : number = 25;
const CELLDIM : number = 20;

type Nullable<T> = T | null;

export var startCell : Nullable<Cell> = null;
export var endCell : Nullable<Cell> = null;

export var stop : boolean = false;


function init() {
    // Set up an empty array of Cells
    let grid = initCellArray();

    // Set up the grid of divs
    setUpGrid(grid);

    // Set the start and end Cells
    startCell = setStartCell(grid, 5, 12);
    endCell = setEndCell(grid, 15, 12);


    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    let speedSlider = document.getElementById("speed-slider")  as HTMLInputElement;
    let algorithmSelector = document.getElementById("algorithm-selection") as HTMLSelectElement;

    var lastCell : Promise<Nullable<Cell>>;

    startBtn?.addEventListener('click', e => {
        let selection = algorithmSelector.options[algorithmSelector.selectedIndex];
        
        startBtn.style.display = "none";
        stopBtn!.style.display = "block";

        if (selection.value == "depth-first-search")
            lastCell = depthFirstSearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "breadth-first-search")
            lastCell = breadFirstSearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "greedy-search")
            lastCell = greedySearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "uniform-cost-search")
            lastCell = uniformCostSearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "a-star")
            lastCell = aStar(grid, startCell, endCell, +speedSlider!.value);
        else
            console.log("ERROR");

        lastCell.then(value => {
            getPath(value!);
        });
    });
    
    stopBtn?.addEventListener('click', e => {
        startBtn!.style.display = "block";
        stopBtn.style.display = "none";
        setStop();
        resetGrid(grid);
    });


    
    document.addEventListener("mousedown", setPrimaryButtonState);
    document.addEventListener("mousemove", setPrimaryButtonState);
    document.addEventListener("mouseup", setPrimaryButtonState);

}

var primaryMouseButtonDown = false;

function setPrimaryButtonState(e : MouseEvent) {
  var flags = e.buttons !== undefined ? e.buttons : e.which;
  primaryMouseButtonDown = (flags & 1) === 1;
}

function initCellArray() : Cell[][] {
    let grid : Cell[][] = [];

    for (let y = 0; y < HEIGHT; y++) {
        grid[y] = new Array<Cell>;
        
        for (let x = 0; x < WIDTH; x++) {
            let tmpCell : Cell = new Cell(x, y, undefined);
            
            grid[y][x] = tmpCell;
        }
    }
    

    return grid;
}



function setUpGrid(grid : Cell[][]) {
    const gridContainer = document.getElementById("grid-container");

    if (gridContainer == null) return null;

    gridContainer.style.gridTemplateColumns = 'repeat(' + WIDTH + ', ' + CELLDIM + 'px)';
    gridContainer.style.gridTemplateRows = 'repeat(' + HEIGHT + ', ' + CELLDIM + 'px)';
    

    for (let y = 0; y < HEIGHT; y++) {        
        for (let x = 0; x < WIDTH; x++) {
            let gridCell = document.createElement("div");
            gridCell.classList.add("grid-cell");
            gridCell.setAttribute("data-x", x.toString());
            gridCell.setAttribute("data-y", y.toString());
            gridCell.setAttribute("id", " ");
            
            gridContainer?.appendChild(gridCell);
            grid[y][x].div = gridCell;
            
            if(grid[y][x].isWall) 
                gridCell.classList.add("grid-cell-wall");

            gridCell.addEventListener('mouseover', e => {
                if (primaryMouseButtonDown)
                    gridCellClicked(gridCell, grid);
            });
        }
    }
}

function resetGrid(grid : Cell[][]) {
    const gridContainer = document.getElementById("grid-container");

    let children = gridContainer?.children;
    if(children)
        for (let i = 0; i < children?.length; i++) {
            if (children[i].classList.contains("grid-cell-explored")) children[i].classList.remove("grid-cell-explored");
            if (children[i].classList.contains("grid-cell-candidate")) children[i].classList.remove("grid-cell-candidate");

        }

   
   grid = initCellArray();

}



function gridCellClicked(div : HTMLDivElement, grid : Cell[][]) {
    let x : number = +div.getAttribute("data-x")!;
    let y : number = +div.getAttribute("data-y")!;
    
    let gridCell : Cell = grid[y][x];

    if (gridCell.isStart || gridCell.isEnd) return;

    gridCell.isWall = !gridCell.isWall;
    
    if (gridCell.isWall) 
        div.classList.add("grid-cell-wall");
    else
        div.classList.remove("grid-cell-wall");

    // console.log(gridCell)

}



function setStartCell(grid : Cell[][], x : number, y : number) : Cell{
    grid[y][x].isStart = true;
    grid[y][x].div?.setAttribute("id", "start");
    return grid[y][x];
}

function setEndCell(grid : Cell[][], x : number, y : number) : Cell {
    grid[y][x].isEnd = true;
    grid[y][x].div?.setAttribute("id", "end");
    return grid[y][x];
}


function setStop() {
    stop = true;
}



function getPath(lastCell : Cell) {
    let path : Cell[] = [];
    while(lastCell.previous != null) {
        path.push(lastCell);
        lastCell = lastCell.previous;
    }
    path.reverse();
}


init();