import ui.View;
import ui.ImageView;
import src.Cell as Cell;
import math.util as mathutils;
import animate;

var GRID_WIDTH  = 7,
	GRID_HEIGHT = 7;
	CELL_BOUND_TOP = 2,
	CELL_BOUND_BOTTOM = 5,
	CELL_BOUND_LEFT = 2,
	CELL_BOUND_RIGHT = 5,
	FILLED_CELL_PROB = 100,
	ANIM_INTERVAL = 100;

var SWAP_DIR = {
	NA: 0,
	LR: 1,
	TB: 2
};


exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			width: GRID_WIDTH * Cell.CELL_DIM.WIDTH,
			height: GRID_HEIGHT * Cell.CELL_DIM.HEIGHT
		});

		this._width = opts.width;
		this._height = opts.height;

		supr(this, 'init', [opts]);

		this._cells = [];

		this.setupGrid();

/*
		this.on("InputSelect", bind(this, function(evt, pt) {
			console.log("touched at: " + pt.x + ", " + pt.y);
			var cell = this.getTouchedCell(pt.x, pt.y);
			console.log("selected cell: " + cell[0] + ", " + cell[1]);
		}));
*/
		this.on("InputStart", this.onTouchStarted.bind(this));
		this.on("InputMove", this.onDragStarted.bind(this));
		//this.on("InputSelect", this.onTouchEnded.bind(this));
	};

	this.setupGrid = function() {
		this._cells = new Array(GRID_WIDTH);
		for (var i = 0; i < GRID_WIDTH; i++) {
			this._cells[i] = new Array(GRID_HEIGHT);
			for (var j = 0; j < GRID_HEIGHT; j++) {
				var cellType = this.randomCell(i, j);
				var cell = new Cell({cellType: cellType});
				cell.style.x = cell.style.x + (i * Cell.CELL_DIM.WIDTH);
				cell.style.y = cell.style.y + (j * Cell.CELL_DIM.HEIGHT);
				this._cells[i][j] = cell;
				this.addSubview(cell);
			}
		}
	};

	this.randomCell = function(i, j) {
		//only generate empty cells within a centralized bounding box
		if ((i < CELL_BOUND_LEFT || i > CELL_BOUND_RIGHT) || (j < CELL_BOUND_TOP || j > CELL_BOUND_BOTTOM)) {
			return Cell.CELL_TYPES.FILLED;
		}
		var num = mathutils.random(0, 100) | 0;
		if (num > FILLED_CELL_PROB) {
			return Cell.CELL_TYPES.EMPTY;
		}
		else {
			return Cell.CELL_TYPES.FILLED;
		}
	};

	this.getTouchedCell = function(pt) {
		var cellX = Math.floor(pt.x / Cell.CELL_DIM.WIDTH);
		var cellY = Math.floor(pt.y / Cell.CELL_DIM.HEIGHT);
		return {x: cellX, y: cellY};
	};

	this.clearSelectedCell = function() {
		if (this._selectedCell != null) {
			//TODO: do the whole animation of releasing a cell
			this._selectedCell = null;
		}
	};

	this.onTouchStarted = function(evt, pt) {
		if (this._selectedCell == null) {
			console.log("touched at: " + pt.x + ", " + pt.y);
			var coords = this.getTouchedCell(pt);
			var cell = this._cells[coords.x][coords.y];
			cell.selectCell();
			this._selectedCell = cell;
			this._selectedCellCoords = coords;
			console.log("selected cell: " + coords.x + ", " + coords.y);
		}
	};

	this.sameCells = function(c1, c2) {
		return (c1.x == c2.x && c1.y == c2.y);
	};

	this.onDragStarted = function(evt, pt) {
		if (this._selectedCell != null) {
			var coords = this.getTouchedCell(pt);
			if (this.sameCells(this._selectedCellCoords, coords) == false) {
				var coords = this.getTouchedCell(pt);
				var destCell = this._cells[coords.x][coords.y];
				if (destCell.isFilled()) {
					if (this.canBeSwapped(this._selectedCell, destCell)) {
						this.swap(this._selectedCellCoords, coords);
						console.log("Swapped!");
					}
				}
				else {
					//TODO
				}
				this._selectedCell.deselectCell();
				this._selectedCellCoords = null;
				this._selectedCell = null;
				console.log("cell deselected");
			}
			//console.log("moving at: " + pt.x + ", " + pt.y);
		}
	};

	this.canBeSwapped = function(src, des) {
		return true;	//TODO implement this!
	};

	this.swapDirection = function(src, des) {
		if (des.x > src.x || des.x < src.x) {
			return SWAP_DIR.LR;
		}
		else if (des.y > src.y || des.y < src.y) {
			return SWAP_DIR.TB;
		}
		else {
			return SWAP_DIR.NA;
		}
	};

	this.swap = function(src, des) {
		var swapDir = this.swapDirection(src, des);
		if (swapDir == SWAP_DIR.NA) {
			return;	// same cell, no swap needed?
		}
		console.log("Swap direction: " + swapDir);
		var srcCell  = this._cells[src.x][src.y];
		var destCell = this._cells[des.x][des.y];
		var x = srcCell.style.x;
		var y = srcCell.style.y;

		if (swapDir == SWAP_DIR.LR) {
			animate(this._cells[src.x][src.y]).now({x: destCell.style.x}, ANIM_INTERVAL);
			animate(this._cells[des.x][des.y]).now({x: x}, ANIM_INTERVAL);
		}
		else if (swapDir == SWAP_DIR.TB) {
			animate(this._cells[src.x][src.y]).now({y: destCell.style.y}, ANIM_INTERVAL);
			animate(this._cells[des.x][des.y]).now({y: y}, ANIM_INTERVAL);
		}

		this._cells[src.x][src.y] = destCell;
		this._cells[des.x][des.y] = srcCell;

	};

	/*
	this.onTouchEnded = function(evt, pt) {
		if (this._selectedCell != null) {
			var coords = this.getTouchedCell(pt);
			var destCell = this._cells[coords.x][coords.y];
			if (destCell.isFilled()) {
				if (this.canBeSwapped(this._selectedCell, destCell)) {
					this.swap(this._selectedCellCoords, coords);
					console.log("Swapped!");
				}
			}
			else {
				//TODO
			}
			this._selectedCell.deselectCell();
			this._selectedCellCoords = null;
			this._selectedCell = null;
			console.log("cell deselected");
		}
	};
	*/

});