import ui.TextView as TextView;

//sdk imports
import device;
import ui.StackView as StackView;

//user imports
import src.TitleScreen as TitleScreen;
import src.GameScreen as GameScreen;

exports = Class(GC.Application, function () {

	this.initUI = function () {
		var titleScreen = new TitleScreen();
		var gameScreen = new GameScreen();

		//Add a new StackView to the root of the scene graph
		var rootView = new StackView({
			superview: this,
			x: device.width / 2 - 160,
			y: device.height / 2 - 240,
			width: 320,
			height: 480,
			clip: true,
		});

		rootView.push(titleScreen);
		//rootView.push(gameScreen);

		titleScreen.on('titlescreen:start', function () {
			gameScreen.resetGame();
			rootView.push(gameScreen);
		});

		gameScreen.on('gamescreen:decreaseMoves', function() {
			gameScreen.decreaseMoves();
		});

		gameScreen.on('gamescreen:scoreUpdate', function(score) {
			gameScreen.updateScore(score);
		});

		/* When the game screen has signalled that the game is over,
		 * show the title screen so that the user may play the game again.
		 */
		gameScreen.on('gamescreen:end', function () {
			//sound.stop('levelmusic');
			rootView.pop();
			titleScreen.showGameOverLabel(gameScreen.getTotalScore());
		});
	};
	
	this.launchUI = function () {};
});
