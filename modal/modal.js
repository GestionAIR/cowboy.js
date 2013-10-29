/**
 * Class to easily create modals
 * @class cowboy.Modal
 * @implements {cowboy.Options}
 */
cowboy.Modal = new Class ({
	Implements: cowboy.Options,

	options: {
		trigger: null,
		transition: 'Expo.easeOut',
		duration: 500,
		hiddenClass: 'hidden',
		bckgClass: 'modal-bckg',
		closeOnBlur: true,
		escape: true,
		showOnInit: false,
		reloadOnEach: false,
		callback: function() { return; }
	},

	/**
	 * Constructor
	 * @constructor
	 * @param  {Element} modal		Element to show
	 * @param  {Object} options		Options for the modal
	 */
	initialize: function(modal, options) {
		var _this = this;
		// Set Options and overload options by properties in the form
		this.options = Object.merge(this.options, options);

		this.isShown = false;

		if (typeof(modal) == 'object') {
			this.setElementOptions(this.options, modal);

			this.modal = modal;

			this.modal.getElements('.close-modal').each(function(element) {
				element.addEvent('click', function () {
					_this.hide();
				});
			});

		}
		else if (typeof(modal) == 'string') {
			this.url = modal;
		}

		if (this.options.trigger) {
			if (typeof(this.options.trigger) == 'array') {
			this.options.trigger.each(function(trigger) {
					trigger.addEvent('click', function() {
						_this.showAdapter();
					});
				});
			}
			else {
				this.options.trigger.addEvent('click', function() {
					_this.showAdapter();
				});
			}
		}

		if (this.options.bckgClass && $$(this.options.bckgClass)) {
			this.bckg = ($$('.' + this.options.bckgClass))[0];
			if (this.options.closeOnBlur) {
				this.bckg.addEvent('click', function() {
					_this.hide();
				});
			}
		}

		if (this.options.showOnInit) {
			this.showAdapter();
		}
	},

	/**
	 * Adapter to choose the way to show the modal
	 * @method showAdapter
	 * @return {Function}
	 */
	showAdapter: function() {
		if (this.url) return this.showAjax();
		else if (typeof(this.modal) == 'object') return this.show();
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
	 * Show the modal by loading it with an AJAX transaction
	 * @method showAjax
	 */
	showAjax: function() {
		var _this = this;
		if (!this.isShown) {
			if (!this.modal) {
				new Request.HTML({
					url: this.url,
					noCache: true,
					onSuccess: function(responseTree, responseElements, responseHTML) {
						_this.modal = new Element('div', {
							id: responseTree[0].id,
							html: responseTree[0].innerHTML,
							'class': responseTree[0].classList
						});
						_this.modal.addClass(this.options.hiddenClass);
						_this.modal.inject($(document.body));

						_this.modal.getElements('.close-modal').each(function(element) {
							element.addEvent('click', function () {
								_this.hide();
							});
						});
						if (this.options.reloadOnEach !== true) {
							_this.url = null;
						}
						_this.show();
					}
				}).get();
			}
		}
	},

	/**
	 * Hide the modal
	 * @method hide
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
				if (_this.options.reloadOnEach) {
					_this.modal.destroy();
					_this.modal = null;
				}
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
		if (typeof this.options.callback == 'function') {
			window.setTimeout(this.options.callback, this.options.duration);
		}
	},

	/**
	 * Toggle modal
	 * @method toggle
	 */
	toggle: function() {
		return this[this.isShown ? 'hide' : 'showAdapter']();
	}
});
