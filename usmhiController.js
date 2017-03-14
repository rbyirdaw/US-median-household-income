
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
    } else if (updateOpt.type === 'year') {

      //get data for given year
      var newData,
          xData = [],
          yData = [],
          xyData = [];
      
      this.model.read(updateOpt.value);
      newData = this.model.getData();
/*
      if (this.xDataOrder === 'ascending') {
        //need to sort new data
        newData.sort(function(a, b) {
          return d3.ascending(
              Number.parseFloat(a["median income"].replace(',','')),
              Number.parseFloat(b["median income"].replace(',',''))    
          );
        });
      } else if (this.xDataOrder === 'descending') {
        newData.sort(function(a, b) {
          return d3.descending(
              Number.parseFloat(a["median income"].replace(',','')),
              Number.parseFloat(b["median income"].replace(',',''))    
          );
        });
      }
      
*/
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
        yData: yData
      });

      this.view.updateBarChart({type: 'sort', value: this.xDataOrder});

    }
      
  }

//=============================================================================


//=============================================================================
  window.usmhiApp = window.usmhiApp || {};
  window.usmhiApp.Controller = BarController;

})(window);
