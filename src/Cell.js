import ui.View;
import ui.ImageView;
import math.util as mathutils;
import ui.resource.Image as Image;
import animate;

var GEM_TYPES = {
	PURPLE: 0,
	ORANGE: 1,
	BLUE: 2,
	RED: 3,
	GREEN: 4
};

var GEM_IMAGES = {
	0: new Image({url: "resources/images/gems/purple.png"}),
	1: new Image({url: "resources/images/gems/orange.png"}),
	2: new Image({url: "resources/images/gems/blue.png"}),
	3: new Image({url: "resources/images/gems/red.png"}),
	4: new Image({url: "resources/images/gems/green.png"})
};

var NUM_GEMS = 5;

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

		this._gemType  = opts.gemType;
		this._cellType = opts.cellType;

		this.build();
	};

	this.build = function() {
		if (this._cellType == CELL_TYPES.FILLED) {
			var selectedGem = GEM_IMAGES[this._gemType];
			this._gemView = new ui.ImageView({
				superview: this,
				image: selectedGem,
				x: 2,
				y: 2,
				width: 30,
				height: 30,
			});
		}
		else {
			//TODO: fill with semi-transparent image?
		}
	};

	this.getCellType = function() {
		return this._cellType;
	};

	this.selectCell = function() {
		//TODO: implement it's animation
	};

	this.deselectCell = function() {
		//TODO: implement it's animation
	};

	this.getGemType = function() {
		return this._gemType;
	};

	this.isFilled = function() {
		return this._cellType == CELL_TYPES.FILLED;
	};

	this.clear = function() {
		//TODO: particle affects?
		this._gemView.style.visible = false;
	};

	this.renew = function(gemType) {
		this._gemType = gemType;
		var selectedGem = GEM_IMAGES[this._gemType]
		this._gemView.setImage(selectedGem);
		this._gemView.style.visible = true;
	}
});

exports.CELL_TYPES = CELL_TYPES;
exports.CELL_DIM = CELL_DIM;
exports.NUM_GEMS = NUM_GEMS;