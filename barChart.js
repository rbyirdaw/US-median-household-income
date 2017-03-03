
function BarChart(svg, xData, yData, plotWidth, plotHeight) {
  
  this._svg = svg;
  this._xData = xData;
  this._yData = yData;
  this._plotWidth = plotWidth;
  this._plotHeight = plotHeight;

  this._bars = undefined;

  this.xAxis = undefined;
  this.yAxis = undefined;
  this.xScale = undefined;
  this.yScale = undefined;
  this.dataLabels = undefined;
  this.legend = undefined;

}

//=============================================================================

BarChart.prototype.createBars = function() {

  var self = this;
  var xyData = [];
  self._xData.forEach(function(xi, i) {
    xyData[i] = [xi, self._yData[i]];
  });

  this._bars = this._svg.select("g").selectAll("rect");
  this._bars
      .data(xyData)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return self.xScale(d[0]);
      })
      .attr("width", this.xScale.rangeBand())
      .attr("y", function(d, i) { console.log(d[1]);
        return self.yScale(d[1]);
      })
      .attr("height", function(d,i) {
        return self._plotHeight - self.yScale(d[1]);
      });

};

//=============================================================================

BarChart.prototype.createXscale = function(domainData, rangeValues) {
  this.xScale = d3.scale.ordinal()
      .domain(domainData)
      .rangeRoundBands(rangeValues, 0.25);
};

//=============================================================================

BarChart.prototype.createYscale = function(domainValues, rangeValues, paddingTop) {
  this.yScale = d3.scale.linear()
      .domain([domainValues[0], domainValues[1] + paddingTop])
      .range(rangeValues);
};

//=============================================================================

BarChart.prototype.createXaxis = function() {

  var self = this;

  this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("bottom");

  this._svg
      .select("g")
      .append("g")
      .attr("class", "x axis")

      .attr("transform", "translate(0," + this._plotHeight + ")")
      .call(this.xAxis)
      .selectAll("text")
      .attr("x", -7)
      .attr("y", 5)
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
};

//=============================================================================

BarChart.prototype.createYaxis = function() {
  this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("left")
      .ticks(15, "s");

  this._svg
      .select("g")
      .append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .append("text")
      .attr("x", "-50")
      .attr("y", "-50")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("Median Household Income (in 2014 Dollars)");
};





