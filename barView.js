
function BarView() {
  this.yearSelect = document.querySelector("[name='yearSelect']");
  this.yearDisplay = document.querySelector("[name='yearDisplay']");
  this.sortSelectors = document.querySelectorAll("[name='sortSelect']");

  this._svg = undefined;
  this._chart = undefined;
  this.paddingTop = 0;

  this.plotWidth = 0;
  this.plotHeight = 0;

}

//=============================================================================

BarView.prototype.setListener = function(action, eveHandler) {

  var self = this;

  if (action === 'yearSelect') {
    this.yearSelect.addEventListener("change", function() {
      console.log("year change function for BarView - year is "+this.value);
      self.yearDisplay.innerHTML = this.value;
      eveHandler(+this.value);
    }, false);
  } else if (action === 'sortSelect') {
    for (i = 0; i < this.sortSelectors.length; i++) {
      this.sortSelectors[i].addEventListener("change", function() {
        //console.log("sort is "+this.value);
        eveHandler(this.value);
      }, false);
    }
  }

};

//=============================================================================

BarView.prototype.createSVG = function(svgOptions) {
  this.plotWidth = svgOptions.width - svgOptions.margin.left - svgOptions.margin.right;
  this.plotHeight = svgOptions.height - svgOptions.margin.top - svgOptions.margin.bottom;

  this._svg = d3.select(svgOptions.parentElement)
      .append("svg");

  this._svg
      .attr("width", svgOptions.width)
      .attr("height", svgOptions.height)
      .append("g")
      .attr("transform", "translate(" + svgOptions.margin.left +
          "," + svgOptions.margin.top + ")");
};

//=============================================================================

BarView.prototype.createBarChart = function(xData, yData) {
  this._chart = new BarChart(this._svg, xData, yData, this.plotWidth, this.plotHeight);

/*  var xRangeValues = [0, +this._svg.attr("width")],
      yDomainValues = [0, d3.max(yData)],
      yRangeValues = [+this._svg.attr("height"), 0];
*/
  var xRangeValues = [0, this.plotWidth],
      yDomainValues = [0, d3.max(yData)],
      yRangeValues = [this.plotHeight, 0];

  this._chart.createXscale(xData, xRangeValues);
  this._chart.createYscale(yDomainValues, yRangeValues, this.paddingTop);

  this._chart.createXaxis();
  this._chart.createYaxis();

  this._chart.createBars();

  this._chart.createDataLabels();
  
};

//=============================================================================

BarView.prototype.updateBarChart = function(updateOpt) {

  if (updateOpt.type === 'year') {
    this._chart.setXdata(updateOpt.xData);
    this._chart.setYdata(updateOpt.yData);
    this._chart.setXYdata(updateOpt.xyData);

    this._chart.updateXscale();
    this._chart.updateXaxis();
    this._chart.updateBarsXpos();

    this._chart.updateYscale();
    this._chart.updateYaxis();
    this._chart.updateBarsYpos();

  }

  if (updateOpt.type === 'sort') {

    this._chart.sortBars(updateOpt.value);
    this._chart.updateXscale();
    this._chart.updateXaxis();
    this._chart.updateBarsXpos();

  }
  


};


//=============================================================================


