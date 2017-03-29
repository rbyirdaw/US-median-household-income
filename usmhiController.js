
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

    this.xDataOrder = 'state';

  }

//=============================================================================

  BarController.prototype.update = function(updateOpt) {

    if (updateOpt.type === 'sort') {
      this.xDataOrder = updateOpt.value;
      //console.log(updateOpt);
      this.view.updateBarChart({
        type: 'sort', 
        value: updateOpt.value,
        fromOrder: this.xDataOrder
      });

    } else if (updateOpt.type === 'year') {

      //get data for given year
      var newData,
          xData = [],
          yData = [],
          xyData = [];
      
      this.model.read(updateOpt.value);
      newData = this.model.getData();

      xData = newData.map(function(d) { return d.state; });
      yData = newData.map(function(d) { 
        return Number.parseFloat(d["median income"].replace(',',''));
      });

      xData.forEach(function(xi, i) {
        xyData[i] = [xi, yData[i]];
      });

      this.view.updateBarChart({
        type: 'year',
        xyData: xyData,
        xData: xData,
        yData: yData,
        fromOrder: this.xDataOrder
      });
/*
      if (this.xDataOrder === 'ascending' || this.xDataOrder === 'descending') {
        this.view.updateBarChart({type: 'sort', value: this.xDataOrder});
      }
*/

    }
      
  }


//=============================================================================
  window.usmhiApp = window.usmhiApp || {};
  window.usmhiApp.Controller = BarController;

})(window);
