/* 
 * Class cowboy.InputFile
 * Make an input[type=file] 
 *
 * TODO : Support list of requiredType
 *        Support Multiple Files
 */
cowboy.InputFile = new Class({
	Implements:cowboy.Options,
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
		this.options = Object.merge(this.options, options);

		// Set Options and overload options by properties in the input element
		this.setElementOptions(this.options, input, ['minSize', 'maxSize', 'requiredType']);

		// ReBuild the Element
		var inputFile = new Element('div',{"Class":"inputfile"});
		// Inject the original input file into the contener "inputFile"
		inputFile.inject(this.input,'after');
		this.input.inject(inputFile);
		// Create the fake input file
		var fakeInputFileContener = new Element('div',{"Class":"fakeinputfile"});
		this.fakeInputFile = new Element('input',{"type":"text","readonly":"readonly"});
		var icon = new Element('span',{"Class":"directory"});
		fakeInputFileContener.inject(inputFile);
		this.fakeInputFile.inject(fakeInputFileContener);
		icon.inject(fakeInputFileContener);

		// Add Event to control the value
		this.input.addEvent('change', _this._check.bind(_this));
		// Add Events on fake input and icon to focus the input
    	this.fakeInputFile.addEvent('focus',function(e){ 
    		e.stop(); 
    		_this.input.focus(); 
    		_this.input.click();
    		$$('html')[0].focus();
    	});
    	icon.addEvent('click',function(){_this.input.click();});
	}
	, _check: function() {
		var _this = this;
		// with FileAPI
		if(window.File && window.Blob) { 
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
