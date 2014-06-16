import ui.View;
import ui.ImageView;
import src.Cell as Cell;
import math.util as mathutils;
import animate;

var GRID_WIDTH  = 7,
	GRID_HEIGHT = 7;
	CELL_BOUND_TOP = 1,
	CELL_BOUND_BOTTOM = 6,
	CELL_BOUND_LEFT = 1,
	CELL_BOUND_RIGHT = 6,
	FILLED_CELL_PROB = 100,
	TOTAL_EMPTY_CELLS = 5;
	ANIM_INTERVAL_SWAP = 100,
	ANIM_INTERVAL_REV  = 200,
	ANIM_INTERVAL_FALL = 200,
	ANIM_INTERVAL_AUTOFALL = 201;

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

		this._emptyCells = 0;

		this._score = 0;

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

	this.randomGem = function(i, j) {
		var tryAgain = true;
		var gemType = mathutils.random(0, Cell.NUM_GEMS) | 0;
		// check for horizontal triplets of the same color
		if (i > 1 && this._cells[i-1][j].getGemType() == gemType && this._cells[i-2][j].getGemType() == gemType) {
			return this.randomGem(i, j);
		}
		// check for vertical triplets of the same color
		else if (j > 1 && this._cells[i][j-1].getGemType() == gemType && this._cells[i][j-2].getGemType() == gemType) {
			return this.randomGem(i, j);
		}
		return gemType;
	};

	this.createCell = function(i, j) {
		var cellType = this.randomCell(i, j);
		var gemType = this.randomGem(i, j);
		var cell = new Cell({gemType: gemType, cellType: cellType});
		cell.style.x = cell.style.x + (i * Cell.CELL_DIM.WIDTH);
		cell.style.y = cell.style.y + (j * Cell.CELL_DIM.HEIGHT);
		this._cells[i][j] = cell;
		this.addSubview(cell);
	};

	this.randomCell = function(i, j) {
		//empty cells should be less than a threshold
		if (this._emptyCells > TOTAL_EMPTY_CELLS) {
			return Cell.CELL_TYPES.FILLED;
		}
		//Make sure empty cells are not adjacent
		if (i > 1 && this._cells[i-1][j].getCellType() == Cell.CELL_TYPES.EMPTY) {
			return Cell.CELL_TYPES.FILLED;
		}
		else if (j > 1 && this._cells[i][j-1].getCellType() == Cell.CELL_TYPES.EMPTY) {
			return Cell.CELL_TYPES.FILLED;
		}
		//only generate empty cells within a centralized bounding box
		if ((i < CELL_BOUND_LEFT || i > CELL_BOUND_RIGHT) || (j < CELL_BOUND_TOP || j > CELL_BOUND_BOTTOM)) {
			return Cell.CELL_TYPES.FILLED;
		}
		var num = mathutils.random(0, 100) | 0;
		if (num > FILLED_CELL_PROB) {
			this._emptyCells++;
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

	this.onTouchStarted = function(evt, pt) {
		if (this._selectedCell == null) {
			//console.log("touched at: " + pt.x + ", " + pt.y);
			var coords = this.getTouchedCell(pt);
			var cell = this._cells[coords.x][coords.y];
			if (cell && cell.isFilled()) {
				cell.selectCell();
				this._selectedCell = cell;
				this._selectedCellCoords = coords;
				//console.log("selected cell: " + coords.x + ", " + coords.y);
			}
		}
	};

	this.sameCells = function(c1, c2) {
		return (c1.x == c2.x && c1.y == c2.y);
	};

	this.disableTouches = function() {
		this.setHandleEvents(false, true);
	};

	this.enableTouches = function() {
		this.setHandleEvents(true, false);
	};

	this.onDragStarted = function(evt, pt) {
		if (this._selectedCell != null) {
			var coords = this.getTouchedCell(pt);
			if (this.sameCells(this._selectedCellCoords, coords) == false) {
				var destCell = this._cells[coords.x][coords.y];
				if (destCell && destCell.isFilled()) {
					this.disableTouches();
					this._score = 0;
					this.swap(this._selectedCellCoords, coords);
					animate(this).wait(ANIM_INTERVAL_REV).then(this.proceedAfterSwap.bind(this, this._selectedCellCoords, coords));
				}
				this._selectedCell.deselectCell();
				this._selectedCellCoords = null;
				this._selectedCell = null;
				//console.log("cell deselected");
			}
			//console.log("moving at: " + pt.x + ", " + pt.y);
		}
	};

	this.increaseScore = function(cells) {
		this._score = this._score + (cells * 10);
		this.emit("score:update", this._score);
	};

	this.proceedAfterSwap = function(src, des) {
		var coords = this.trySmash(des)
		if (coords.length < 3) {
			this.swap(des, src); // cannot smash so reverse the swap
			this.enableTouches();
		}
		else {
			this.smash(coords);
			animate(this).wait(ANIM_INTERVAL_FALL * 2).then(this.proceedAfterSmash.bind(this));
		}
	};

	this.proceedAfterSmash = function() {
		coords = this.nextSmashPivot();
		if (coords) {
			this.smash(coords);
			animate(this).wait(ANIM_INTERVAL_AUTOFALL).then(this.proceedAfterSmash.bind(this));
		}
		else {
			this.enableTouches();
		}
	};

	this.buildHash = function(coords) {
		var hash = {};
		for (var i = 0; i < coords.length; i++) {
			var list = hash[coords[i].x];
			if (!list) {
				hash[coords[i].x] = new Array();
			}
			hash[coords[i].x].push(coords[i].y);
		}
		return hash;
	};

	this.smash = function(coords) {
		this.increaseScore(coords.length);
		var clearedCells = new Array();
		for (var i = 0; i < coords.length; i++) {
			var x = coords[i].x;
			var y = coords[i].y;
			var cell = this._cells[x][y];
			clearedCells.push(cell);
			cell.clear();
		}
		var hash = this.buildHash(coords);
		for (var key in hash) {
			var list = hash[key].sort();
			var x = parseInt(key);
			//console.log(x + ": " + list);
			var len = list.length;
			var srcRow = list[0] - 1;
			var desRow = list[len - 1];
			if (srcRow >= 0) {
				for (var j = 0; j < GRID_HEIGHT && (srcRow >= 0); j++) {
					var posX = this._cells[x][desRow].style.x;
					var posY = this._cells[x][desRow].style.y;
					var cell = this._cells[x][srcRow];
					animate(cell).now({x: posX, y: posY}, ANIM_INTERVAL_FALL);
					this._cells[x][desRow] = cell;
					srcRow = srcRow - 1;
					desRow = desRow - 1;
				}
			}
			//console.log("CLEARED: " + clearedCells.length);
			animate(this).wait(ANIM_INTERVAL_FALL).then(this.fillGaps.bind(this, x, desRow, clearedCells));
		}
	};

	this.fillGaps = function(col, row, clearedCells) {
		var posX = Cell.CELL_DIM.WIDTH * col;
		while (row >= 0) {
			var posY = Cell.CELL_DIM.HEIGHT * row;
			var srcCell = clearedCells.pop();
			srcCell.style.x = posX;
			srcCell.style.y = Cell.CELL_DIM.HEIGHT  * -1;
			srcCell.renew(this.randomGem());
			animate(srcCell).now({y: posY}, ANIM_INTERVAL_FALL);
			this._cells[col][row] = srcCell;
			row = row - 1;
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

	this.nextSmashPivot = function() {
		var stop = false;
		for (var i = 0; i < GRID_WIDTH && !stop; i++) {
			for (var j = 0; j < GRID_HEIGHT && !stop; j++) {
				var coords = this.trySmash({x: i, y: j});
				if (coords.length >= 3) {
					return coords;
				}
			}
		}
	};

	this.trySmash = function(pos) {
		var x = pos.x;
		var y = pos.y;
		var destCell = this._cells[x][y];
		var coords = new Array();
		coords.push({x: x, y: y});
		// try smashing vertically
		if (y > 0) {
			var newY = y - 1;
			while (newY >= 0 && (cell = this._cells[x][newY]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
				coords.push({x: x, y: newY});
				newY = newY - 1;
			}
		}
		if (y < GRID_HEIGHT) {
			var newY = y + 1;
			while (newY < GRID_HEIGHT && (cell = this._cells[x][newY]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
				coords.push({x: x, y: newY});
				newY = newY + 1;
			}
		}
		if (coords.length < 3) { // not enough vertical smash, try horizontal
			delete coords;
			coords = new Array();
			coords.push({x: x, y: y});
			if (x > 0) {
				var newX = x - 1;
				while (newX >= 0 && (cell = this._cells[newX][y]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
					coords.push({x: newX, y: y});
					newX = newX - 1;
				}
			}
			if (x < GRID_WIDTH) {
				var newX = x + 1;
				while (newX < GRID_WIDTH && (cell = this._cells[newX][y]) && cell.isFilled() && cell.getGemType() == destCell.getGemType()) {
					coords.push({x: newX, y: y});
					newX = newX + 1;
				}
			}
		}
		return coords;
	};

});