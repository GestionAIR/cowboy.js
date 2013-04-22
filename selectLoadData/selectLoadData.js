/* 
 * Class cowboy.SelectLoadData
 * Load data by an Ajax request into a Select Element
 */
cowboy.SelectLoadData = new Class({
  initialize: function() {
    var _this = this;
    // Initialize all Select with a attribute class that content "load-data"
    $$('select.load-data').each(function(select) {
      // Define a collection, could be a SQL's table
      var collection = select.getProperty('data-collection'); 
      // Define a property of the collection to be display in the select, could be a SQL's column
      var label = select.getProperty('data-label');
      // Call getData method to retrieve data
      _this._getData(select,collection,label);
    });
  }
  // Retrieve the collection of data by an Ajax Method 
  , _getData: function(select,collection,label) {
    var _this = this;
    new Request({
      url: 'collection.php',
      method:'post',
      data:{
        "collection":collection,
        "label":label
      },
      onSuccess: function(response){
        response = JSON.decode(response);
        _this._pushData(response.data,select);
      }
    }).send();
  }
  // Create all options into the select element
  , _pushData: function(list,select) {
    // Option : you can choose an option of the list to be selected by default
    var selectedValue = select.getProperty('data-selected');
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