/* 
 * Class cowboy.InputFile
 * Make an input[type=file] 
 *
 * TODO : Support list of requiredType
 *        Support Multiple Files
 */
cowboy.InputFile = new Class({
	Implements:Options,
	options: {
		minSize:4000,
		minSizeMessage:"Votre fichier doit faire plus de 4 Ko",
		maxSize:5000000,
		maxSizeMessage:"Votre fichier doit faire moins de 5 Mo",
		requiredType:null,
		requiredTypeMessage:"",
	}
	, initialize: function(input,options) {
		var _this = this;
		this.input = input;

		// Set Options and overload options by properties in the input element
		this._setOptions(options);

		// ReBuild the Element
		var inputFile = new Element('div',{"Class":"inputfile"});
		// Inject the original input file into the contener "inputFile"
		inputFile.inject(this.input,'after');
		this.input.inject(inputFile);
		// Create the fake input file
		var fakeInputFileContener = new Element('div',{"Class":"fakeinputfile"});
		this.fakeInputFile = new Element('input',{"type":"text"});
		var icon = new Element('span',{"Class":"directory"});
		fakeInputFileContener.inject(inputFile);
		this.fakeInputFile.inject(fakeInputFileContener);
		icon.inject(fakeInputFileContener);

		// Add Event to control the value
		this.input.addEvent('change', _this._check.bind(_this));
	}
	, _setOptions: function(options) {
		this.setOptions(options);
		// Define minimum size of the file
		if(this.input.getProperty('data-minSize')) {
			this.options.minSize = this.input.getProperty('data-minSize');
		}
		// Define maximum size of the file
		if(this.input.getProperty('data-maxSize')) {
			this.options.maxSize = this.input.getProperty('data-maxSize');
		}
		// Require file's type  
		if(this.input.getProperty('data-requiredType')) {
			this.options.requiredType = this.input.getProperty('data-requiredType');
		}
	}
	, _check: function() {
		var _this = this;
		// with FileAPI
		if(window.File && window.FileReader && window.Blob) { 
			var file = this.input.files[0];
			// Check Type
			if((this.options.requiredType==null || file.type==this.options.requiredType)
				 && file.size>=this.options.minSize && file.size<=this.options.maxSize) {
				this.fakeInputFile.value = file.name; // Show filename
				this.fakeInputFile.removeClass('log-error').addClass('log-validated');
			}
			// Show Warnings
			else {
				if(this.options.requiredType!=null && file.type!=this.options.requiredType) {
					this.fakeInputFile.value = this.options.requiredTypeMessage;
					this.fakeInputFile.removeClass('log-validated').addClass('log-error');
				}
				if(file.size<this.options.minSize) {
					this.fakeInputFile.value = this.options.minSizeMessage;
					this.fakeInputFile.removeClass('log-validated').addClass('log-error');
				}
				if(file.size>this.options.maxSize) {
					this.fakeInputFile.value = this.options.maxSizeMessage;
					this.fakeInputFile.removeClass('log-validated').addClass('log-error');
				}
			}
		}
		// Fallback for old browsers
		else if(this.value) this.fakeInputFile.value = e.value;
	}
});
