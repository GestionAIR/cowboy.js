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
  initialize: function(input,option) {
    var _this = this;
    this.input = input;
    // Number of char to start the search
    this.minChar = option.minChar || 1;
    // Maximum number of result to display 
    this.maxResult = option.maxResult || 5;
    this.select = $(_this.input.id+'_select_list') || null;
    // The collection of data (ex : name of a table from a database)
    this.collection = input.getProperty('data-collection');
    // The property (ex : name of a column from the table selected)
    this.label = input.getProperty('data-label');

    // If the list to display the result doesn't exist 
    if(!this.select) {
      this.select = new Element('div',{
        id:this.input.id+'_select_list',
        'class':'input-select'
      });
      this.select.addClass('hidden').addClass('input-select');
      this.select.inject(_this.input,'after');
    }
    // Initialize all Events on input
    // Close results on "virtual" blur of input
    window.addEvent('click', _this._closeResult.bind(_this)); 
    // Get data after a small delay
    this.input.addEvent('keydown:pause(150)', _this._getData.bind(_this)); 
    // Enter event to validate the tag & prevent default submit()
    this.input.addEvent('keydown:keys(enter)', _this._pushSelectedResult.bind(_this));
    // Close results and focus the next input
    this.input.addEvent('keydown:keys(tab)', _this._closeResult.bind(_this));
    // Navigation down direction
    this.input.addEvent('keydown:keys(down)', _this._navigate.bind(_this)); 
    // Navigation up direction
    this.input.addEvent('keydown:keys(up)', _this._navigate.bind(_this));
    // Close results
    this.input.addEvent('keydown:keys(esc)', _this._closeResult.bind(_this));
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
    this.select.addEvent('click:relay(li)', _this._selection.bind(_this));
  }
  , _getData: function(e) {
    var _this = this;
    this.select.setStyles({
      top:_this.input.offsetTop+_this.input.offsetHeight+20,
      left:_this.input.offsetLeft,
      width:_this.input.offsetWidth-2
    });
    // Check if the keydown is alpha and one char prevent action keydown (esc,enter,shift...)
    if(e.key.length==1 && /^[a-zA-Z0-9]$/.test(e.key)) {
      // If the value has the minimum Char (option)
      if(this.input.value.length>=this.minChar) {
        new Request({
          url: 'collection.php',
          method:'post',
          data: {
            collection:_this.collection,
            label:_this.label,
            value:_this.input.value
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
                if(_this.maxResult>i) {
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
        _this.select.addClass('hidden');
      }
    }
  }
  // Navigate by keydown and keyup into results
  , _navigate: function(e) {
    e.stop();
    var _this = this;
    if(e.key=="down") {
      var active = _this.select.getElement('.active');
      // check if an result is already selected
      if(active) {
        if(active.getNext('li')) {
          active.removeClass('active');
          active.getNext().addClass('active');
        }
        else {
          active.removeClass('active');
          _this.select.getFirst('ul li').addClass('active');
        }
      }
      // push an active on first Element of the list
      else { 
        _this.select.getFirst('ul li').addClass('active');
      }
    }
    if(e.key=="up") {
      var active = _this.select.getElement('.active');
      if(active) {
        if(active.getPrevious('li')) {
          active.removeClass('active');
          active.getPrevious().addClass('active');
        }
        else {
          active.removeClass('active');
          _this.select.getLast('ul li').addClass('active');
        }
      }
      else {
        _this.select.getLast('ul li').addClass('active');
      }
    }
  }
  // Selection a result
  , _selection: function(e) { 
    var _this = this;
    var inputSelected = e.target.get('text');
    _this.input.value = inputSelected;
    _this.input.focus();
    _this.select.addClass('hidden');
    _this._pushSelectedResult(e);
  }
  // Close result
  , _closeResult: function(e) {
    var _this = this;    
    var active = _this.select.getElement('.active');
    if(active) { active.removeClass('active'); }
    _this.select.addClass('hidden');
  }
  , _pushSelectedResult: function(e) {
    e.stop();
    var _this = this;
    if(_this.input.value != "") {
      var active = _this.select.getElement('.active');
      if(active) { _this.input.value = active.get('text'); active.removeClass('active'); } // A result selected we push it 
      _this.select.empty().addClass('hidden');
    }
  }
});

var getData = function(value,callback) {
  var _this = this;
  new Request({
    url: 'collection.php',
    method:'post',
    data: {
      collection:_this.collection,
      label:_this.label,
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

