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
	ANIM_INTERVAL_SWAP = 100,
	ANIM_INTERVAL_REV  = 200;

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

		this.on("InputStart", this.onTouchStarted.bind(this));
		this.on("InputMove", this.onDragStarted.bind(this));
	};

	this.setupGrid = function() {
		this._cells = new Array(GRID_WIDTH);
		for (var i = 0; i < GRID_WIDTH; i++) {
			this._cells[i] = new Array(GRID_HEIGHT);
			for (var j = 0; j < GRID_HEIGHT; j++) {
				this.createCell(i, j);
			}
		}
	};

	this.createCell = function(i, j) {
		//TODO: add check about neighboring cells being of different color
		var cellType = this.randomCell(i, j);
		var cell = new Cell({cellType: cellType});
		cell.style.x = cell.style.x + (i * Cell.CELL_DIM.WIDTH);
		cell.style.y = cell.style.y + (j * Cell.CELL_DIM.HEIGHT);
		this._cells[i][j] = cell;
		this.addSubview(cell);
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
			if (cell.isFilled()) {
				cell.selectCell();
				this._selectedCell = cell;
				this._selectedCellCoords = coords;
				console.log("selected cell: " + coords.x + ", " + coords.y);
			}
		}
	};

	this.sameCells = function(c1, c2) {
		return (c1.x == c2.x && c1.y == c2.y);
	};

	this.onDragStarted = function(evt, pt) {
		if (this._selectedCell != null) {
			var coords = this.getTouchedCell(pt);
			if (this.sameCells(this._selectedCellCoords, coords) == false) {
				var destCell = this._cells[coords.x][coords.y];
				if (destCell.isFilled()) {
					this.swap(this._selectedCellCoords, coords);
					animate(this).wait(ANIM_INTERVAL_REV).then(this.proceedAfterSwap.bind(this, this._selectedCellCoords, coords));
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

	this.proceedAfterSwap = function(src, des) {
		var coords = this.trySmash(des)
		if (coords.length < 3) {
			this.swap(des, src); // cannot smash so reverse the swap
		}
		else {
			this.smash(coords);
		}
	};

	this.smash = function(coords) {
		for (var i = 0; i < coords.length; i++) {
			var x = coords[i].x;
			var y = coords[i].y;
			var cell = this._cells[x][y];

		}
	};

	this.swap = function(src, des) {
		var srcCell  = this._cells[src.x][src.y];
		var destCell = this._cells[des.x][des.y];
		var x = srcCell.style.x;
		var y = srcCell.style.y;

		animate(this._cells[src.x][src.y]).now({x: destCell.style.x, y: destCell.style.y}, ANIM_INTERVAL_SWAP);
		animate(this._cells[des.x][des.y]).now({x: x, y: y}, ANIM_INTERVAL_SWAP);
		
		this._cells[src.x][src.y] = destCell;
		this._cells[des.x][des.y] = srcCell;
	};

	this.trySmash = function(des) {
		var x = des.x;
		var y = des.y;
		var destCell = this._cells[x][y];
		var coords = new Array();
		coords.push({x: x, y: y});
		if (y > 0) {
			var newY = y - 1;
			while (newY >= 0 && (cell = this._cells[x][newY]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
				coords.push({x: x, y: newY});
				newY = newY - 1;
			}
		}
		if (y < GRID_HEIGHT) {
			var newY = y + 1;
			while (newY <= GRID_HEIGHT && (cell = this._cells[x][newY]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
				coords.push({x: x, y: newY});
				newY = newY + 1;
			}
		}
		if (x > 0) {
			var newX = x - 1;
			while (newX >= 0 && (cell = this._cells[newX][y]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
				coords.push({x: newX, y: y});
				newX = newX - 1;
			}
		}
		if (x < GRID_WIDTH) {
			var newX = x + 1;
			while (newX >= 0 && (cell = this._cells[newX][y]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
				coords.push({x: newX, y: y});
				newX = newX + 1;
			}
		}
		for (var i = 0; i < coords.length; i++) {
			console.log("SMASH: " + coords[i].x + ", " + coords[i].y);
		}
		return coords;
	};

});