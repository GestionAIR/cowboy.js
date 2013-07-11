/**
 * AJAX form creation
 */
cowboy.FormAjax = new Class ({
	Implements: cowboy.Options,

	options: {
		invalidFieldMessage: 'Please fill this field',
		redirectDelay: 1000,
		onRequest: null,
		onSuccess: null,
		onFailure: null,
		redirect: null
	},

	/**
	 * Create a FormAjax
	 * @param  {Element}	form		Form element
	 * @param  {Object}		options		Form options
	 * @param  {Function}	callback	Callback
	 */
	initialize: function(form, options, callback) {
		this.form = form;

		this.options = Object.merge(this.options, options);

		// Set Options and overload options by properties in the form
		this.setElementOptions(this.options, form);

		this.form.setProperty('autocomplete', 'off');
		this.form.addEvent('submit', this.submit.bind(this));

		var _this = this;

		this.form.getElements('.required').each(function(el){
			el.addEvent('focus', _this.focus);
			el.addEvent('blur', _this.blur.bind(_this));
		});

		if (typeof callback == 'function') this.callback = callback;
		else this.callback = null;
	},

	/**
	 * Submit the form
	 * @param  {Event}	e	Event that triggers the submit
	 */
	submit: function(e) {
		e.stop();

		this.showErrors();

		if (this.form.getElements('.error').length === 0) {
			this.data = this.getFormData();
			this.url = this.form.getProperty('action');

			this.sendFormAjax();
		}
	},

	/**
	 * Event triggered on input focus
	 * @param  {Event}	e	Event when an input is focused
	 */
	focus: function(e){
		if(e.target.hasClass('error')) {
			this.removeClass('error');
			this.erase('placeholder');
		}
	},

	/**
	 * Event triggered on input blur
	 * @param  {Event}	e	Event when an input is blured
	 */
	blur: function(e){
		if (e.target.value === '') {
			e.target.setProperty('placeholder',this.options.invalidFieldMessage);
			e.target.addClass('error');
		}
	},

	/**
	 * Show the form errors
	 */
	showErrors: function() {
		_this = this;
		this.form.getElements('.required').each(function(el) {
			if (el.value === '') {
				el.addClass('error');
				el.setProperty('placeholder',_this.options.invalidFieldMessage);
			}
		});
	},

	/**
	 * Get data to submit
	 * @return	{Object}	Data
	 */
	getFormData: function() {
		var data = {};

		this.form.getElements('input[name]').each(function(el) {
			if (el.getProperty('type') == 'checkbox') {
				if (el.checked === true) {
					data[el.name] = el.value;
				}
				else {
					data[el.name] = 0;
				}
			}
			else if (el.getProperty('type') == 'radio') {
				if (el.checked === true) {
					data[el.name] = el.value;
				}
			}
			else {
				data[el.name] = el.value;
			}
		});

		this.form.getElements('select[name]').each(function(el){
			data[el.name] = el.value;
		});

		this.form.getElements('textarea[name]').each(function(el){
			data[el.name] = el.value;
		});

		return data;
	},

	/**
	 * Send data in AJAX
	 */
	sendFormAjax: function() {
		var _this = this;

		new Request({
			url: this.url,
			method: 'post',
			data: this.data,

			onRequest: function() {
				if (_this.options.onRequest !== null) {
					window[_this.options.onRequest]();
				}
			},

			onSuccess: function(response) {

				_this.response = JSON.decode(response);

				if (_this.options.onSuccess !== null) {
					window[_this.options.onSuccess](JSON.parse(response));
				}

				if (_this.callback) {
					_this.callback(JSON.parse(response));
				}

				if (_this.options.redirect !== null && _this.options.redirect != 'stop') {
					(function() { window.location = _this.options.redirect; }).delay(_this.options.redirectDelay);
				}
			},

			onFailure: function() {
				if (_this.options.onFailure !== null) {
					window[_this.options.onFailure](JSON.parse());
				}
			}
		}).send();
	}
});
