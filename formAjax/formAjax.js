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
		redirect: null,
		dataContainer: null,
		beforeRequest: function() { return; }
	},

	/**
	 * Create a FormAjax
	 * @constructor
	 * @param  {Element}	form		Form element
	 * @param  {Object}		options		Form options
	 * @param  {Object}		callbacks	
	 */
	initialize: function(form, options, callbacks) {
		var _this = this;
		if (form instanceof HTMLElement) {
			this.form = form;
			this.callbacks = callbacks;

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
					var decodeResponse = JSON.decode(response);
					if (typeof _this.callbacks != 'undefined') {
						var name = _this.form.getAttribute('name');
						if (typeof _this.callbacks[name] == 'function') {
							_this.callbacks[name](decodeResponse);
						}
					}
					return _this.options.onSuccess(decodeResponse);
				},

				onFailure: function() {
					return _this.options.onFailure();
				}
			});
		}
		else if (form instanceof Object) {
			for (var i = form.length - 1; i >= 0; i--) {
				new cowboy.FormAjax(form[i], options, callbacks);
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

			this.options.beforeRequest();

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
			else if(el.getProperty('type') == 'file') {
				data[el.name] = el.files[0];
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

		if (this.options.dataContainer !== null) {
			Object.each(data, function(value, key) {
				_this.uploadReq.append(_this.options.dataContainer + '[' + key + ']', value);
			});
		}
		else {
			Object.each(data, function(value, key) {
				_this.uploadReq.append(key, value);
			});
		}
	}
});
