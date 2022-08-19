import { Cell } from "./cell";
import { depthFirstSearch } from "./depth_first_search";
import { breadFirstSearch} from "./breadth_first_search";
import { greedySearch } from "./greedy_search";
import { uniformCostSearch } from "./uniform_cost_search";
import { aStar } from "./astar";
import { randomizedPrimeAlgorithm } from "./randomized_prime_algorithm";

const STARTWIDTH : number = 45
var WIDTH : number = STARTWIDTH;
const STARTHEIGHT : number = 30;
var HEIGHT : number = STARTHEIGHT;
const CELLDIM : number = 20;

type Nullable<T> = T | null;

export var startCell : Nullable<Cell> = null;
export var endCell : Nullable<Cell> = null;

export var stop : boolean = false;

var clickType : Nullable<String> = null;



document.addEventListener("mousedown", setPrimaryButtonState);
document.addEventListener("mousemove", setPrimaryButtonState);
document.addEventListener("mouseup", setPrimaryButtonState);


function init() {
    // Set up an empty array of Cells
    let grid = initCellArray();

    // Set up the grid of divs
    setUpGrid(grid);

    // Set the start and end Cells
    startCell = setStartCell(grid, WIDTH - WIDTH + 3, Math.floor(HEIGHT / 2));
    endCell = setEndCell(grid, WIDTH - 3, Math.floor(HEIGHT / 2));


    // Get the diffrent buttons
    const startBtn = document.getElementById("start-btn");
    const stopBtn = document.getElementById("stop-btn");
    const speedSlider = document.getElementById("speed-slider") as HTMLInputElement;
    const algorithmSelector = document.getElementById("algorithm-selection") as HTMLSelectElement;
    const widthSlider = document.getElementById("width-slider") as HTMLInputElement;
    const heightSlider = document.getElementById("height-slider") as HTMLInputElement;
    const defaultDimBtn = document.getElementById("default-dim-btn") as HTMLInputElement;


    startBtn?.addEventListener('click', e => {    
        resetGrid(grid);
        
        let selection = algorithmSelector.options[algorithmSelector.selectedIndex];
        
        startBtn.style.display = "none";
        stopBtn!.style.display = "inline";

        if (selection.value == "depth-first-search")
            depthFirstSearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "breadth-first-search")
            breadFirstSearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "greedy-search")
            greedySearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "uniform-cost-search")
            uniformCostSearch(grid, startCell, endCell, +speedSlider!.value);
        else if (selection.value == "a-star")
            aStar(grid, startCell, endCell, +speedSlider!.value);
        else
            console.log("ERROR");
        
    });

    

    // stop function
    stopBtn?.addEventListener('click', e => {
        startBtn!.style.display = "inline";
        stopBtn.style.display = "none";
        stop = false;
        resetGrid(grid);
    });


    // generate Labyrinth
    const generateButton = document.getElementById("generate-btn");
    generateButton?.addEventListener('click', e => {
        startCell!.isStart = false;
        startCell?.div?.removeAttribute("id");
        endCell!.isStart = false;
        endCell?.div?.removeAttribute("id");
        randomizedPrimeAlgorithm(grid);

        startBtn!.style.display = "inline";
        stopBtn!.style.display = "none";
        resetGrid(grid);
    });



    // Dimensions
    heightSlider.onchange = function() {
        grid = hardResetGrid(grid);
    }

    widthSlider.onchange = function() {
        grid = hardResetGrid(grid);
    }

    defaultDimBtn.addEventListener('click', e => {
        widthSlider.value = STARTWIDTH.toString();
        heightSlider.value = STARTHEIGHT.toString();
        grid = hardResetGrid(grid);
    });
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
            
            gridCell.addEventListener('mousedown', e => {
                gridCellClicked(gridCell, grid);
            });

            gridCell.addEventListener('mouseup', e => {
                clickType = null;
            });

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
            if (children[i].classList.contains("grid-cell-path"))  children[i].classList.remove("grid-cell-path");
        }

   
   grid = initCellArray();

}

function hardResetGrid(grid : Cell[][]) : Cell[][] {
    const widthSlider = document.getElementById("width-slider") as HTMLInputElement;
    const heightSlider = document.getElementById("height-slider") as HTMLInputElement;

    const gridContainer = document.getElementById("grid-container");
    gridContainer?.remove();

    const gridBase = document.getElementById("grid-base");

    let newGridContainer= document.createElement("div");
    newGridContainer.setAttribute("id", "grid-container");

    gridBase?.appendChild(newGridContainer);

    WIDTH = +widthSlider.value;
    HEIGHT = +heightSlider.value;

    grid = initCellArray();
    setUpGrid(grid);

    startCell = setStartCell(grid, WIDTH - WIDTH + 3, Math.floor(HEIGHT / 2));
    endCell = setEndCell(grid, WIDTH - 3, Math.floor(HEIGHT / 2));

    return grid;
}



// check for mouse1 press
var primaryMouseButtonDown = false;

function setPrimaryButtonState(e : MouseEvent) {
  var flags = e.buttons !== undefined ? e.buttons : e.which;
  primaryMouseButtonDown = (flags & 1) === 1;
}


// grid cell was clicked
function gridCellClicked(div : HTMLDivElement, grid : Cell[][]) {
    // get the cell via the coresponding coordinates
    let x : number = +div.getAttribute("data-x")!;
    let y : number = +div.getAttribute("data-y")!;
    
    let gridCell : Cell = grid[y][x];
    

    // check what tile type was clicked e.g. "WALL"
    if (clickType == null) {
        if (gridCell.isWall) clickType = "wall";
        else clickType = "clear";
    }

    // check for overwriting the start and end cell
    if (gridCell.isStart || gridCell.isEnd) return;

    // toggle the wall
    if (gridCell.isWall && clickType == "wall" || !gridCell.isWall && clickType == "clear")
        gridCell.toggleWall();

}


// set the startCell to x, y 
export function setStartCell(grid : Cell[][], x : number, y : number) : Cell{
    grid[y][x].isStart = true;
    grid[y][x].div?.setAttribute("id", "start");
    startCell = grid[y][x];
    return grid[y][x];
}

// set the endCell to x, y
export function setEndCell(grid : Cell[][], x : number, y : number) : Cell {
    grid[y][x].isEnd = true;
    grid[y][x].div?.setAttribute("id", "end");
    endCell = grid[y][x];
    return grid[y][x];
}


// calculate the path from the endCell
export function getPath(lastCell : Nullable<Cell>) {
    if (lastCell == null) {
        alert("No solution found!")
        return;
    }

    let path : Cell[] = [];

    // loop through every cell and add it to the array
    while(lastCell.previous != null) {
        path.push(lastCell);
        lastCell = lastCell.previous;
    }
    // reverse the array
    path.reverse();

    animatePath(path);
}


// animates the path from start to end
async function animatePath(path : Cell[]) {
    document.getElementById("current")?.removeAttribute("id");

    for(let i = 0; i < path.length; i++) {
        await sleep(1);
        path[i].div?.classList.replace("grid-cell-explored", "grid-cell-path");
    }

    document.getElementById("start-btn")!.style.display = "inline";
    document.getElementById("stop-btn")!.style.display = "none";
    stop = false;
}

// stop the functions
function setStop() {
    stop = true;
}


// wait for x ms
export function sleep(ms : number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}


init();