/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */

import ui.View;
import ui.ImageView as ImageView;
import ui.TextView as TextView;
import ui.widget.ButtonView as ButtonView;

/* The title screen is added to the scene graph when it becomes
 * a child of the main application. When this class is instantiated,
 * it adds the start button as a child.
 */

 var SCORE_LABEL = "Total score: ";

exports = Class(ImageView, function (supr) {
	this.init = function (opts) {
		opts = merge(opts, {
			x: 0,
			y: 0,
			image: "resources/images/ui/background.png"
		});

		supr(this, 'init', [opts]);

		this.build();
	};

	this.build = function() {

    this._gameOver = new ImageView({
      superview: this,
      x: 30,
      y: 160,
      width: 250,
      height: 50,
      image: "resources/images/ui/gameover.png",
      visible: false
    });

		this._startButton = new ButtonView({
      superview: this,
      x: 70,
      y: 230,
      width:  180,
      height: 75,
      images: {
        down: "resources/images/ui/startButton.png",
        up:   "resources/images/ui/startButton.png"
      },
      title: "Play Game!",
      text: {
        size: 25,
        color: "brown",
      },
      clickOnce: true
    });

    this._startButton.on('InputSelect', bind(this, function(){
      this.emit('titlescreen:start');
    }));

    this._scoreLabel = new TextView({
      superview: this,
      x: 80,
      y: 300,
      width: 100,
      height: 100,
      text: SCORE_LABEL,
      color: "orange",
      shadowColor: "black",
      visible: false
    });

    this._score = new TextView({
      superview: this,
      x: 180,
      y: 310,
      width: 70,
      height: 70,
      color: "orange",
      shadowColor: "black",
      visible: false
    });

	};

  this.showGameOverLabel = function(totalScore) {
    this._gameOver.style.visible = true;
    this._scoreLabel.style.visible = true;
    this._startButton.setTitle("Play Again!");
    this._score.setText(totalScore);
    this._score.style.visible = true;
  }

});

