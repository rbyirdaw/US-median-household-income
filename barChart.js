
function BarChart(svg, data) {
  
  this._svg = svg;
  this._xData = xData;
  this._yData = yData;

  this.xAxis = undefined;
  this.yAxis = undefined;
  this.xScale = undefined;
  this.yScale = undefined;
  this.dataLabels = undefined;
  this.legend = undefined;

}

BarChart.prototype.createXscale = function(domainData, rangeValues) {
  this.xScale = d3.scale.ordinal()
      .domain(domainData.map( function(d) {
          return d;
        })
      )
      .rangeRoundBands(rangeValues, 0.25);
};

BarChart.prototype.createYscale = function(domainData, rangeValues, paddingTop) {
  this.yScale = d3.scale.linear()
      .domain([0, d3.max(domainData, function(d) {
          return d;
        }) + paddingTop
      ])
      .range(rangeValue);
}

BarChart.prototype.createXaxis = function() {
  this.xAxis = d3.svg.axis()
      .scale(this.xScale)
      .orient("bottom");

  this._svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this._svg.height() + ")")
      .call(this.xAxis)
      .selectAll("text")
      .attr("x", -7)
      .attr("y", 5)
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");
}

BarChart.prototype.createYaxis = function() {
  this.yAxis = d3.svg.axis()
      .scale(this.yScale)
      .orient("left")
      .ticks(15, "s");

  this._svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
      .append("text")
      .attr("x", "-50")
      .attr("y", "-50")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("Median Household Income (in 2014 Dollars)");
}





