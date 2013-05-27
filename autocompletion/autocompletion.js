/* 
 * Class cowboy.AutoCompletion
 * Suggest Data by an Ajax request from a database
 *
 * TODO : • best support of "tab" (if a result is selected push it) 
 *        • best support of "return" and keydown ...
          • best support of collection 
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
  initialize: function(input,options) {
    var _this = this;
    this.input = input;
    this.options = Object.merge(this.options, options);

    this.setElementOptions(this.options, this.input, ['collection','label','url','method', 'minChar', 'maxChar']);

    this.select = $(this.input.id+'_select_list') || null;

    // If the list to display the result doesn't exist 
    if(!this.select) {
      this.select = new Element('div',{
        id:this.input.id+'_select_list',
        'class':'input-select'
      });
      this.select.addClass('hidden').addClass('input-select');
      this.select.inject(this.input,'after');
    }
    // Initialize all Events on input
    // Close results on "virtual" blur of input
    window.addEvent('click', this._closeResult.bind(this)); 
    // Get data after a small delay
    this.input.addEvent('keydown:pause(150)', this._getData.bind(this)); 
    // Enter event to validate the tag & prevent default submit()
    this.input.addEvent('keydown:keys(enter)', this._pushSelectedResult.bind(this));
    // Close results and focus the next input
    this.input.addEvent('keydown:keys(tab)', this._closeResult.bind(this));
    // Navigation down direction
    this.input.addEvent('keydown:keys(down)', this._navigate.bind(this)); 
    // Navigation up direction
    this.input.addEvent('keydown:keys(up)', this._navigate.bind(this));
    // Close results
    this.input.addEvent('keydown:keys(esc)', this._closeResult.bind(this));
    // Add Class on mouseenter a result
    this.select.addEvent('mouseenter:relay(li)', function(e) { 
      var li = e.target
      _this.select.getElements('ul li').each(function(eli) {
        if(li==eli) eli.addClass('active');
        else eli.removeClass('active'); // Remove all active on others
        });
      });
    // Remove Class on mouseleave a result
    this.select.addEvent('mouseleave:relay(li)', function(e) { 
      var li = e.target
      _this.select.getElements('ul li').each(function(eli) {
        if(li!=eli) eli.removeClass('active');
      });
    });
    // Add click event on a result to be selected
    this.select.addEvent('click:relay(li)', this._selection.bind(this));
  }
  , _getData: function(e) {
    var _this = this;
    this.select.setStyles({
      top: this.input.offsetTop+this.input.offsetHeight+20,
      left: this.input.offsetLeft,
      width: this.input.offsetWidth-2
    });
    // Check if the keydown is alpha and one char prevent action keydown (esc,enter,shift...)
    if(e.key.length==1 && /^[a-zA-Z0-9]$/.test(e.key)) {
      // If the value has the minimum Char (option)
      if(this.input.value.length>=this.options.minChar) {
        new Request({
          url: this.options.url,
          method: this.options.method,
          data: {
            collection: this.options.collection,
            label: this.options.label,
            value: this.input.value
          },
          onRequest: function() {
            // console.log('Sending search...');
          },
          onSuccess: function(response){
            response = JSON.decode(response);
            if(response.data.length>0) {
              var html = '<ul>';
              response.data.each(function(el) {
                var i=0;
                if(_this.options.maxResult>i) {
                  html += '<li>'+el.label+'</li>';
                  i++;
                }
              });
              html += '</ul>';
              _this.select.set('html',html);
              _this.select.removeClass('hidden');
            }
            else { 
              //console.log('No result');
            }
          }
        }).send();
      }
      else {
        this.select.addClass('hidden');
      }
    }
  }
  // Navigate by keydown and keyup into results
  , _navigate: function(e) {
    e.stop();
    if(e.key=="down") {
      var active = this.select.getElement('.active');
      // check if an result is already selected
      if(active) {
        if(active.getNext('li')) {
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
    if(e.key=="up") {
      var active = this.select.getElement('.active');
      if(active) {
        if(active.getPrevious('li')) {
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
  }
  // Selection a result
  , _selection: function(e) { 
    var inputSelected = e.target.get('text');
    this.input.value = inputSelected;
    this.input.focus();
    this.select.addClass('hidden');
    this._pushSelectedResult(e);
  }
  // Close result
  , _closeResult: function(e) {
    var active = this.select.getElement('.active');
    if(active) { active.removeClass('active'); }
    this.select.addClass('hidden');
  }
  , _pushSelectedResult: function(e) {
    e.stop();
    if(this.input.value != "") {
      var active = this.select.getElement('.active');
      if(active) { this.input.value = active.get('text'); active.removeClass('active'); } // A result selected we push it 
      this.select.empty().addClass('hidden');
    }
  }
});

var getData = function(value,callback) {
  var _this = this;
  new Request({
    url: 'collection.php',
    method:'post',
    data: {
      collection:_this.options.collection,
      label:_this.options.label,
      value:value
    },
    onRequest: function() {
      // console.log('Sending search...');
    },
    onSuccess: function(response){
      response = JSON.decode(response);
      callback();
    }
  }).send();
}

function callback() { console.log('truc'); }

