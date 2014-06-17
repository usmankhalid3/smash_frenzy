/*
 * The game screen is a singleton view that consists of
 * a scoreboard and the gem board.
 */

import device;
import animate;
import ui.View;
import ui.ImageView;
import ui.ScoreView;
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

var score = 0,
		high_score = 19,
		hit_value = 1,
		game_on = false,
		lang = 'en';

var ANIM_INTERVAL_GAME_END = 1000;
var MAX_MOVES = 3;

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
	
	/*
	 * Layout the scoreboard and molehills.
	 */
	this.build = function () {
		/* The start event is emitted from the start button via the main application.
		 */
		//this.on('app:start', start_game_flow.bind(this));

		/* The scoreboard displays the "ready, set, go" message,
		 * the current score, and the end game message. We'll set
		 * it as a hidden property on our class since we'll use it
		 * throughout the game.
		 */
		 //background image
		new ui.ImageView({
			superview: this,
			x: 0,
			y: 0,
			width: device.width,
			height: device.height,
			image: "resources/images/ui/background.png"
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

	this.endGame = function() {
		//TODO: do the whole game over animation
		this.emit('gamescreen:end');
	};

});