/*
 * The game screen is a singleton view that consists of
 * a scoreboard and the gem board.
 */

import device;
import animate;
import ui.View;
import ui.ImageView;
import ui.ScoreView;
import ui.TextView;
import src.Grid as Grid;
/* Some game constants.
 */

 var numbers = {
	"0": { "image": "resources/images/numbers/0.png" },
    "1": { "image": "resources/images/numbers/1.png" },
    "2": { "image": "resources/images/numbers/2.png" },
    "3": { "image": "resources/images/numbers/3.png" },
    "4": { "image": "resources/images/numbers/4.png" },
    "5": { "image": "resources/images/numbers/5.png" },
    "6": { "image": "resources/images/numbers/6.png" },
    "7": { "image": "resources/images/numbers/7.png" },
    "8": { "image": "resources/images/numbers/8.png" },
    "9": { "image": "resources/images/numbers/9.png" }
};

var ANIM_INTERVAL_GAME_END = 1000;
var MAX_MOVES = 20;

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
		});

		supr(this, 'init', [opts]);

		this._moves = MAX_MOVES;

		this.build();
	};
	
	this.build = function () {

		 //background image
		new ui.ImageView({
			superview: this,
			x: 0,
			y: 0,
			width: device.width,
			height: device.height,
			image: "resources/images/ui/background.png"
		});

		new ui.TextView({
			superview: this,
			x: 40,
			y: 430,
			width: 50,
			height: 50,
			text: "Score",
			color: "orange",
			shadowColor: "black",
		});

		new ui.TextView({
			superview: this,
			x: 240,
			y: 425,
			width: 60,
			height: 60,
			text: "Moves",
			color: "orange",
			shadowColor: "black",
		});

		this._score = new ui.ScoreView({
			layout: 'box',
			layoutHeight: 5,
			x: -100,
			y: 410,
			blockEvents: true,
			characterData: numbers,
			text: "0",
		});

		this._movesText = new ui.ScoreView({
			layout: 'box',
			layoutHeight: 5,
			x: 100,
			y: 410,
			blockEvents: true,
			characterData: numbers,
			text: this._moves,
		});

		this._grid = new Grid({x: 40, y: 153});

		this.addSubview(this._grid);
		this.addSubview(this._score);
		this.addSubview(this._movesText);
	};

	this.resetGame = function() {
		this._moves = MAX_MOVES;
		this._movesText.setText(this._moves);
		this._score.setText("0");
		this._grid.resetGrid();
	};

	this.updateScore = function(score) {
		this._score.setText(score);
	};

	this.decreaseMoves = function() {
		this._moves = this._moves - 1;
		this._movesText.setText(this._moves);
		if (this._moves <= 0) {
			animate(this).wait(ANIM_INTERVAL_GAME_END).then(this.endGame.bind(this));
		}
	};

	this.getTotalScore = function() {
		return this._grid.getTotalScore();
	};

	this.endGame = function() {
		//TODO: do the whole game over animation
		this.emit('gamescreen:end');
	};

});