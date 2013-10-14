/**
 * Cowboy is a powerful extension to Mootools Framework
 * @namespace cowboy namespace
 */
var cowboy = {};

/**
 * Extension to the Mootools Options
 * @class cowboy.Options
 * @implements {Options}
 */
cowboy.Options = new Class({
	Implements: Options,

	/**
	 * Extension to setOptions to get parameters from the element
	 * @method setElementOptions
	 * @param  {Object} options Options of the class
	 * @param  {Element} element Element used by the class
	 */
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
 * @class cowboy.Request
 * @extends {Request}
 * @link By mloberg : https://gist.github.com/mloberg/1342473
 */
cowboy.Request = new Class({

	Extends: Request,

	options: {
		emulation: false,
		urlEncoded: false
	},

	/**
	 * Constructor
	 * @constructor
	 * @param  {Object} options Options for the request
	 */
	initialize: function(options) {
		console.log(options);
		this.xhr = new Browser.Request();
		this.xhr.addEventListener("loadstart", options.onLoadStart, false);
		this.xhr.addEventListener("progress", options.onProgress, false);
		this.formData = new FormData();
		this.setOptions(options);
		this.headers = this.options.headers;
	},

	/**
	 * Append data to the request
	 * @method append
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
	 * @method reset
	 * @return {[type]} [description]
	 */
	reset: function() {
		this.formData = new FormData();
	},

	/**
	 * Send the request
	 * @method send
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
