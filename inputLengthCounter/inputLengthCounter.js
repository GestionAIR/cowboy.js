/**
 * Make an counter inside a label for un input/textarea 
 * @class cowboy.InputFile
 * @implements {cowboy.Options}
 * @todo Support Multiple Files
 */
cowboy.InputLengthCounter = new Class({
	Implements: cowboy.Options,
	options: {
		textNoMore:"(Sorry, make it shorter!)",
		textOneMore:"({count} remaining char)",
		textCounting:"({count} ramaining chars)"
	},

	/**
	 * Constructor
	 * @constructor
	 * @param  {Element} counter   Dom element (ex: span) inside a label related to a field (input or textarea) with the correct "for" attribute. A max attribute "maxlength" should be  defined on the targeted element
	 * @param  {Object} options  Options
	 */
	initialize: function(counter, options) {
		var _this = this;
		this.counter = counter;
		this.options = Object.merge(this.options, options);

		// Set Options and overload options by properties in the field
		this.setElementOptions(this.options, counter);

		// Get the field connected to the counter (defined inside the label by the "for" attribute 
		this.field = $(this.counter.getParent().getProperty('for'));
		
		// Set the maxLength defined by the "maxlength" attribute of the field
		var maxLength = this.field.getProperty('maxlength').toInt();

		// Set the current counter of the value of the counter at loading start
		this.counter.set('text',this.text(maxLength-this.field.value.length));
		
		// Set events on the field to refresh the counter
		this.field.addEvents({
			keyup: function(){
				_this.counter.set('text',_this.text(maxLength-_this.field.value.length));
			},
			blur: function(){
				_this.counter.set('text',_this.text(maxLength-_this.field.value.length));
			}
		});
	},

	/**
	 * Return the right text containing the counter.
	 * @method text
	 */
	text: function(count) {
		// textNoMore : field is full 
		if(count=="0") return this.options.textNoMore.substitute({"count":count});
		// textOneMore : field can accept one more char
		else if (count=="1") return this.options.textOneMore.substitute({"count":count});
		// textCounting : field can accept more char
		else return this.options.textCounting.substitute({"count":count});
	}
});