cowboy.FormAjax = new Class ({
	Implements: cowboy.Options,

	options: {
		invalidFieldMessage: 'Please fill this field',
		redirectDelay: 1000,
		onRequest: null,
		onSuccess: null,
		onFailure: null,
		callback: null,
		redirect: null
	},

	initialize: function(form, options) {
		this.form = form;

		this.options = Object.merge(this.options, options);

		// Set Options and overload options by properties in the form
		this.setElementOptions(this.options, form);

		this.form.setProperty('autocomplete', 'off');
		this.form.addEvent('submit', this._submit.bind(this));

		var _this = this;

		this.form.getElements('.required').each(function(el){
			el.addEvent('focus', _this._focus);
			el.addEvent('blur', _this._blur.bind(_this));
		});

	},

	_submit: function(e) {
		e.stop();

		this._showErrors();

		if (this.form.getElements('.error').length == 0) {
			this.data = this._getFormData();
			this.url = this.form.getProperty('action');

			this._sendFormAjax();
		}
	},

	_focus: function(e){
		if(e.target.hasClass('error')) {
			this.removeClass('error');
			this.erase('placeholder');
		}
	},

	_blur: function(e){
		if(e.target.value=='') {
			e.target.setProperty('placeholder',this.options.invalidFieldMessage);
			e.target.addClass('error');
		}
	},

	_showErrors: function() {
		_this = this;
		this.form.getElements('.required').each(function(el) {
			if (el.value == '') {
				el.addClass('error');
				el.setProperty('placeholder',_this.options.invalidFieldMessage);
			}
		});
	},

	_getFormData: function() {
		var data = {};

		this.form.getElements('input[name]').each(function(el) {
			if (el.getProperty('type') == 'checkbox') {
				if (el.checked == true) {
					data[el.name] = el.value;
				}
				else {
					data[el.name] = 0;
				}
			}
			else if (el.getProperty('type') == 'radio') {
					if (el.checked == true) {
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

	_sendFormAjax: function() {
		var _this = this;

		new Request({
			url: this.url,
			method: 'post',
			data: this.data,

			onRequest: function() {
				if (_this.options.onRequest !== null) {
					eval(_this.options.onRequest + '()');
				}
			},

			onSuccess: function(response) {

				_this.response = JSON.decode(response);

				if (_this.options.onSuccess != null) {
					eval(_this.options.onSuccess + '(' + response + ')');
				}

				if (_this.options.callback != null) {
					eval(_this.options.callback + '(' + response + ')');
				}

				if (_this.options.redirect != null && _this.options.redirect != 'stop') {
					(function() { window.location = _this.options.redirect; }).delay(_this.options.redirectDelay);
				}
			},

			onFailure: function() {
				if (_this.options.onFailure != null) {
					eval(_this.options.onFailure + '()');
				}
			}
		}).send();
	}
});
