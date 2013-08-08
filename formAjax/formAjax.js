/**
 * AJAX form creation
 * @class cowboy.FormAjax
 * @implements {cowboy.Options}
 */
cowboy.FormAjax = new Class ({
	Implements: cowboy.Options,

	options: {
		invalidFieldMessage: 'Please fill this field',
		redirectDelay: 1000,
		onRequest: function() { return; },
		onSuccess: function(response) { return; },
		onFailure: function() { return; },
		redirect: null
	},

	/**
	 * Create a FormAjax
	 * @constructor
	 * @param  {Element}	form		Form element
	 * @param  {Object}		options		Form options
	 */
	initialize: function(form, options) {
		var _this = this;
		if (form instanceof HTMLElement) {
			this.form = form;

			this.options = Object.merge(this.options, options);

			// Set Options and overload options by properties in the form
			this.setElementOptions(this.options, form);

			this.form.setProperty('autocomplete', 'off');
			this.form.addEvent('submit', this.submit.bind(this));

			this.form.getElements('.required').each(function(el){
				el.addEvent('focus', _this.focus);
				el.addEvent('blur', _this.blur.bind(_this));
			});

			this.uploadReq = new cowboy.Request({
				onRequest: function() {
					return _this.options.onRequest();
				},

				onSuccess: function(response) {
					return _this.options.onSuccess(JSON.decode(response));
				},

				onFailure: function() {
					return _this.options.onFailure();
				}
			});
		}
		else if (form instanceof Object) {
			for (var i = form.length - 1; i >= 0; i--) {
				new cowboy.FormAjax(form[i], options);
			}
		}
	},

	/**
	 * Submit the form
	 * @method submit
	 * @param  {Event}	e	Event that triggers the submit
	 */
	submit: function(e) {
		e.stop();

		this.showErrors();

		if (this.form.getElements('.error').length === 0) {
			this.getFormData();

			this.uploadReq.send({ url: this.form.getProperty('action') });
		}

		this.uploadReq.reset();
	},

	/**
	 * Event triggered on input focus
	 * @method focus
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
	 * @method blur
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
	 * @method showErrors
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
	 * @method getFormData
	 */
	getFormData: function() {
		var _this = this;

		this.form.getElements('input[name]').each(function(el) {
			if (el.getProperty('type') == 'checkbox') {
				if (el.checked === true) {
					_this.uploadReq.append(el.name, el.value);
				}
				else {
					_this.uploadReq.append(el.name, 0);
				}
			}
			else if (el.getProperty('type') == 'radio') {
				if (el.checked === true) {
					_this.uploadReq.append(el.name, el.value);
				}
			}
			else if(el.getProperty('type') == 'file') {
				_this.uploadReq.append(el.name, el.files[0]);
			}
			else {
				_this.uploadReq.append(el.name, el.value);
			}
		});

		this.form.getElements('select[name]').each(function(el){
			_this.uploadReq.append(el.name, el.value);
		});

		this.form.getElements('textarea[name]').each(function(el){
			_this.uploadReq.append(el.name, el.value);
		});
	}
});
