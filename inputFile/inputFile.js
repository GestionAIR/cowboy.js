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

		// Rebuild the Element
		var inputFile = new Element('div', {"Class": "inputfile"});

		// Inject the original input file into the contener "inputFile"
		inputFile.inject(this.input, 'after');
		this.input.inject(inputFile);

		// Create the fake input file
		var fakeInputFileContener = new Element('div', {"Class": "fakeinputfile"});
		this.fakeInputFile = new Element('input', {"type": "text","readonly": "readonly"});
		var icon = new Element('span', {"Class": "directory"});
		fakeInputFileContener.inject(inputFile);
		this.fakeInputFile.inject(fakeInputFileContener);
		icon.inject(fakeInputFileContener);

		// Add Event to control the value
		this.input.addEvent('change', _this.check.bind(_this));

		// Add Events on fake input and icon to focus the input
		this.fakeInputFile.addEvent('focus', function (e) {
			e.stop();
			_this.input.focus();
			_this.input.click();
			$$('html')[0].focus();
		});
		icon.addEvent('click', function () { _this.input.click(); });
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
				this.fakeInputFile.value = file.name; // Show filename
				this.fakeInputFile.removeClass('log-error').addClass('log-validated');
			}
			// Show Warnings
			else {
				if (this.options.requiredType !== null && (file.type != this.options.requiredType || !this.options.requiredType.contains(file.type))) {
					this.fakeInputFile.value = this.options.requiredTypeMessage;
					this.fakeInputFile.removeClass('log-validated').addClass('log-error');
				}
				if (file.size < this.options.minSize) {
					this.fakeInputFile.value = this.options.minSizeMessage;
					this.fakeInputFile.removeClass('log-validated').addClass('log-error');
				}
				if (file.size > this.options.maxSize) {
					this.fakeInputFile.value = this.options.maxSizeMessage;
					this.fakeInputFile.removeClass('log-validated').addClass('log-error');
				}
			}
		}

		// Fallback for old browsers
		else if (this.value) this.fakeInputFile.value = e.value;
	}
});
