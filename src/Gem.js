
import ui.View;
import ui.ImageView;
import ui.resource.Image as Image;

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

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {

		supr(this, 'init', [opts]);

		this._gemType = opts.gemType;

		this.build();

	};


	this.build = function() {
		var selectedGem = GEM_IMAGES[this._gemType];  // FIXME: Do it better way?
		this._gemView = new ui.ImageView({
			superview: this,
			image: selectedGem,
			x: 2,
			y: 2,
			width: 30,
			height: 30,
		});
	};
});

exports.GEM_TYPES = GEM_TYPES;
exports.TYPES_OF_GEMS = NUM_GEMS;