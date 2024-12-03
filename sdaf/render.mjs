"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Point = void 0;
var storage_mjs_1 = require("./storage.mjs");
var PAUSED = true;
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    Point.prototype.getX = function () { return this.x; };
    Point.prototype.getY = function () { return this.y; };
    Point.prototype.setX = function () { return this.x; };
    Point.prototype.setY = function () { return this.y; };
    return Point;
}());
exports.Point = Point;
var Printer = /** @class */ (function () {
    function Printer() {
        this.center = new Point(0, 0);
        this.width = null;
        this.height = null;
        this.cellsMatrix = null;
        this.center = new Point(0, 0);
    }
    Printer.prototype.worldCoordToPrinter = function (coord) {
        var nw_coord = new Point(coord.x, coord.y);
        nw_coord.x += this.center.getX() + Math.floor(this.width / 2);
        nw_coord.y += this.center.getY() + Math.floor(this.height / 2);
        return nw_coord;
    };
    Printer.prototype.printerCoordToWorld = function (coord) {
        var nw_coord = new Point(coord.x, coord.y);
        nw_coord.x += this.center.getX() - Math.floor(this.width / 2);
        nw_coord.y += this.center.getY() - Math.floor(this.height / 2);
        return nw_coord;
    };
    Printer.prototype.setSize = function () {
        var world_wrapper; // TODO this was not here?? 
        this.width = world_wrapper.clientWidth / Printer.cellWidth;
        this.height = world_wrapper.clientHeight / Printer.cellHeight;
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
    };
    Printer.prototype.createWorld = function (render) {
        var _this = this;
        var world = document.querySelector("#world");
        if (world !== null)
            world.remove();
        world = document.createElement("table");
        world.id = "world";
        this.setSize();
        this.cellsMatrix = [];
        var _loop_1 = function (rowNum) {
            var row = document.createElement("tr");
            this_1.cellsMatrix.push([]);
            var _loop_2 = function (colNum) {
                var cell = document.createElement("td");
                cell.width = Printer.cellWidth.toString(); // TODO it was not changed to string
                cell.height = Printer.cellHeight.toString(); // TODO it was not changed to string
                cell.classList.add(Printer.CELL_CSS_CLASSES.cell);
                cell.classList.add(Printer.CELL_CSS_CLASSES.dead);
                if (rowNum == this_1.height - 1 || colNum == this_1.width - 1 || rowNum == 0 || colNum == 0)
                    cell.classList.add("last");
                row.appendChild(cell);
                cell.addEventListener("click", function (event) {
                    var cll = _this.printerCoordToWorld(new Point(colNum, rowNum));
                    var rw = cll.y;
                    var cl = cll.x;
                    render.getPopulation().switchCellAlive(rw, cl);
                });
                this_1.cellsMatrix[rowNum].push(cell);
            };
            for (var colNum = 0; colNum < this_1.width; colNum++) {
                _loop_2(colNum);
            }
            world.appendChild(row);
        };
        var this_1 = this;
        for (var rowNum = 0; rowNum < this.height; rowNum++) {
            _loop_1(rowNum);
        }
        document.querySelector("#world_wrapper").appendChild(world); //TODO already have the variable
    };
    Printer.prototype.setCellLiveClasses = function (cell, clss) {
        //if (! clss in Printer.CELL_CSS_CLASSES) // TODO REACTIVATE, TODO refactor should only allow dead_cell or alive_cell classes
        //{
        //	return;
        //}
        cell.classList.remove(Printer.CELL_CSS_CLASSES.alive);
        cell.classList.remove(Printer.CELL_CSS_CLASSES.dead);
        cell.classList.add(clss);
    };
    Printer.prototype.paintCells = function (population) {
        var world_wrapper = document.querySelector("#world_wrapper");
        world_wrapper.style.display = "hidden"; //TODO added style
        var row_start = this.center.getY() - Math.floor(this.height / 2);
        var col_start = this.center.getX() - Math.floor(this.width / 2);
        var row_end = row_start + this.height;
        var col_end = col_start + this.width;
        this.population = population;
        for (var row_num = 0; row_num < this.height; row_num++) {
            for (var col_num = 0; col_num < this.width; col_num++) {
                var cell = this.cellsMatrix[row_num][col_num];
                if (population.isAlive(row_num + row_start, col_num + col_start))
                    this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.alive);
                else
                    this.setCellLiveClasses(cell, Printer.CELL_CSS_CLASSES.dead);
            }
        }
        this.population = population;
        world_wrapper.style.display = "block"; //TODO added style
    };
    Printer.CELL_CSS_CLASSES = {
        alive: "alive_cell",
        dead: "dead_cell",
        cell: "cell"
    };
    Printer.cellWidth = 10;
    Printer.cellHeight = 10;
    return Printer;
}());
var Render = /** @class */ (function () {
    function Render() {
        this.printer = new Printer();
        this.printer.setSize();
        this.population = new storage_mjs_1.CellPopulation();
        var margin = 10;
        var start = new Point(((0 - this.printer.width / 2)) + margin, Math.floor((0 - this.printer.height / 2)) + margin);
        var end = new Point(((this.printer.width / 2)) - margin, Math.floor((this.printer.height / 2)) - margin);
        for (var rw = start.y; rw < end.y; rw++) {
            for (var cl = start.x; cl < end.x; cl++) {
                this.population.bringToLife(rw, cl);
            }
        }
        this.events();
    }
    Render.prototype.getPopulation = function () {
        return this.population;
    };
    Render.nextGeneration = function (render) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!PAUSED) {
                    render.population = render.population.nextGeneration();
                }
                return [2 /*return*/];
            });
        });
    };
    Render.paintCells = function (render) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                render.printer.paintCells(render.population);
                return [2 /*return*/];
            });
        });
    };
    Render.prototype.events = function () {
        var _this = this;
        document.addEventListener("DOMContentLoaded", function (event) {
            console.log("dom content loaded");
            _this.printer.createWorld(_this);
            _this.printer.paintCells(_this.population);
            setInterval(Render.nextGeneration, 1000, _this);
            setInterval(Render.paintCells, 100, _this);
            document.querySelector(".tools form").addEventListener("submit", function (event) {
                event.preventDefault();
                var x = parseInt(event.target.querySelector('input[name="x"]').value);
                var y = parseInt(event.target.querySelector('input[name="y"]').value);
                if (!isNaN(x))
                    _this.printer.center.x = x;
                if (!isNaN(y))
                    _this.printer.center.y = y;
            });
            document.querySelector(".tools .clear").addEventListener("click", function (event) {
                _this.population = new storage_mjs_1.CellPopulation();
            });
        });
        window.addEventListener("resize", function (event) {
            _this.printer.createWorld(_this);
            _this.printer.paintCells(_this.population);
        });
        document.querySelector("#world_wrapper").addEventListener("keydown", function (event) {
            if (document.activeElement.id != "world_wrapper")
                return;
            if (event.keyCode == 37) {
                console.log("left");
                _this.printer.center.x -= 5;
            }
            else if (event.keyCode == 38) {
                console.log("upp");
                _this.printer.center.y -= 5;
            }
            else if (event.keyCode == 39) {
                console.log("right");
                _this.printer.center.x += 5;
            }
            else if (event.keyCode == 40) {
                console.log("down");
                _this.printer.center.y += 5;
            }
            else if (event.keyCode == 32) {
                console.log("space");
                PAUSED = !PAUSED;
                var tools = document.querySelector(".tools");
                if (PAUSED) {
                    tools.classList.add("force_visible");
                }
                else {
                    tools.classList.remove("force_visible");
                }
            }
        });
    };
    return Render;
}());
var render = new Render();
