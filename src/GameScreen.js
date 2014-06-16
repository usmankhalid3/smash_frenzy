/*
 * The game screen is a singleton view that consists of
 * a scoreboard and the gem board.
 */

import device;
import animate;
import ui.View;
import ui.ImageView;
import ui.TextView;
import src.Grid as Grid;
/* Some game constants.
 */


var score = 0,
		high_score = 19,
		hit_value = 1,
		game_on = false,
		lang = 'en';

exports = Class(ui.View, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
		});

		supr(this, 'init', [opts]);

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

		//score label
		new ui.TextView({
			superview: this,
			x: 40,
			y: 400,
			size: 38,
			width: 30,
			height: 30,
			text: "Score: ",
			color: "black",
			wrap: false,
			horizontalAlign: "center",
			autoSize: false
		});

		//score
		this._score = new ui.TextView({
			superview: this,
			x: 80,
			y: 400,
			size: 38,
			width: 30,
			height: 30,
			text: "100",
			color: "black",
			horizontalAlign: "left",
			autoSize: false
		});

		this._grid = new Grid({x: 40, y: 153});

		this.addSubview(this._grid);
/*
		this._scoreboard = new ui.TextView({
			superview: this,
			x: 0,
			y: 15,
			width: 320,
			height: 50,
			autoSize: false,
			size: 38,
			verticalAlign: 'middle',
			horizontalAlign: 'center',
			wrap: false,
			color: '#FFFFFF'
		});
*/
	};
});

/*
 * Game play
 */

/* Manages the intro animation sequence before starting game.
 */
function start_game_flow () {
	var that = this;

}

/* Tell the main app to switch back to the title screen.
 */
function emit_endgame_event () {
	this.once('InputSelect', function () {
		this.emit('gamescreen:end');
		reset_game.call(this);
	});
}

/* Reset game counters and assets.
 */
function reset_game () {
	score = 0;
	countdown_secs = game_length / 1000;
	this._scoreboard.setText('');
	this._molehills.forEach(function (molehill) {
		molehill.resetMole();
	});
	this._scoreboard.updateOpts({
		x: 0,
		fontSize: 38,
		verticalAlign: 'middle',
		textAlign: 'center',
		multiline: false
	});
	this._countdown.updateOpts({
		visible: false,
		color: '#fff'
	});
}

/*
 * Strings
 */

function get_end_message (score, isHighScore) {
	var moles = (score === 1) ? text.MOLE : text.MOLES,
			end_msg = text.END_MSG_START + ' ' + score + ' ' + moles + '.\n';

	if (isHighScore) {
		end_msg += text.HIGH_SCORE + '\n';
	} else {
		//random taunt
		var i = (Math.random() * text.taunts.length) | 0;
		end_msg += text.taunts[i] + '\n';
	}
	return (end_msg += text.END_MSG_END);
}

var localized_strings = {
	en: {
		READY: "Ready ...",
		SET: "Set ...",
		GO: "Whack that Mole!",
		MOLE: "mole",
		MOLES: "moles",
		END_MSG_START: "You whacked",
		END_MSG_END: "Tap to play again",
		HIGH_SCORE: "That's a new high score!"
	}
};

localized_strings['en'].taunts = [
	"Welcome to Loserville, population: you.", //max length
	"You're an embarrassment!",
	"You'll never catch me!",
	"Your days are numbered, human.",
	"Don't quit your day job.",
	"Just press the screen, it's not hard.",
	"You might be the worst I've seen.",
	"You're just wasting my time.",
	"Don't hate the playa, hate the game.",
	"Make like a tree, and get out of here!"
];

//object of strings used in game
var text = localized_strings[lang.toLowerCase()];

