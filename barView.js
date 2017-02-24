
function BarView() {
  this._svg = undefined;
  this._chart = undefined;
  this.paddingTop = 0;

  this.plotWidth = 0;
  this.plotHeight = 0;

}

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
  
};
