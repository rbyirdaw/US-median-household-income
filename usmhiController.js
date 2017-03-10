
(function(window) {

  function BarController(model, view) {
    var self = this;
    this.model = model;
    this.view = view;

    this.view.setListener('yearSelect', function(year) {
      self.update({type: 'year', value: year});
    });

    this.view.setListener('sortSelect', function(order) {
      self.update({type: 'sort', value: order});
    });

  }

//=============================================================================

  BarController.prototype.update = function(updateOpt) {
    if (updateOpt.type === 'sort') {
      this.xDataOrder = updateOpt.value;
      console.log(this.xDataOrder);

      this.view.updateBarChart(updateOpt);
    }
      
  }

//=============================================================================


//=============================================================================
  window.usmhiApp = window.usmhiApp || {};
  window.usmhiApp.Controller = BarController;

})(window);
