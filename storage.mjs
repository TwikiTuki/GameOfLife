
export class Cell
{
    constructor(row, col, alive)
    {
        this.alive = alive === undefined ? true : Boolean(alive)
        this.row = row;
        this.col = col;
    }

	clone()
	{
		let cell = new Cell();
		cell.alive = this.alive;
		cell.row = this.row;
		cell.col = this.col;
		return cell
	}
}

export class CellPopulation
{
    constructor()
    {
        this.cells = {}
        this.length = 0
    }

    bringToLife(row, col)
    {
        if (this.isAlive(row, col))
            return 
        let cell = new Cell(row, col)
        this.insertCell(cell)
        return (cell)
    }

    kill(row, col)
    {
        if (!this.isAlive(row, col))
            return 
        let cell = new Cell(row, col)
		cell.alive = false
        this.deleteCell(cell)
    }

    insertCell (cell)
    {
        if (this.cells[[cell.row, cell.col]] != null)
            return 
        this.cells[[cell.row, cell.col]] = cell   
        this.length++
    }

    deleteCell(cell)
    {
        if (!this.cells[[cell.row, cell.col]] == null)
            return 
        delete this.cells[[cell.row, cell.col]]
        this.length--
    }

    getCell(row, col)
    {
        return this.cells[[row, col]]
    }

    isAlive(row, col)
    {
//		console.log("alive?", row, col)
        let cell = this.getCell(row, col)
        return ( cell != null && cell.alive)
    }
		
	shouldLive(row, col)
	{
		let count = 0;

		for (let r = -1; r <= 1; r++)
		{
			for (let c = -1; c <= 1; c++)
			{
				//console.log(row + r, col + c)
				if (r == 0 && c == 0)
					continue;
				if (this.isAlive(row + r, col + c))
				{
					count++;	
				}
			}
		}
		return count == 3 || (count == 2 && this.isAlive(row,col))
	}
	
	nextGeneration()
	{
		let next_generation = new CellPopulation();
		
		Object.values(this.cells).forEach(cell => {
			if (this.isAlive(cell.row, cell.col))
			{
				for (let r = -1; r <= 1; r++)
				{
					for (let c = -1; c <= 1; c++)
					{
						cell = this.getCell(r, c) == null ? new Cell(r, c, false) : this.getCell(r, c).clone()
						next_generation.insertCell(cell)
					}
				}
			}
		})
		Object.values(next_generation.cells).forEach(cell => {
			if (this.shouldLive(cell.row, cell.col))
			{
//				console.log("should live ", cell.row, cell.col)
				next_generation.bringToLife(cell.row, cell.col);
//				console.log("alive", cell.row, cell.col);
			}
			else
			{
//				console.log("shouldnt live ", cell.row, cell.col)
				next_generation.kill(cell.row, cell.col);
				next_generation.deleteCell(cell);
//				console.log("dead", cell.row, cell.col);
			}
		})
		return next_generation
	}
}
