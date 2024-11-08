console.log("time")
export class MyTimeData
{
	constructor(name)
	{
		this.MAX = 10
		this.i = this.MAX - 1

		this.name = name
		this.history = []
		this.start = null
		this.end = null
		this.diff = null
	}

	recordStart()
	{
		this.start = Date.now() 
	}
	
	recordEnd()
	{
		this.end = Date.now() 
	}
	
	recordLoop()
	{
		this.start = this.end
		this.end = Date.now()
	}

	saveInfo()
	{
		this.i = (this.i + 1) % this.MAX
		this.diff = this.end - this.start
		this.history[this.i] = this.diff
		this.avrg = 0
		for (let i = 0; i < this.MAX; i++)
		{
			this.avrg +=  this.history[i]
		}
		this.avrg = this.avrg / this.MAX
	}
		
	strInfo()
	{
		let str = `${this.name}: \n`	
		str += `${this.history[this.i]} ${this.history[this.i] / 1000}\n`	
		str += `diff: ${this.diff} \t  ${this.diff / 1000} \n`
		str += `avrg: ${this.avrg} \t  ${(this.avrg / 1000).toFixed(2)} \n`
		str += `var: ${(this.avrg - this.diff).toFixed(2)} \t ${((this.avrg - this.diff) / 1000).toFixed(2)} \n`
		str += `\n`
		return (str)
	}

	printInfo()
	{
		console.log(this.strInfo())
	}
	
	newReport()
	{
		this.saveInfo()
		this.printInfo()
	}
}

export class MyTime
{
	static display = new MyTimeData("display")
	static nextGen = new MyTimeData("nextGen")
	static paintCells = new MyTimeData("paintCells")
	static toCheck = new MyTimeData("nextGeneration toCheck")
	static nextGenOwn = new MyTimeData("nextGeneration nextGenOwn")

	static newReport()
	{
		//MyTime.display.newReport()
		MyTime.nextGen.newReport()
		MyTime.paintCells.newReport()
		//MyTime.toCheck.newReport()
		//MyTime.nextGenOwn.newReport()
	}
}
