/**
 * Class to easily create modals
 */
cowboy.Modal = new Class ({
	Implements: cowboy.Options,

	options: {
		triggerer: null,
		transition: 'Expo.easeOut',
		duration: 500,
		hiddenClass: 'hidden',
		bckgClass: 'modal-bckg',
		closeOnBlur: true,
		escape: true,
		showOnInit: false
	},

	/**
	 * Constructor
	 * @param  {Element} modal		Element to show
	 * @param  {Object} options		Options for the modal
	 */
	initialize: function(modal, options) {
		var _this = this;
		// Set Options and overload options by properties in the form
		this.options = Object.merge(this.options, options);
		this.setElementOptions(this.options, modal);

		this.isShown = false;

		this.modal = modal;
		if (this.options.triggerer && $(this.options.triggerer)) {
			this.triggerer = $(this.options.triggerer);

			this.triggerer.addEvent('click', function() {
				_this.show();
			});
		}

		this.modal.getElements('.close-modal').each(function(element) {
			element.addEvent('click', function () {
				_this.hide();
			});
		});

		if (this.options.bckgClass && $$(this.options.bckgClass)) {
			this.bckg = ($$('.' + this.options.bckgClass))[0];
			if (this.options.closeOnBlur) {
				this.bckg.addEvent('click', function() {
					_this.hide();
				});
			}
		}

		if (this.options.showOnInit) {
			this.show();
		}
	},

	/**
	 * Show the modal
	 */
	show: function() {
		var _this = this;

		if (!this.isShown) {
			this.isShown = true;

			var posY = 45;

			this.modal.removeClass(this.options.hiddenClass);
			this.modal.setStyle('left', ((window.getWidth()/2)-(this.modal.clientWidth/2)).round());

			if (this.bckg) {
				this.bckg.removeClass(this.options.hiddenClass);
				var bckgFx = new Fx.Morph(this.bckg, {
					duration: this.options.duration,
					transition: window['Fx.Transitions.' + this.options.transition]
				});
				bckgFx.start({'opacity': [0, 0.5]});
			}

			var modalFx = new Fx.Morph(this.modal, {
				duration: this.options.duration,
				transition: window['Fx.Transitions.' + this.options.transition]
			});
			modalFx.start({'top': [-2000, posY]});

			if (this.options.escape) {
				window.addEvent('keydown', function(event){
					if(event.key == 'esc') _this.hide();
				});
			}
		}
	},

	/**
	 * Hide the modal
	 */
	hide: function() {
		var _this = this;

		if (this.isShown) {
			this.isShown = false;

			var posY = this.modal.getStyle('top');

			var modalFx = new Fx.Morph(_this.modal, {
				duration: this.options.duration,
				transition: window['Fx.Transitions.' + this.options.transition]
			});
			modalFx.start({'top': [posY, -2000]}).chain(function() {
				_this.modal.addClass('hidden');
			});

			if (this.bckg) {
				var bckgFx = new Fx.Morph(this.bckg, {
					duration: this.options.duration,
					transition: window['Fx.Transitions.' + this.options.transition]
				});
				bckgFx.start({'opacity': [0.5, 0]}).chain(function() {
					_this.bckg.addClass('hidden');
				});
			}
		}
	},

	/**
	 * Toggle modal
	 */
	toggle: function() {
		return this[this.isShown ? 'hide' : 'show']();
	}
});