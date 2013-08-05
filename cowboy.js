// Define cowboy.js namespace
var cowboy = {};

cowboy.Options = new Class({
	Implements: Options,
	setElementOptions: function(options, element) {
		Object.keys(Object.clone(options)).each(function(property) {
			if(element.getProperty('data-' + property)) {
				options[property] = element.getProperty('data-' + property);
			}
		});
		this.setOptions(options);
	}
});

/**
 * Extension to Mootools Request to handle file upload
 * @description From mloberg
 * @link https://gist.github.com/mloberg/1342473
 */
cowboy.Request = new Class({

	Extends: Request,

	options: {
		emulation: false,
		urlEncoded: false
	},

	/**
	 * Constructor
	 * @param  {Object} options Options for the request
	 */
	initialize: function(options) {
		this.xhr = new Browser.Request();
		this.formData = new FormData();
		this.setOptions(options);
		this.headers = this.options.headers;
	},

	/**
	 * Append data to the request
	 * @param  {String} key		Key
	 * @param  {Mixed} value	Value associated to the key
	 * @return {cowboy.Request} Itself
	 */
	append: function(key, value) {
		this.formData.append(key, value);
		return this.formData;
	},

	/**
	 * Reset the form
	 * @return {[type]} [description]
	 */
	reset: function() {
		this.formData = new FormData();
	},

	/**
	 * Send the request
	 * @param  {Object} options Options for the request
	 * @return {cowboy.Request} Itself
	 */
	send: function(options) {
		var url = options.url || this.options.url;
		this.options.isSuccess = this.options.isSuccess || this.isSuccess;
		this.running = true;

		var xhr = this.xhr;
		xhr.open('POST', url, true);
		xhr.onreadystatechange = this.onStateChange.bind(this);
		
		Object.each(this.headers, function(value, key){
			try {
				xhr.setRequestHeader(key, value);
			}
			catch(e) {
				this.fireEvent('exception', [key, value]);
			}
		}, this);

		this.fireEvent('request');
		xhr.send(this.formData);
		if(!this.options.async) this.onStateChange();
		if(this.options.timeout) this.timer = this.timeout.delay(this.options.timeout, this);
		return this;
	}
});
