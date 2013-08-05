/**
 * AJAX form creation
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
	 * @param  {Element}	form		Form element
	 * @param  {Object}		options		Form options
	 */
	initialize: function(form, options) {
		this.form = form;
		var _this = this;

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
	},

	/**
	 * Submit the form
	 * @param  {Event}	e	Event that triggers the submit
	 */
	submit: function(e) {
		e.stop();

		this.showErrors();

		if (this.form.getElements('.error').length === 0) {
			this.getFormData();

			this.uploadReq.send({ url: this.form.getProperty('action') });
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
