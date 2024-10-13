
export class Cell
{
    constructor(row, col, alive)
    {
		if (row == null)
		{
			console.log("mdfk has creat una row sense especificar row", row)
			row = 0;
		}
		if (col == null)
		{
			console.log("mdfk has creat una row sense especificar col", col)
			col = 0;
		}

        this.alive = alive === undefined ? true : Boolean(alive)
        this.row = row;
        this.col = col;
    }

	clone()
	{
		let cell = new Cell(this.row, this.col, this.alive);
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

        let cell = new Cell(row, col, true)
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
    //    if (this.cells[[cell.row, cell.col]] != null)
    //       return 
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
				for (let r = cell.row -1; r <= cell.row +1; r++)
				{
					for (let c = cell.col -1; c <= cell.col + 1; c++)
					{
						//let nwcell = this.getCell(r, c) == null ? new Cell(r, c, false) : this.getCell(r, c).clone()
						let nwcell = new Cell(r, c, false);
						next_generation.insertCell(nwcell)
					}
				}
			}
		})
		Object.values(next_generation.cells).forEach(cell => {
			if (this.shouldLive(cell.row, cell.col))
			{
				
				next_generation.bringToLife(cell.row, cell.col);
			}
			else
			{
				next_generation.kill(cell.row, cell.col);
			}
		})
		return next_generation
	}
}
