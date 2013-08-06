/* 
 * Load data by an Ajax request into a Select Element
 * @class cowboy.SelectLoadData
 * @implements {cowboy.Options}
 */
cowboy.SelectLoadData = new Class({
	Implements: cowboy.Options,
	options: {
		list: null,
		collection: null,
		label: null,
		value: "id",
		labelName: "label",
		selected: null,
		url: null,
		method: "post"
	},

	/**
	 * Constructor
	 * @constructor
	 * @param  {Element} select  Select to use
	 * @param  {Object} options Options passed to the class
	 */
	initialize: function(select, options) {
		this.select = select;
		// Overwrite options passed by JS
		this.options = Object.merge(this.options, options);
		// Overwrite options passed by Element's properties
		this.setElementOptions(this.options, this.select);
		// Detect if the list is directly given in the options
		if (this.options.list) this.pushData(this.options.list, this.select);
		else this.getData();
	},

	/**
	 * Retrieve the collection of data by an Ajax Method
	 * @method getData
	 */
	getData: function() {
		var _this = this;
		new Request({
			url: this.options.url,
			method: this.options.method,
			data: {
				"collection": this.options.collection,
				"label": this.options.label
			},
			onSuccess: function(response){
				response = JSON.decode(response);
				_this.pushData(response[_this.options.collection], _this.select);
			}
		}).send();
	},

	/**
	 * Create all options into the select element
	 * @method pushData
	 * @param  {Array} list   List of options
	 * @param  {Element} select Select to fill
	 */
	pushData: function(list, select) {
		var _this = this;
		// Option : you can choose an option of the list to be selected by default
		var selectedValue = this.options.selected;
		// For each element of the list 
		list.each(function (el) {
			if(!el[_this.options.labelName]) el[_this.options.labelName] = el[_this.options.value];
			var option = new Element('option', {
				'value': el[_this.options.value],
				'text': el[_this.options.labelName]
			});
			if (el[_this.options.value] == selectedValue) option.setProperty('selected', 'selected');
			option.inject(select);
		});
	}
});
