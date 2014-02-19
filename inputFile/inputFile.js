/**
 * Make an input[type=file] 
 * @class cowboy.InputFile
 * @implements {cowboy.Options}
 * @todo Support Multiple Files
 */
cowboy.InputFile = new Class({
	Implements: cowboy.Options,
	options: {
		minSize: 4000,
		minSizeMessage: "File size needs to be more than {size}",
		maxSize: 5000000,
		maxSizeMessage: "File size needs to be less than {size}",
		requiredType: null,
		requiredTypeMessage: "File type is not correct",
		classBtn: "btn btn-primary"
	},

	/**
	 * Constructor
	 * @constructor
	 * @param  {Element} input   Input file to use
	 * @param  {Object} options  Options
	 */
	initialize: function(input, options) {
		var _this = this;
		this.input = input;
		this.options = Object.merge(this.options, options);

		// Set Options and overload options by properties in the input element
		this.setElementOptions(this.options, input);

		// Set filesize error messages
		var minSizeStr = ((this.options.minSize > 1000000) ? String(Math.round(this.options.minSize / 1000000)) + "Mo" : String(Math.round(this.options.minSize / 1000)) + "Ko");
		var maxSizeStr = ((this.options.maxSize > 1000000) ? String(Math.round(this.options.maxSize / 1000000)) + "Mo" : String(Math.round(this.options.maxSize / 1000)) + "Ko");
		this.options.minSizeMessage = this.options.minSizeMessage.substitute({"size": minSizeStr});
		this.options.maxSizeMessage = this.options.maxSizeMessage.substitute({"size": maxSizeStr});

		// Hide the input file
		this.input.setStyle('display','none');

		// Rebuild the Element
		var inputGroup = new Element('div', {"class": "input-group"});

		// Creates Elements for faking input and an upload button
		this.inputText = new Element('input', {
			"type": "text",
			"readonly": "readonly",
			"class":"form-control"
		});
		var inputGroupBtn = new Element('span',{"class":"input-group-btn"});
		var button = new Element('button',{
			"class":this.options.classBtn,
			"type":"button"
		});

		// Inject elements
		inputGroup.inject(this.input,'after');
		this.inputText.inject(inputGroup);
		button.inject(inputGroupBtn);
		inputGroupBtn.inject(inputGroup);

		// Add Event to control the value
		this.input.addEvent('change', _this.check.bind(_this));

		// Add Events to control the input file
		button.addEvent('click',function(e) { _this.input.click(); });

		// Add Events on fake input and icon to focus the input
		this.inputText.addEvent('focus', function (e) {
			e.stop();
			_this.input.focus();
			_this.input.click();
			$$('html')[0].focus();
		});
	},
	
	/**
	 * Check if file meets expectations
	 * @method check
	 */
	check: function() {
		// with FileAPI
		if (window.File && window.Blob) {
			var file = this.input.files[0];

			// Check Type
			if ((this.options.requiredType === null || file.type == this.options.requiredType || this.options.requiredType.contains(file.type)) && file.size >= this.options.minSize && file.size <= this.options.maxSize) {
				this.inputText.value = file.name; // Show filename
				this.inputText.removeClass('log-error').addClass('log-success');
			}
			// Show Warnings
			else {
				if (this.options.requiredType !== null && (file.type != this.options.requiredType || !this.options.requiredType.contains(file.type))) {
					this.inputText.value = this.options.requiredTypeMessage;
					this.inputText.removeClass('log-success').addClass('log-error');
				}
				if (file.size < this.options.minSize) {
					this.inputText.value = this.options.minSizeMessage;
					this.inputText.removeClass('log-success').addClass('log-error');
				}
				if (file.size > this.options.maxSize) {
					this.inputText.value = this.options.maxSizeMessage;
					this.inputText.removeClass('log-success').addClass('log-error');
				}
			}
		}

		// Fallback for old browsers
		else if (this.value) this.inputText.value = e.value;
	}
});
