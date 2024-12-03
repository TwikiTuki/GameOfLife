var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CellPopulation } from "./storage.mjs";
let PAUSED = true;
export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    getX() { return this.x; }
    getY() { return this.y; }
    setX() { return this.x; }
    setY() { return this.y; }
}
class Printer {
    worldCoordToPrinter(coord) {
        let nw_coord = new Point(coord.x, coord.y);
        nw_coord.x += this.center.getX() + Math.floor(this.width / 2);
        nw_coord.y += this.center.getY() + Math.floor(this.height / 2);
        return nw_coord;
    }
    printerCoordToWorld(coord) {
        let nw_coord = new Point(coord.x, coord.y);
        nw_coord.x += this.center.getX() - Math.floor(this.width / 2);
        nw_coord.y += this.center.getY() - Math.floor(this.height / 2);
        return nw_coord;
    }
    constructor() {
        this.center = new Point(0, 0);
        this.width = null;
        this.height = null;
        this.cellsMatrix = null;
        this.center = new Point(0, 0);
    }
    setSize() {
        //let world_wrapper: HTMLElement; // TODO this was not here?? 
        //world_wrapper: HTMLElement; // TODO this was not here?? 
        // @ts-ignore  //TODO do not ignore
        this.width = world_wrapper.clientWidth / Printer.cellWidth;
        // @ts-ignore  //TODO do not ignore
        this.height = world_wrapper.clientHeight / Printer.cellHeight;
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
    }
    createWorld(render) {
        let world = document.querySelector("#world");
        if (world !== null)
            world.remove();
        world = document.createElement("table");
        world.id = "world";
        this.setSize();
        this.cellsMatrix = [];
        for (let rowNum = 0; rowNum < this.height; rowNum++) {
            let row = document.createElement("tr");
            this.cellsMatrix.push([]);
            for (let colNum = 0; colNum < this.width; colNum++) {
                let cell = document.createElement("td");
                cell.width = Printer.cellWidth.toString(); // TODO it was not changed to string
                cell.height = Printer.cellHeight.toString(); // TODO it was not changed to string
                cell.classList.add(Printer.CELL_CSS_CLASSES.cell);
                cell.classList.add(Printer.CELL_CSS_CLASSES.dead);
                if (rowNum == this.height - 1 || colNum == this.width - 1 || rowNum == 0 || colNum == 0)
                    cell.classList.add("last");
                row.appendChild(cell);
                cell.addEventListener("click", (event) => {
                    let cll = this.printerCoordToWorld(new Point(colNum, rowNum));
                    let rw = cll.y;
                    let cl = cll.x;
                    render.getPopulation().switchCellAlive(rw, cl);
                });
                this.cellsMatrix[rowNum].push(cell);
            }
            world.appendChild(row);
        }
        document.querySelector("#world_wrapper").appendChild(world); //TODO already have the variable
    }
    setCellLiveClasses(cell, clss) {
        //if (! clss in Printer.CELL_CSS_CLASSES) // TODO REACTIVATE, TODO refactor should only allow dead_cell or alive_cell classes
        //{
        //	return;
        //}
        cell.classList.remove(Printer.CELL_CSS_CLASSES.alive);
        cell.classList.remove(Printer.CELL_CSS_CLASSES.dead);
        cell.classList.add(clss);
    }
    paintCells(population) {
        let world_wrapper = document.querySelector("#world_wrapper");
        world_wrapper.style.display = "hidden"; //TODO added style
        let row_start = this.center.getY() - Math.floor(this.height / 2);
        let col_start = this.center.getX() - Math.floor(this.width / 2);
        let row_end = row_start + this.height;
        let col_end = col_start + this.width;
        this.population = population;
        for (let row_num = 0; row_num < this.height; row_num++) {
            for (let col_num = 0; col_num < this.width; col_num++) {
                let cell = this.cellsMatrix[row_num][col_num];
                if (population.isAlive(row_num + row_start, col_num + col_start))
                    this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.alive);
                else
                    this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.dead);
            }
        }
        this.population = population;
        world_wrapper.style.display = "block"; //TODO added style
    }
}
Printer.CELL_CSS_CLASSES = {
    alive: "alive_cell",
    dead: "dead_cell",
    cell: "cell"
};
Printer.cellWidth = 10;
Printer.cellHeight = 10;
class Render {
    constructor() {
        this.printer = new Printer();
        this.printer.setSize();
        this.population = new CellPopulation();
        let margin = 10;
        let start = new Point(((0 - this.printer.width / 2)) + margin, Math.floor((0 - this.printer.height / 2)) + margin);
        let end = new Point(((this.printer.width / 2)) - margin, Math.floor((this.printer.height / 2)) - margin);
        for (let rw = start.y; rw < end.y; rw++) {
            for (let cl = start.x; cl < end.x; cl++) {
                this.population.bringToLife(rw, cl);
            }
        }
        this.events();
    }
    getPopulation() {
        return this.population;
    }
    static nextGeneration(render) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!PAUSED) {
                render.population = render.population.nextGeneration();
            }
        });
    }
    static paintCells(render) {
        return __awaiter(this, void 0, void 0, function* () {
            render.printer.paintCells(render.population);
        });
    }
    events() {
        document.addEventListener("DOMContentLoaded", (event) => {
            console.log("dom content loaded");
            this.printer.createWorld(this);
            this.printer.paintCells(this.population);
            setInterval(Render.nextGeneration, 1000, this);
            setInterval(Render.paintCells, 100, this);
            document.querySelector(".tools form").addEventListener("submit", (event) => {
                event.preventDefault();
                let x = parseInt(event.target.querySelector('input[name="x"]').value);
                let y = parseInt(event.target.querySelector('input[name="y"]').value);
                if (!isNaN(x))
                    this.printer.center.x = x;
                if (!isNaN(y))
                    this.printer.center.y = y;
            });
            document.querySelector(".tools .clear").addEventListener("click", (event) => {
                this.population = new CellPopulation();
            });
        });
        window.addEventListener("resize", (event) => {
            this.printer.createWorld(this);
            this.printer.paintCells(this.population);
        });
        document.querySelector("#world_wrapper").addEventListener("keydown", (event) => {
            if (document.activeElement.id != "world_wrapper")
                return;
            if (event.keyCode == 37) {
                console.log("left");
                this.printer.center.x -= 5;
            }
            else if (event.keyCode == 38) {
                console.log("upp");
                this.printer.center.y -= 5;
            }
            else if (event.keyCode == 39) {
                console.log("right");
                this.printer.center.x += 5;
            }
            else if (event.keyCode == 40) {
                console.log("down");
                this.printer.center.y += 5;
            }
            else if (event.keyCode == 32) {
                console.log("space");
                PAUSED = !PAUSED;
                let tools = document.querySelector(".tools");
                if (PAUSED) {
                    tools.classList.add("force_visible");
                }
                else {
                    tools.classList.remove("force_visible");
                }
            }
        });
    }
}
let render = new Render();
