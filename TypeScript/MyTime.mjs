"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyTime = exports.MyTimeData = void 0;
console.log("time");
var MyTimeData = /** @class */ (function () {
    function MyTimeData(name) {
        this.MAX = 10;
        this.i = this.MAX - 1;
        this.name = name;
        this.history = [];
        this.start = null;
        this.end = null;
        this.diff = null;
    }
    MyTimeData.prototype.recordStart = function () {
        this.start = Date.now();
    };
    MyTimeData.prototype.recordEnd = function () {
        this.end = Date.now();
    };
    MyTimeData.prototype.recordLoop = function () {
        this.start = this.end;
        this.end = Date.now();
    };
    MyTimeData.prototype.saveInfo = function () {
        this.i = (this.i + 1) % this.MAX;
        this.diff = this.end - this.start;
        this.history[this.i] = this.diff;
        this.avrg = 0;
        for (var i = 0; i < this.MAX; i++) {
            this.avrg += this.history[i];
        }
        this.avrg = this.avrg / this.MAX;
    };
    MyTimeData.prototype.strInfo = function () {
        var str = "".concat(this.name, ": \n");
        str += "".concat(this.history[this.i], " ").concat(this.history[this.i] / 1000, "\n");
        str += "diff: ".concat(this.diff, " \t  ").concat(this.diff / 1000, " \n");
        str += "avrg: ".concat(this.avrg, " \t  ").concat((this.avrg / 1000).toFixed(2), " \n");
        str += "var: ".concat((this.avrg - this.diff).toFixed(2), " \t ").concat(((this.avrg - this.diff) / 1000).toFixed(2), " \n");
        str += "\n";
        return (str);
    };
    MyTimeData.prototype.printInfo = function () {
        console.log(this.strInfo());
    };
    MyTimeData.prototype.newReport = function () {
        this.saveInfo();
        this.printInfo();
    };
    return MyTimeData;
}());
exports.MyTimeData = MyTimeData;
var MyTime = /** @class */ (function () {
    function MyTime() {
    }
    MyTime.newReport = function () {
        //MyTime.display.newReport()
        MyTime.nextGen.newReport();
        MyTime.paintCells.newReport();
        //MyTime.toCheck.newReport()
        //MyTime.nextGenOwn.newReport()
    };
    MyTime.display = new MyTimeData("display");
    MyTime.nextGen = new MyTimeData("nextGen");
    MyTime.paintCells = new MyTimeData("paintCells");
    MyTime.toCheck = new MyTimeData("nextGeneration toCheck");
    MyTime.nextGenOwn = new MyTimeData("nextGeneration nextGenOwn");
    return MyTime;
}());
exports.MyTime = MyTime;
