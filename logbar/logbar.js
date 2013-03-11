/* 
 * Class cowboy.LogBar
 * Displays a status bar in the bottom of the screen
 */
cowboy.LogBar = new Class({
  initialize: function() {
    // status = false because the logbar is not displayed at startup
    this.status = false;
  }
  , _show: function(duration=null) {
    // If the logbar is already visible, do nothing
    if (!this.status) {
      // Define animation
      var fx = new Fx.Morph($('log-bar'), { duration: '1000', transition: Fx.Transitions.Expo.easeOut });

      // Start animation
      fx.start({'bottom': [-56, 0]});

      // Write that the logbar is up
      this.status = true;

      // If a parameter was specified, hide the logbar after x milliseconds
      if (duration > 0) (function () { LOGBAR._hide(); }).delay(duration);
    }
  }	
  , _hide: function() {
    // If the logbar is not visible, do nothing
    if (this.status) {
      // Define animation
      var fx = new Fx.Morph($('log-bar'), { duration: '1000', transition: Fx.Transitions.Expo.easeOut });

      // Start animation
      fx.start({'bottom': [0, -56]});

      // Write that the logbar is down
      this.status = false
    }
  }
});

// When DOM is ready, initialize the logbar if #log-bar exists
window.addEvent('domready', function () {
  if ($('log-bar')) { LOGBAR = new cowboy.LogBar(); }
});
