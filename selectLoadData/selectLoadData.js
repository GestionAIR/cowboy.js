/* 
 * Class cowboy.SelectLoadData
 * Load data by an Ajax request into a Select Element
 *          
 */
cowboy.SelectLoadData = new Class({
  Implements:cowboy.Options,
  options: {
    collection:null,
    label:null,
    selected:null,
    url:null,
    method:'post'
  },
  initialize: function(select,options) {
    var _this = this;
    this.select = select;
    this.options = Object.merge(this.options, options);

    this.setElementOptions(this.options, this.select, ['collection','label','selected','url','method'])
    // Detect if the list is directly given in the options
    if(this.options.list) {
      this._pushData(this.options.list, this.select);
    }
    else {
      this._getData();
    }
  }
  // Retrieve the collection of data by an Ajax Method 
  , _getData: function() {
    var _this = this;
    new Request({
      url: this.options.url,
      method: this.options.method,
      data:{
        "collection": this.options.collection,
        "label": this.options.label
      },
      onSuccess: function(response){
        response = JSON.decode(response);
        _this._pushData(response.data,_this.select);
      }
    }).send();
  }
  // Create all options into the select element
  , _pushData: function(list,select) {
    // Option : you can choose an option of the list to be selected by default
    var selectedValue = this.options.selected;
    // For each element of the list 
    list.each(function(el) {
      var option = new Element('option',{
        'value':el.id,'text':el.label
      });
      if(el.id==selectedValue) option.setProperty('selected','selected');
      option.inject(select);                                
    });
  }
});