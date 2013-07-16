/* 
 * Class cowboy.LogBar
 * Displays a status bar in the bottom of the screen
 */
cowboy.LogBar = new Class({
	Implements: cowboy.Options,
	options: {
		transition: 'Expo.easeOut',
		displayOnStartup: false,
		logbarHeight: 56,
		idContent: 'log'
	},

	/**
	 * Constructor
	 * @param  {Object}	options	Options
	 */
	initialize: function(options) {
		this.options = Object.merge(this.options, options);

		// status = false because the logbar is not displayed at startup
		this.status = false;

		if (this.options.displayOnStartup) {
			this.show({text: options.text, duration: options.duration });
		}
	},

	/**
	 * Display the logbar
	 * @param  {Object}	options	Options
	 */
	show: function(options) {
		if (this.status) {
			if (options.text !== undefined) {
				$(this.options.idContent).set('html', options.text);
			}
			if (options.duration !== undefined) {
				(function() { LOGBAR.hide();}).delay(options.duration);
			}
		}
		else {
			if (options.text !== undefined) {
				$(this.options.idContent).set('html', options.text);
			}

			// Define animation
			new Fx.Morph($('log-bar'), {
				duration: '1000',
				transition: window['Fx.Transitions.' + this.options.transition]
			}).start({'bottom': [-this.options.logbarHeight, 0]});

			// Write that the logbar is up
			this.status = true;

			// If a parameter was specified, hide the logbar after x milliseconds
			if (options.duration) {
				(function () { LOGBAR.hide();}).delay(options.duration);
			}
		}
	},

	/**
	 * Hide the logbar
	 */
	hide: function() {
		// If the logbar is not visible, do nothing
		if (this.status) {
			// Define animation
			new Fx.Morph($('log-bar'), {
				duration: '1000',
				transition: window['Fx.Transitions.' + this.options.transition]
			}).start({'bottom': [0, -this.options.logbarHeight]});

			// Write that the logbar is down
			this.status = false;
		}
	}
});

// When DOM is ready, initialize the logbar if #log-bar exists
window.addEvent('domready', function () {
	if ($('log-bar')) { LOGBAR = new cowboy.LogBar(); }
});
