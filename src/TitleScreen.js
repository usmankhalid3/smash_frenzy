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
		var startButton = new ButtonView({
  			superview: this,
  			x: 70,
  			y: 160,
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

    startButton.on('InputSelect', bind(this, function(){
      this.emit('titlescreen:start');
    }));
	};
});

