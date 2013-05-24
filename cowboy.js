// Define cowboy.js namespace
var cowboy = {};

cowboy.Options = new Class({
	Implements:Options,
	setElementOptions: function(options, element, listProperties) {
		listProperties.each(function(property) {
			if(element.getProperty('data-' + property)) {
				options[property] = element.getProperty('data-' + property);
			}
		});
		this.setOptions(options);
	}
});
