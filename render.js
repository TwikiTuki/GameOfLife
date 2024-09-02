import CellsInfoList, { AliveCell } from "./storage.js";// strg from "./storage.js";
import * as myModule from "/storage.js";
//import * as myModule from "/modules/my-module.js";
import defaultExport from "./storage.js"

myModule.hello();
let inf = new CellsInfoList()
let cll = inf.bringToLife(3,4)
console.log(cll)

cll = new AliveCell(4,5);
console.log(cll)
console.log("sdaaaaaaaaaf", cll ,cll.row, cll.col)

class Printer
{
    constructor() {}
    static cellWidth = 10
    static cellHeight = 10

    createWorld()
    {
        console.log("Creating world")
        let world_wrapper = document.querySelector("#world_wrapper")
        let world = document.querySelector("#world")
        if (world !== null)
            world.remove()
        world = document.createElement("table")
        world.id = "world"
        this.cellsX = world_wrapper.clientWidth / Printer.cellWidth;
        this.cellsY = world_wrapper.clientHeight / Printer.cellHeight;
        this.cellsX = Math.floor(this.cellsX)
        this.cellsY = Math.floor(this.cellsY)

        console.log("cellsX", this.cellsX, "cellsY", this.cellsY)
        let cells_matrix = []
        for (let rowNum = 0; rowNum < this.cellsY; rowNum++)
        {
            let row = document.createElement("tr")
            cells_matrix.push([])
            for ( let colNum = 0; colNum < this.cellsX; colNum++)
            {
                let cell = document.createElement("td")
                cell.width = Printer.cellWidth
                cell.height = Printer.cellHeight
                cell.classList.add("cell")
                if (rowNum == this.cellsY -1 || colNum == this.cellsX -1)
                    cell.classList.add("last")
                row.appendChild(cell)
                cells_matrix[rowNum].push(cell)
            }
            world.appendChild(row)
        }
        document.querySelector("#world_wrapper").appendChild(world)
    }
}


let printer = new Printer();
document.addEventListener("DOMContentLoaded", (event)=>{
    console.log("dom content loadedddddddd")
        printer.createWorld();
})

window.addEventListener("resize", (event) => {
    console.log("resized")
    printer.createWorld();
})