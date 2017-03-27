
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

BarChart.prototype.setXdata = function(xData) {
  this._xData = xData;

}

//=============================================================================

BarChart.prototype.setYdata = function(yData) {
  this._yData = yData;

}

//=============================================================================

BarChart.prototype.setXYdata = function(xyData) {

  this._xyData = xyData;

};

//=============================================================================

BarChart.prototype.createDataLabels = function() {

  var self = this;

  this._svg
      .select("g")
      .append("g")
      .attr("id", "dataLabels")
      .selectAll("text")
      .data(this._xyData)
      .enter()
      .append("text")
      .text(function(d) {
        return d[1];
      })
      .style("text-anchor", "middle")
      .attr("x", function(d, i) {
        return self.xScale(d[0]);
      })
      .attr("y", function(d, i) {
        return self.yScale(d[1]) - 5;
      })
      .attr("fill", "tomato")
      .attr("font-size", "11px");

  this.dataLabels = this._svg.select("#dataLabels").selectAll("text");
   

};

//=============================================================================
BarChart.prototype.updateDataLabels = function() {

  this.dataLabels
      .data(this._xyData);
};


//=============================================================================
BarChart.prototype.updateDataLabelsRot = function(rot) {

  var self = this;

  if (rot === 0) {
    this.dataLabels
        .attr("transform", "");
  } else {
 
  this.dataLabels
      .style("text-anchor", "middle")
      .attr("transform", function(d) {
        var x = self.xScale(d[0]),
            y = self.yScale(d[1]);

        return "translate(" + (x + 20) + "," + (y - 15) + ") rotate("+rot+")" 
            + "translate(" + (-x) + "," + (-y) + ")";
      });
  }
}

//=============================================================================
BarChart.prototype.updateDataLabelsYpos = function() {

  var self = this;

  if ((arguments.length === 1) && (arguments[0].animate === false)) {

    this.dataLabels
        .text(function(d) {
          return d[1];
        })
        .style("text-anchor", "middle")
        .attr("y", function(d, i) {
          return self.yScale(d[1]) - 5;
        })
        .attr("fill", "tomato")
        .attr("font-size", "11px");
  } else {
    this.dataLabels
        .transition()
        .duration(1000)
        .text(function(d) {
          return d[1];
        })
        .style("text-anchor", "middle")
        .attr("y", function(d, i) {
          return self.yScale(d[1]) - 5;
        })
        .attr("fill", "tomato")
        .attr("font-size", "11px");
  }


};



//=============================================================================

BarChart.prototype.updateDataLabelsXpos = function() {
  var self = this;

  if ((arguments.length === 1) && (arguments[0].animate === false)) {

    this.dataLabels
        .text(function(d) {
          return d[1];
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d) { 
          return self.xScale(d[0]);
        })
        .attr("fill", "tomato")
        .attr("font-size", "11px");

  } else {

    this.dataLabels
        .transition()
        .duration(1000)
        .text(function(d) {
          return d[1];
        })
        .attr("text-anchor", "middle")
        .attr("x", function(d) { 
          return self.xScale(d[0]);
        })
        .attr("fill", "tomato")
        .attr("font-size", "11px");
  }

};



//=============================================================================

BarChart.prototype.createBars = function() {

  var self = this;


  this._svg
      .select("g")
      .selectAll("rect")
      .data(self._xyData)
      .enter()
      .append("rect")
      .attr("id", function(d) {
        return d[0];
      })
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

BarChart.prototype.updateBars = function() {

  this._bars
      .data(this._xyData);
};


//=============================================================================

BarChart.prototype.updateBarsXpos = function() {

  var self = this;

  if ( (arguments.length === 1) && (arguments[0].animate === false) ) {
    this._bars
        .attr("x", function(d) {
          return self.xScale(d[0]);
        });
  } else {
    this._bars
        .transition()
        .delay(function(d, i) {
          return i * 25;
        })
        .duration(1000)
        .attr("x", function(d) {
          return self.xScale(d[0]);
        });

  }

};

//=============================================================================

BarChart.prototype.updateBarsYpos = function() {

  var self = this;

  this._bars
      .transition()
      .duration(1000)
      .attr("y", function(d) {
        return self.yScale(d[1]);
      })
      .attr("height", function(d) {
        return self._plotHeight - self.yScale(d[1]);
      })
      .attr("id", function(d) {
        if (d[0]==="Ohio") { console.log(d[0]+" is "+d[1]); }
        return d[0]+"$"+d[1];
      });

};



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

  console.log(this._xyData);
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

BarChart.prototype.updateYscale = function() {
  this.yScale
      .domain([0, d3.max(this._yData)]);
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

  this.yAxisGroup = this._svg
      .select("g")
      .append("g")
      .attr("class", "y axis");

  this.yAxisGroup
      .call(this.yAxis)
      .append("text")
      .attr("x", "-50")
      .attr("y", "-50")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .text("Median Household Income (in 2014 Dollars)");
};


//=============================================================================

BarChart.prototype.updateYaxis = function() {

  this.yAxisGroup
      .transition()
      .duration(1000)
      .call(this.yAxis);
};







