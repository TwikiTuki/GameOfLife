import  CellPopulation, {Cell}  from "../storage.mjs"
//import  {CellPopulation, Cell}  from "../storages.js"
console.log("TEST_STORAGE !!!")

let info = new CellPopulation()
info.bringToLife(0, 0)
let cll = info.getCell(0, 0)
console.log(cll, cll.row, cll.col)

let coords = [[0,0], [1,0], [0,1], [-1,0], [0,-1], [-42,0], [0,630], [420,630], [-420,630], [-420,-630]]

function assertLength(expected)
{
    if (info.length !== expected)
        console.log("KO: invalid length " + info.length + ". Expected: " + expected)
    else 
        console.log("OK: len")
}

function test_bringToLife()
{
    for (let i = 0; i < coords.length; i++)
    {
        let row = coords[i][0]
        let col = coords[i][1]
        info.bringToLife(row, col)
    }
    assertLength(coords.length);
}

function test_kill()
{
    for (let i = 0; i < coords.length; i++)
    {
        let row = coords[i][0]
        let col = coords[i][1]
        info.kill(row, col)
    }
    assertLength(0);
}

function test_insertCell(cell)
{
    for (let i = 0; i < coords.length; i++)
    {
        let row = coords[i][0]
        let col = coords[i][1]
        let cell = new Cell(row, col)
        info.insertCell(cell)
    }
    assertLength(coords.length);
}

function test_deleteCell(cell)
{
    for (let i = 0; i < coords.length; i++)
    {
        let row = coords[i][0]
        let col = coords[i][1]
        let cell = new Cell(row, col)
        info.deleteCell(cell)
    }
    assertLength(0);
}

function assertAlive()
{
    for (let i = 0; i < coords.length; i++)
    {
        let row = coords[i][0]
        let col = coords[i][1]
        let cell = info.getCell(row, col)
        if (cell === undefined)
            console.log("KO: Expected cell to be alive " + row + ", " + col)
        else if (cell.row != row || cell.col != col)
            console.log("KO: invalid row an cell properties on cell " + row + "," + col + ". Got: " + cell.row + "," + cell.col)
        else
            console.log("OK: " + row + ", " + col)
    }
}

function assertDead()
{
    for (let i = 0; i < coords.length; i++)
    {
        let row = coords[i][0]
        let col = coords[i][1]
        let cell = info.getCell(row, col)
        if (cell !== undefined)
            console.log("KO: Expected cell to be alive " + row + ", " + col)
        else
            console.log("OK: " + row + ", " + col)
    }
}

function test_isAlive()
{
    let alive0 = new Cell(0,0)
    let alive1 = new Cell(1,1, true)
    let dead0 = new Cell(2,2, false)
    let inf = new CellPopulation()

    inf.insertCell(alive0)
    inf.insertCell(alive1)
    inf.insertCell(dead0)
    function check(row, col, expected)
    {
        if (inf.isAlive(row, col) !== expected)
            console.log("KO (" + row + "," + col + "): expected " + expected + " got " + inf.isAlive(row, col))
        else
            console.log("OK (" + row + "," + col + "):")
    }
    check(0,0, true)
    check(1,1, true)
    check(2,2, false)
    check(20,20, false)
}

console.log(); console.log("test isAlive")
test_isAlive()
console.log(); console.log("test bringToLife")
test_bringToLife()
console.log(); console.log("Asserting all alive")
assertAlive()
console.log(); console.log("test kill")
test_kill()
console.log(); console.log("Asserting all dead")
assertDead()
console.log(); console.log("test insertCell")
test_insertCell()
console.log(); console.log("Asserting all alive")
assertAlive()
console.log(); console.log("test deleteCell")
test_deleteCell()
console.log(); console.log("Asserting all dead")
assertDead()

console.log(); console.log("Testing with repeated values and kill first")
test_bringToLife()
test_insertCell()
test_bringToLife()
test_insertCell()
assertAlive()
test_kill()
test_kill()
test_deleteCell()
test_deleteCell()

console.log(); console.log("Testing with repeated values and deleteCell first")
test_insertCell()
test_bringToLife()
test_insertCell()
test_bringToLife()
assertAlive()
test_deleteCell()
test_deleteCell()
test_kill()
test_kill()