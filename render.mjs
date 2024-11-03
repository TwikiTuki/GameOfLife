import { Cell, CellPopulation } from "./storage.mjs";// strg from "./storage.js";
import { MyTime } from "./MyTime.mjs";// strg from "./storage.js";
//import * as myModule from "/storage.mjs";
//import defaultExport from "./storage.mjs"
	let PAUSED=true

function sleep(ms)
{
	return new Promise (resolve => setTimeout(resolve, ms));
}

export class Point
{
	constructor(x, y)
	{
		this.x = x
		this.y = y
	}
		
	getX () { return this.x }
	getY () { return this.y }
	setX () { return this.x }
	setY () { return this.y }
}

class Printer
{
	static CELL_CSS_CLASSES = {
		alive : "alive_cell",
		dead : "dead_cell",
		cell : "cell"
	}

    static cellWidth = 10
    static cellHeight = 10

    constructor()
	{
		this.cellsX = null
		this.cellsY = null
		this.cellsMatrix = null
		this.center = new Point(0, 0)
		this.population = new CellPopulation() // TODO useless ??? maybe can be deleted
	}

    createWorld(render)
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
        this.cellsMatrix = []
        for (let rowNum = 0; rowNum < this.cellsY; rowNum++)
        {
            let row = document.createElement("tr")
            this.cellsMatrix.push([])
            for ( let colNum = 0; colNum < this.cellsX; colNum++)
            {
                let cell = document.createElement("td")
                cell.width = Printer.cellWidth
                cell.height = Printer.cellHeight
                cell.classList.add(Printer.CELL_CSS_CLASSES.cell)
                cell.classList.add(Printer.CELL_CSS_CLASSES.dead)
                if (rowNum == this.cellsY -1 || colNum == this.cellsX -1 || rowNum == 0 || colNum == 0)
                    cell.classList.add("last")
                row.appendChild(cell)
				cell.addEventListener("click", (event) => { // TODO make it cleaner
					let row_start = this.center.getY() - Math.floor(this.cellsY / 2)
					let col_start = this.center.getX() - Math.floor(this.cellsX / 2)
					console.log(rowNum , row_start, colNum , col_start);
					render.getPopulation().switchCellAlive(rowNum +row_start, colNum + col_start);	
				})
                this.cellsMatrix[rowNum].push(cell)
            }
            world.appendChild(row)
        }
        document.querySelector("#world_wrapper").appendChild(world) //TODO already have the variable
    }

	setCellLiveClasses (cell, clss)
	{
		if (! clss in Printer.CELL_CSS_CLASSES) // TODO refactor should only allow dead_cell or alive_cell classes
		{
			console.log("Setting invalid CSS cell class")
			return;
		}
		cell.classList.remove(Printer.CELL_CSS_CLASSES.alive)
		cell.classList.remove(Printer.CELL_CSS_CLASSES.dead)
		cell.classList.add(clss)
	}
	
	paintCells(population)
	{
        let world_wrapper = document.querySelector("#world_wrapper")
		world_wrapper.display="hidden"
		let row_start = this.center.getY() - Math.floor(this.cellsY / 2)
		let col_start = this.center.getX() - Math.floor(this.cellsX / 2)
		let row_end = row_start + this.cellsY
		let col_end = col_start + this.cellsX
		this.population = population
        for (let row_num = 0; row_num < this.cellsY; row_num++)
        {
            for (let col_num = 0; col_num < this.cellsX; col_num++)
			{
				let cell = this.cellsMatrix[row_num][col_num]
				if (population.isAlive(row_num + row_start, col_num + col_start))
					this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.alive)
				else
					this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.dead)
			}
		}
		this.population = population
		world_wrapper.display="block"
	}
}


class Render
{
	constructor()
	{
		this.printer = new Printer();
		console.log("Printer:::::: " , this.printer)
		this.population = new CellPopulation();
		for (let rw = 0; rw < 500; rw++)
		{
			for (let cl = 0; cl < 500; cl++)
			{
				this.population.bringToLife(rw, cl)
			}
		}
		this.events();
	}
	
	getPopulation()
	{
		return this.population
	}

	static async nextGeneration(render) // This will be passed to setInterval. If i pass the method as no static this get overriden and references to Window instead of Render. So making it static makes more sense
	{
		if (!PAUSED)
		{
		//	MyTime.nextGen.recordStart()
			console.log(">>>> NextGeneration", PAUSED)
			console.log(render)
			console.log(render.poulation)
			render.population = render.population.nextGeneration();
		//	MyTime.nextGen.recordEnd()
		}
		//MyTime.nextGen.recordLoop()
		//MyTime.nextGen.newReport()
	}

	static async paintCells (render) // This will be passed to setInterval. If i pass the method as no static this get overriden and references to Window instead of Render. So making it static makes more sense
	{
		//MyTime.paintCells.recordStart()
		render.printer.paintCells(render.population);
		//MyTime.paintCells.recordEnd()
		//MyTime.nextGen.recordLoop()
		//MyTime.paintCells.newReport()
	}

	events()
	{
		document.addEventListener("DOMContentLoaded", (event)=>{
			console.log("dom content loadedddddddd")
				this.printer.createWorld(this);
			this.printer.paintCells(this.population)
			//display();

			//setInterval(display, 1000);
			//MyTime.nextGeneration.recordStart()
			setInterval(Render.nextGeneration, 1000, this);
			//MyTime.paintCells.recordStart()
			setInterval(Render.paintCells, 100, this);
		})

		window.addEventListener("resize", (event) => {
			console.log("resized")
			this.printer.createWorld(this);
			this.printer.paintCells(this.population)
		})

		document.querySelector("#world_wrapper").addEventListener("keydown", (envent) => {
			console.log("key pressed: ", event)
			if (event.keyCode == 37)
			{
				console.log("left")
				this.printer.center.x -= 5
			}
			else if (event.keyCode == 38)
			{
				console.log("upp")
				this.printer.center.y -= 5
			}
			else if (event.keyCode == 39)
			{
				console.log("right")
				this.printer.center.x += 5
			}
			else if (event.keyCode == 40)
			{
				console.log("down")
				this.printer.center.y += 5
			}
			else if (event.keyCode == 32)
			{
				console.log("space")
				PAUSED = !PAUSED
			}
		});
	}
}

let render = new Render()
