
function BarChart(svg, xData, yData, plotWidth, plotHeight) {
  
  var self = this;

  this._svg = svg;
  this._xData = xData;
  this._yData = yData;

  this._xyData = [];
  xData.forEach(function(xi, i) {
    self._xyData[i] = [xi, yData[i]];
  });

  this._plotWidth = plotWidth;
  this._plotHeight = plotHeight;

  this._bars = undefined;

  this.xAxis = undefined;
  this.xAxisGroup = undefined;
  this.yAxis = undefined;
  this.yAxisGroup = undefined;
  this.xScale = undefined;
  this.yScale = undefined;
  this.dataLabels = undefined;
  this.legend = undefined;

}

//=============================================================================

BarChart.prototype.createBars = function() {

  var self = this;


  this._svg
      .select("g")
      .selectAll("rect")
      .data(self._xyData)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return self.xScale(d[0]);
      })
      .attr("width", this.xScale.rangeBand())
      .attr("y", function(d, i) { 
        return self.yScale(d[1]);
      })
      .attr("height", function(d,i) {
        return self._plotHeight - self.yScale(d[1]);
      });

  this._bars = this._svg.selectAll("rect");

};

//=============================================================================

BarChart.prototype.updateBarsXpos = function() {

  var self = this;

  this._bars
      .transition()
      .delay(function(d, i) {
        return i * 50;
      })
      .duration(1000)
      .attr("x", function(d) {
        return self.xScale(d[0]);
      });
}

//=============================================================================

BarChart.prototype.sortBars = function(order) {

  if (order === 'state') {
    this._xyData.sort(function(a, b) {
      return d3.ascending(a[0], b[0]);
    });
  } else if (order === 'ascending') {
    this._xyData.sort(function(a, b) {
      return d3.ascending(a[1], b[1]);
    });
  } else if (order === 'descending') {
    this._xyData.sort(function(a, b) {
      return d3.descending(a[1], b[1]);
    });
  }
};

//=============================================================================

BarChart.prototype.createXscale = function(domainData, rangeValues) {
  this.xScale = d3.scale.ordinal()
      .domain(domainData)
      .rangeRoundBands(rangeValues, 0.25);
};

//=============================================================================

BarChart.prototype.updateXscale = function() {
  this.xScale.domain(this._xyData.map(function(d) {
//    console.log(d[0]+" "+d[1]);
    return d[0];
  }));
}

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

  this.xAxisGroup = this._svg
      .select("g")
      .append("g")
      .attr("class", "x axis")

  this.xAxisGroup
      .attr("transform", "translate(0," + this._plotHeight + ")")
      .call(this.xAxis)
      .selectAll("text")
      .attr("x", -7)
      .attr("y", 5)
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
};

//=============================================================================

BarChart.prototype.updateXaxis = function() {

  this.xAxisGroup
      .transition()
      .duration(1000)
      .call(this.xAxis)
      .delay(function(d, i) {
        return i * 50;
      })
      .selectAll("text")
      .attr("x", -10)
      .attr("y", 0)
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





