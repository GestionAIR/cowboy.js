/* 
 * Class cowboy.Toggles
 * Toggles visibility of an element
 */
cowboy.Toggles = new Class({
  initialize: function() {
    var _this = this;

    // For each .toggler
    $$('.toggler').each(function(toggler) {
      // Handle some events
      toggler.addEvent('click',_this._show);
      toggler.addEvent('dblclick', function(e) { e.stop(); });

      // TODO
      //var button = new Element('span', {"class":"button"});
      //button.inject(toggler);
    });
  }
  , _show : function(e) {
    var _this = this;

    // Get the element to show/hide
    var target = this.getNext('.toggle');
    if (!target) return -1;

    // If animation is not over, do nothing
    if (!target.hasClass('toggling')) {
      // Add .toggling to tell animation is not over
      target.addClass('toggling');

      // Define animation
      var show = new Fx.Reveal($(target), {duration: 500, mode: 'vertical'});

      // When animation is over, remove .toggling
      show.addEvent('complete', function(e) {  target.removeClass('toggling'); });

      // Start animation and change .toggler class to reflect future state ("closed" or "openned")
      show.toggle().chain(function() {
        if(_this.hasClass('closed')) {
          _this.removeClass('closed');
          _this.addClass('openned');
        }
        else {
          _this.addClass('closed');
          _this.removeClass('openned');
        }
      });
    }
  }
});
