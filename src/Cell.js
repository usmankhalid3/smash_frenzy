import ui.View;
import src.Gem as Gem;
import math.util as mathutils;

var CELL_DIM = {
	WIDTH: 34,
	HEIGHT: 34
};

var CELL_TYPES = {
	EMPTY: 0,
	FILLED: 1
};

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {

		supr(this, 'init', [opts]);

		this._cellType = opts.cellType;

		this.build();
	};

	this.build = function() {
		if (this.getType() == CELL_TYPES.FILLED) {
			this._gemType = this.randomGem();
			this._gem = new Gem({gemType: this._gemType});
			this.addSubview(this._gem);
		}
		else {
			//TODO: fill with semi-transparent image?
		}
	};

	this.randomGem = function() {
		var len = Gem.TYPES_OF_GEMS;
		return mathutils.random(0, len) | 0;
	};

	this.getType = function() {
		switch(this._cellType) {
			case CELL_TYPES.EMPTY : return CELL_TYPES.EMPTY;
			case CELL_TYPES.FILLED : return CELL_TYPES.FILLED;
		}
	};

	this.selectCell = function() {

	};

	this.deselectCell = function() {

	};

	this.getGem = function() {
		return this._gem;
	};

	this.isFilled = function() {
		return this._cellType == CELL_TYPES.FILLED;
	}
});

exports.CELL_TYPES = CELL_TYPES;
exports.CELL_DIM = CELL_DIM;