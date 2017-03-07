
(function(window) {

  function BarController(view) {
    var self = this;
    this.view = view;

    this.view.setListener('yearSelect', function(year) {
      self.update(year);
    });

  }

//=============================================================================

  BarController.prototype.update = function(year) {
    //this.view.update();
  }

//=============================================================================

  window.usmhiApp = window.usmhiApp || {};
  window.usmhiApp.Controller = BarController;

})(window);
