/* 
 * Class cowboy.SelectLoadData
 * Put the selected value passed in option
 * 
 */
cowboy.SelectSelectedValue = new Class({
  Implements:cowboy.Options,
  options: {
    selected:null,
  },
  initialize: function(select,options) {
    var _this = this;
    this.select = select;
    // Overwrite options passed by JS
    this.options = Object.merge(this.options, options);
    // Overwrite options passed by Element's properties
    this.setElementOptions(this.options, this.select);
    // Find the value to switch to selected="selected"
    select.getChildren('option').each(function(el) {
      if(el.value==_this.options.selected) select.value = el.value;
    });
  }
});