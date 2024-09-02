
export class Cell
{
    constructor(row, col, alive)
    {
        this.alive = alive === undefined ? true : Boolean(alive)
        this.row = row;
        this.col = col;
    }
}

export default class CellPopulation
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
        this.deleteCell(cell)
    }

    insertCell (cell)
    {
        if (this.isAlive(cell.row, cell.col))
            return 
        this.cells[[cell.row, cell.col]] = cell   
        this.length++
    }

    deleteCell(cell)
    {
        if (!this.isAlive(cell.row, cell.col))
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
        return ( cell !== undefined && cell.alive)
    }
}