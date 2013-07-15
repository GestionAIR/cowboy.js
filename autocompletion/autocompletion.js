/* 
 * Class cowboy.AutoCompletion
 * Suggest Data by an Ajax request from a database
 *
 * TODO :• best support of collection 
					• this.collection = option.collection 
						- Array passé dans l'option
						- Function passé dans l'option
						- Rien == getData interne
 */
cowboy.AutoCompletion = new Class({
	Implements: cowboy.Options,
	options: {
		minChar: 1,
		maxResult: 5,
		collection: null,
		label: null,
		url: null,
		method: 'post'
	},

	/**
	 * Constructor
	 * @param  {Element}	input		Select element
	 * @param  {Object}		options		Complementary options
	 */
	initialize: function(input, options) {
		var _this = this;
		this.input = input;
		this.options = Object.merge(this.options, options);

		this.setElementOptions(this.options, this.input);

		this.select = $(this.input.id + '_select_list') || null;

		// If the list to display the result doesn't exist 
		if (!this.select) {
			this.select = new Element('div', {
				id:this.input.id + '_select_list',
				'class': 'input-select'
			});
			this.select.addClass('hidden').addClass('input-select');
			this.select.inject(this.input, 'after');
		}
		// Initialize all Events on input
		// Close results on "virtual" blur of input
		window.addEvent('click', this.closeResult.bind(this));
		// Get data after a small delay
		this.input.addEvent('keydown:pause(150)', this.getData.bind(this));
		// Enter event to validate the tag & prevent default submit()
		this.input.addEvent('keydown:keys(enter)', this.pushSelectedResult.bind(this));
		// Close results and focus the next input
		this.input.addEvent('keydown:keys(tab)', function(e) {
			if (_this.select.getElement('.active') !== null) {
				var inputSelected = _this.select.getElement('.active');
				_this.input.value = inputSelected;
				_this.input.focus();
				_this.select.addClass('hidden');
				_this.pushSelectedResult(e);
			}
			_this.closeResult();
		});
		this.input.addEvent('keydown:keys(backspace)', this.getData.bind(this));
		// Navigation down direction
		this.input.addEvent('keydown:keys(down)', this.navigate.bind(this));
		// Navigation up direction
		this.input.addEvent('keydown:keys(up)', this.navigate.bind(this));
		// Close results
		this.input.addEvent('keydown:keys(esc)', this.closeResult.bind(this));
		// Add Class on mouseenter a result
		this.select.addEvent('mouseenter:relay(li)', function(e) {
			var li = e.target;
			_this.select.getElements('ul li').each(function(eli) {
				if (li == eli) eli.addClass('active');
				else eli.removeClass('active'); // Remove all active on others
			});
		});
		// Remove Class on mouseleave a result
		this.select.addEvent('mouseleave:relay(li)', function(e) {
			var li = e.target;
			_this.select.getElements('ul li').each(function(eli) {
				if (li != eli) eli.removeClass('active');
			});
		});
		// Add click event on a result to be selected
		this.select.addEvent('click:relay(li)', this.selection.bind(this));
	},

	/**
	 * Get the data from AJAX transaction
	 * @param  {Event}	e	Keyboard event
	 */
	getData: function(e) {
		var _this = this;
		this.select.setStyles({
			top: this.input.offsetTop + this.input.offsetHeight + 20,
			left: this.input.offsetLeft,
			width: this.input.offsetWidth - 2
		});
		// Check if the keydown is alpha and one char prevent action keydown (esc,enter,shift...)
		if ((e.key.length == 1 && /^[a-zA-Z0-9]$/.test(e.key)) || e.key == 'backspace') {
			// If the value has the minimum Char (option)
			if (this.input.value.length >= this.options.minChar) {
				new Request({
					url: this.options.url,
					method: this.options.method,
					data: {
						collection: this.options.collection,
						label: this.options.label,
						value: this.input.value
					},
					onSuccess: function(response) {
						response = JSON.decode(response);
						var html = '<ul>';
						var i = 0;
						while(i < _this.options.maxResult) {
							if (!response.data[i]) break;
							html += '<li>' + response.data[i].label + '</li>';
							i++;
						}
						html += '</ul>';
						_this.select.set('html', html);
						_this.select.removeClass('hidden');
					}
				}).send();
			}
			else {
				this.select.addClass('hidden');
			}
		}
	},

	/**
	 * Navigate by keydown and keyup into results
	 * @param  {Event}	e	Event triggered by keydown/keyup
	 */
	navigate: function(e) {
		e.stop();
		var active;
		if (e.key == "down") {
			active = this.select.getElement('.active');
			// check if an result is already selected
			if (active) {
				if (active.getNext('li')) {
					active.removeClass('active');
					active.getNext().addClass('active');
				}
				else {
					active.removeClass('active');
					this.select.getFirst('ul li').addClass('active');
				}
			}
			// push an active on first Element of the list
			else {
				this.select.getFirst('ul li').addClass('active');
			}
		}
		if (e.key == "up") {
			active = this.select.getElement('.active');
			if (active) {
				if (active.getPrevious('li')) {
					active.removeClass('active');
					active.getPrevious().addClass('active');
				}
				else {
					active.removeClass('active');
					this.select.getLast('ul li').addClass('active');
				}
			}
			else {
				this.select.getLast('ul li').addClass('active');
			}
		}
	},

	/**
	 * Select a result
	 * @param  {Event}	e	Keyboard event
	 */
	selection: function(e) {
		var inputSelected = e.target.get('text');
		this.input.value = inputSelected;
		this.input.focus();
		this.select.addClass('hidden');
		this.pushSelectedResult(e);
	},

	/**
	 * Close result list
	 */
	closeResult: function() {
		var active = this.select.getElement('.active');
		if (active) active.removeClass('active');
		this.select.addClass('hidden');
	},

	/**
	 * Set value from selected result
	 * @param  {Event}	e	Event
	 */
	pushSelectedResult: function(e) {
		e.stop();
		if (this.input.value !== "") {
			var active = this.select.getElement('.active');
			if (active) { // A result selected we push it
				this.input.value = active.get('text');
				active.removeClass('active');
			}
			this.select.empty().addClass('hidden');
		}
	}
});

/*
DRAFT

var getData = function(value, callback) {
	var _this = this;
	new Request({
		url: 'collection.php',
		method:'post',
		data: {
			collection: _this.options.collection,
			label: _this.options.label,
			value: value
		},
		onRequest: function() {
			//console.log('Sending search...');
		},
		onSuccess: function(response) {
			response = JSON.decode(response);
			callback();
		}
	}).send();
}

function callback() {
	console.log('truc');
}
*/
