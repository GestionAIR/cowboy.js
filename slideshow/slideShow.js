/**
 * Create a slide for pictures
 */
cowboy.SlideShow = new Class({
	Implements: cowboy.Options,
	options: {
		firstSlide: 1,
		periodical: 6000,
		autoSlide: true,
		defaultDirection: 'right',
		loop: true,
		slideOnClick: true,
		transition: 'Circ.easeInOut',
		allowKeyboardArrows: true
	},

	initialize: function(element, options) {
		_this = this;
		this.slideShow = element;
		this.container = this.slideShow.getElements('.container')[0];

		// Get options from JS and element
		this.options = Object.merge(this.options, options);
		this.setElementOptions(this.options, this.slideShow);

		this.actualSlide = this.options.firstSlide;
		this.nbSlides = this.container.getChildren('.slide').length;

		// Control elements
		this.controls = {
			left: this.slideShow.getElements('.control-left'),
			right: this.slideShow.getElements('.control-right'),
			selector: this.slideShow.getElements('.selector')
		};

		// Create and add events on control elements
		this._buildControls();

		if (this.options.autoSlide && this.options.loop) {
			this._setPeriodical();
		}

		if (this.options.slideOnClick) {
			this.container.addEvent('click', function(e) {
				e.stop();
				_this._slide(_this.options.defaultDirection);
			})
		}

		this.slideWidth = this.slideShow.getWidth();
		this.container.setStyle('width', this.slideWidth * this.nbSlides);
		this.container.setStyle('margin-left', -(this.actualSlide -1) * this.slideWidth);
	},

	/**
	 * Set periodical on the slideshow
	 */
	_setPeriodical: function() {
		var fx = function() {
			_this._slide(_this.options.defaultDirection)
		};

		this.periodicalAnim = fx.periodical(this.options.periodical);

		this.slideShow.addEvent('mouseover', function(e) {
			e.stop();
			clearInterval(_this.periodicalAnim);
		});
		this.slideShow.addEvent('mouseout', function(e) {
			e.stop();
			_this.periodicalAnim = fx.periodical(_this.options.periodical);
		});
	},

	/**
	 * Slide in the specified direction
	 * @param  {String} direction Direction to slide
	 */
	_slide: function(direction) {
		if (!direction) direction = this.options.defaultDirection;

		if (direction == 'right') {
			if (this.actualSlide < this.nbSlides) this.actualSlide++;
			else if (this.options.loop == true) this.actualSlide = 1;
		}
		else if (direction == 'left') {
			if (this.actualSlide > 1 ) this.actualSlide--;
			else if (this.options.loop == true) this.actualSlide = this.nbSlides;
		}

		this._goTo(this.actualSlide);
	},

	/**
	 * Go to specified slide
	 * @param  {Number} number 
	 */
	_goTo: function(number) {
		this.actualSlide = number;

		var marginLeft = -(this.actualSlide -1) * this.slideWidth;
		this.container.set('tween', {transition: window['Fx.Transitions.' + this.options.transition]});
		this.container.tween('margin-left', marginLeft);

		this._resetActive();
	},

	/**
	 * Create different controls
	 */
	_buildControls: function() {
		var _this = this;

		// Right / Left controls
		this.controls.left.each(function(control) {
			control.addEvent('click', function(e) {
				e.stop();
				_this._slide('left');
			});
		});
		this.controls.right.each(function(control) {
			control.addEvent('click', function(e) {
				e.stop();
				_this._slide('right');
			});
		});

		// Keyboard shortcut
		if (this.options.allowKeyboardArrows) {
			$(document.body).addEvent('keyup', function(e) {
				e.stopPropagation();
				if(e.key == 'left') {
					// Left
					_this._slide('left');
				}
				else if(e.key == 'right') {
					// Right
					_this._slide('right');
				}
			})
		}

		// Direct selector
		this.controls.selector.each(function(sel) {
			var model = sel.getFirst().clone();
			sel.empty();

			_this.container.getChildren('.slide').each(function(element, index) {
				model.clone().addEvent('click', function(e) {
					e.stop();
					_this._goTo(index + 1);
				}).inject(sel);
			});
		});

		this._resetActive();
	},

	/**
	 * Set the active slide on selector
	 */
	_resetActive: function() {
		_this = this;
		this.controls.selector.each(function(sel) {
			sel.getChildren().each(function(child) {
				child.removeClass('active');
			});
			sel.getChildren()[_this.actualSlide - 1].toggleClass('active');
		});
	},

	/**
	 * Toggle automatic slideshow
	 */
	_toggleAutoSlide: function() {
		if (this.options.autoSlide) {
			this.options.autoSlide = false;
			clearInterval(this.periodicalAnim);
		}
		else {
			this.options.autoSlide = true;
			var fx = function() { _this._slide(_this.options.defaultDirection); };
			this.periodicalAnim = fx.periodical(this.options.periodical);
		}
	}
})