import { Cell, CellPopulation } from "./storage.mjs";
import { MyTime } from "./MyTime.mjs";
	let PAUSED=true

export class Point
{
	x:number;
	y:number;
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
	width: number;
	height: number;
	cellsMatrix: HTMLElement[][];
	center: Point = new Point(0, 0);
	population: CellPopulation;

	static CELL_CSS_CLASSES = {
		alive : "alive_cell",
		dead : "dead_cell",
		cell : "cell"
	}

	static cellWidth = 10
	static cellHeight = 10
		
	worldCoordToPrinter(coord)
	{
		let nw_coord = new Point(coord.x, coord.y)
		nw_coord.x +=  this.center.getX() + Math.floor(this.width / 2) 
		nw_coord.y +=  this.center.getY() + Math.floor(this.height / 2)
		return nw_coord;
	}

	printerCoordToWorld(coord)
	{
		let nw_coord = new Point(coord.x, coord.y)
		nw_coord.x +=  this.center.getX() - Math.floor(this.width / 2) 
		nw_coord.y +=  this.center.getY() - Math.floor(this.height / 2)
		return nw_coord;
	}

    constructor()
	{
		this.width = null
		this.height = null
		this.cellsMatrix = null
		this.center = new Point(0, 0)
	}

	setSize()
	{
		//let world_wrapper: HTMLElement; // TODO this was not here?? 
		//world_wrapper: HTMLElement; // TODO this was not here?? 
		// @ts-ignore  //TODO do not ignore
		this.width = world_wrapper.clientWidth / Printer.cellWidth;
		// @ts-ignore  //TODO do not ignore
		this.height = world_wrapper.clientHeight / Printer.cellHeight;
		this.width = Math.floor(this.width)
		this.height = Math.floor(this.height)
	}

	createWorld(render)
	{
		let world = document.querySelector("#world") 
		if (world !== null)
				world.remove()
		world = document.createElement("table")
		world.id = "world"
		this.setSize()
		this.cellsMatrix = []
		for (let rowNum = 0; rowNum < this.height; rowNum++)
		{
			let row = document.createElement("tr")
			this.cellsMatrix.push([])
			for ( let colNum = 0; colNum < this.width; colNum++)
			{
				let cell = document.createElement("td")
				cell.width = Printer.cellWidth.toString() // TODO it was not changed to string
				cell.height = Printer.cellHeight.toString() // TODO it was not changed to string
				cell.classList.add(Printer.CELL_CSS_CLASSES.cell)
				cell.classList.add(Printer.CELL_CSS_CLASSES.dead)
				if (rowNum == this.height -1 || colNum == this.width -1 || rowNum == 0 || colNum == 0)
						cell.classList.add("last")
				row.appendChild(cell)
				cell.addEventListener("click", (event) => { 
					let cll = this.printerCoordToWorld(new Point(colNum, rowNum));
					let rw = cll.y
					let cl = cll.x
					render.getPopulation().switchCellAlive(rw, cl);	
				})
				this.cellsMatrix[rowNum].push(cell)
			}
			world.appendChild(row)
		}
	document.querySelector("#world_wrapper").appendChild(world) //TODO already have the variable
}

	setCellLiveClasses (cell, clss)
	{
		//if (! clss in Printer.CELL_CSS_CLASSES) // TODO REACTIVATE, TODO refactor should only allow dead_cell or alive_cell classes
		//{
		//	return;
		//}
		cell.classList.remove(Printer.CELL_CSS_CLASSES.alive)
		cell.classList.remove(Printer.CELL_CSS_CLASSES.dead)
		cell.classList.add(clss)
	}
	
	paintCells(population)
	{
		let world_wrapper: HTMLElement = document.querySelector("#world_wrapper");
		world_wrapper.style.display="hidden" //TODO added style
		let row_start = this.center.getY() - Math.floor(this.height / 2)
		let col_start = this.center.getX() - Math.floor(this.width / 2)
		let row_end = row_start + this.height
		let col_end = col_start + this.width
		this.population = population
		for (let row_num = 0; row_num < this.height; row_num++)
		{
			for (let col_num = 0; col_num < this.width; col_num++)
			{
				let cell = this.cellsMatrix[row_num][col_num]
				if (population.isAlive(row_num + row_start, col_num + col_start))
					this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.alive)
				else
					this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.dead)
			}
		}
		this.population = population
		world_wrapper.style.display="block" //TODO added style
	}
}

class Render
{
	printer: Printer;
	population: CellPopulation;
	constructor()
	{
		this.printer = new Printer();
		this.printer.setSize();
		this.population = new CellPopulation();
		let margin = 10
		let start = new Point(((0 - this.printer.width / 2)) + margin, Math.floor((0 - this.printer.height / 2)) + margin)
		let end = new Point(((this.printer.width / 2)) - margin, Math.floor((this.printer.height / 2)) - margin)
		for (let rw = start.y; rw < end.y; rw++)
		{
			for (let cl = start.x; cl < end.x; cl++)
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

	static async nextGeneration(render) // This will be passed to setInterval. If I pass the method as no static "this" get overriden and references to Window instead of Render. So making it static makes more sense
	{
		if (!PAUSED)
		{
			render.population = render.population.nextGeneration();
		}
	}

	static async paintCells (render) // This will be passed to setInterval. If i pass the method as no static "this" get overriden and references to Window instead of Render. So making it static makes more sense
	{
		render.printer.paintCells(render.population);
	}

	events()
	{
		document.addEventListener("DOMContentLoaded", (event)=>{
			console.log("dom content loaded")
			this.printer.createWorld(this);
			this.printer.paintCells(this.population)
			setInterval(Render.nextGeneration, 1000, this);
			setInterval(Render.paintCells, 100, this);

			document.querySelector(".tools form").addEventListener("submit", (event:SubmitEvent) => {
				event.preventDefault();
				let x = parseInt(((event.target as HTMLElement).querySelector('input[name="x"]') as HTMLInputElement).value);
				let y = parseInt(((event.target as HTMLElement).querySelector('input[name="y"]') as HTMLInputElement).value);
				if (!isNaN(x))
					this.printer.center.x = x
				if (!isNaN(y))
					this.printer.center.y = y
			});
			document.querySelector(".tools .clear").addEventListener("click", (event) => {
				this.population = new CellPopulation();
			});
		})

		window.addEventListener("resize", (event) => {
			this.printer.createWorld(this);
			this.printer.paintCells(this.population);
		})

		document.querySelector("#world_wrapper").addEventListener("keydown", (event:KeyboardEvent) => {//TODO dont use void
			if (document.activeElement.id != "world_wrapper")
				return
			if (event.keyCode == 37)
			{
				console.log("left")
				this.printer.center.x -= 5
			}
			else if (event.keyCode == 38)
			{
				console.log("upp");
				this.printer.center.y -= 5;
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
				let tools = document.querySelector(".tools")
				if (PAUSED)
				{
					tools.classList.add("force_visible")
				}
				else
				{
					tools.classList.remove("force_visible")
				}
			}
		});
	}
}

let render = new Render()
