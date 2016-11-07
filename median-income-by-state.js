
var _vis = {};

//==============================================================================
function init() {
	_vis = {
		paddingTop: 0,

		margin: {top: 60, right: 20, bottom: 120, left: 80},
		width: 960,
		height: 500,
		
		svg: undefined,
		xScale: undefined,
		yScale: undefined,
		xAxis: undefined,
		yAxis: undefined,
		
		//Data being displayed - default is 2014
		data: undefined,
		
		dataUSavg: [],
		//Complete data
		dataMaster: [],
		
		defYear: "1999"
	};
	
	//Adjust width, height
	_vis.width = _vis.width - _vis.margin.left - _vis.margin.right;
	_vis.height = _vis.height - _vis.margin.top - _vis.margin.bottom;
	
	
		
	d3.csv("median-household-income-by-state-master.csv",
		function(error, data) {
			if (error) {
				return console.log(error);
			}

			//Master data contains data for all years
			_vis.dataMaster = data;
			//Select data for current year only and without national average
			_vis.data = _vis.dataMaster.filter(function(d) { 
				return ( (d.year === _vis.defYear) && 
					(d.state !== "United States") );
				}
			);		


			//Build chart
			createSVG();
			//Top of plot has padding that depends on the largest data point
			calcPaddingTop();
			setupScales();
			createDefPlot();
			plotUSavg(_vis.defYear);
			createAxes();				

		}
	);
		
	
	//Set up HTML event listeners
	d3.selectAll("[name='sortOptions']")
		.on("change", function() {
			sortBars(this.value);
		});
		
	d3.select("[name='yearSelect']")
		.on("change", function() {
			update(this.value);
		});
}
//==============================================================================
function createSVG() {
				
	//Insert svg before range input
	_vis.svg = d3.select(".svg-holder")
				.append("svg")		
				.attr("width", _vis.width + _vis.margin.left + 
					_vis.margin.right)
				.attr("height", _vis.height + _vis.margin.top + 
					_vis.margin.bottom)
				.append("g")
					.attr("transform", "translate(" + _vis.margin.left + 
						"," + _vis.margin.top + ")");
	
}
//==============================================================================
function setupScales() {
	_vis.xScale = d3.scale.ordinal()
			.domain(_vis.data.map( function(d) { return d.state; } ))
			.rangeRoundBands([0, _vis.width], 0.25);
			
	_vis.yScale = d3.scale.linear()
			.domain([0, d3.max(_vis.data, function(d) {				
					return Number.parseFloat(d["median income"].replace(',',''));
				}) + _vis.paddingTop			
			])
			.range([_vis.height, 0]);
	
}

//==============================================================================
function createAxes() {
	_vis.xAxis = d3.svg.axis()
			.scale(_vis.xScale)
			.orient("bottom");			
			
	_vis.yAxis = d3.svg.axis()
			.scale(_vis.yScale)
			.orient("left")
			.ticks(15, "s");

			
	_vis.svg.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + _vis.height + ")")
			.call(_vis.xAxis)
			.selectAll("text")
				.attr("x", -7)
				.attr("y", 5)
				.attr("transform", "rotate(-45)")
				.style("text-anchor", "end");
	
	
	_vis.svg.append("g")
			.attr("class", "y axis")
			.call(_vis.yAxis)
			.append("text")
				.attr("x", "-50")
				.attr("y", "-50")
				.attr("text-anchor","end")
				.attr("transform", "rotate(-90)")								
				.text("Median household income (in 2014 dollars)");							
	
}

//==============================================================================
function createDefPlot() {			

		
	_vis.svg.selectAll("rect")
			
			.data(_vis.data)
			.enter()
			.append("rect")
				.attr("x", function(d) { return _vis.xScale(d.state); })
				.attr("width", _vis.xScale.rangeBand())
				.attr("y", function(d) { 
						return _vis.yScale(incomeStrToNum(d["median income"])); 
					}
				)
				.attr("height", function(d) { 
						return _vis.height - 
							_vis.yScale(incomeStrToNum(d["median income"])); 
					}
				)
				.on("click", function() {
					//default ordering is by state
		   			sortBars("state");
					//so reset radio-group as well
					d3.select("input[value='state']")
						.property("checked",true);

				})
				.on("mouseover", function(d, i) {
					var xPos = (i > 45) ? _vis.xScale(d.state) - 35 : _vis.xScale(d.state);
					_vis.svg.append("text")
						.attr("x", xPos)
						.attr("y", 10)
						.attr("id", "svg-tooltip-main")
						
						.append("tspan")
						.attr("x", xPos)
						.attr("y", 15 )
						.text(d.state)
						.attr("fill", "SkyBlue")
						.attr("font-size","16px");

				})
				.on("mouseout", function() {
					d3.select("#svg-tooltip-main").remove();
				});
		

	_vis.svg.append("g")
			.attr("id", "dataLabels")
			.selectAll("text")
				.data(_vis.data)
				.enter()
				.append("text")
				.text(function(d) {
					return "$"+d["median income"];
				})
				.attr("text-anchor", "start")
				.attr("x", function(d, i) { return _vis.xScale(d.state); })
				.attr("y", function(d, i) {
					var heightAdjust = 0;
					var incomeDiff = 0;
					
					if ( (i > 0) && Math.abs(
							incomeStrToNum(_vis.data[i-1]["median income"]) -
							incomeStrToNum(d["median income"]) ) < 2000 ) {
							heightAdjust = 20;
					}


					return _vis.yScale(incomeStrToNum(d["median income"]))
						- 5 + heightAdjust;
					}
				)
				.attr("fill","red")
				.attr("font-size","10px");
				
	//show national average			
	_vis.svg.append("g")
			.attr("id", "USavg_g")
			.append("path")
			.attr("class", "USavg");
			
	//Add legend for national average
	_vis.svg.selectAll(".legend")
			.data(["National Average"])
			.enter()
			.append("g")
			.attr("class", "legend");
			//.attr("transform","translate(0, 20)");	

	_vis.svg.selectAll(".legend")
			.append("text")
			.attr("x", _vis.width - 180)
			.attr("y", 35)
			.attr("text-anchor", "start")
			.text( function (d) {
				return d;
			})
			.style("font-size", "11");
	
	var line = d3.svg.line()
		.x(function(d) { return d[0]; })
		.y(function(d) { return d[1]; })
		.interpolate("linear");
		
		
	_vis.svg.selectAll(".legend")
		.append("path")
		  .attr("class", "USavg")
		  .attr("d", line( [ 
			[_vis.width - 225, 32],
			[_vis.width - 185, 32]
		  ] ) 
	      );			
			
}
//==============================================================================
function plotUSavg(year) {
	
	//data array has to be clear before pushing on values
	_vis.dataUSavg = [];
	
	var USavg = _vis.dataMaster.filter(function(d) {
		return ( (d.year === year) && (d.state === "United States") );
	});
	var USavgIncome = incomeStrToNum(USavg[0]["median income"]);

	_vis.dataUSavg = [ [10, USavgIncome], [_vis.width - 10, USavgIncome]];
	
	_vis.svg.select(".USavg")
		.datum(_vis.dataUSavg)
		.transition()
		.duration(1300)			
		.attr("d", d3.svg.line()
			.x( function(d) { return d[0]; } )
			.y( function(d) { return _vis.yScale(d[1]); } )
			.interpolate("linear")	
		);
		
		
	
}
//==============================================================================
function sortBars(sortOrder) {

  //determine selected sort order
  (sortOrder === "state") ? 
    (_vis.data.sort(function(a, b) {
	return d3.ascending(a.state, b.state);
    }) ) :
    ( (sortOrder === "ascending") ? 
        (_vis.data.sort(function(a, b) {
	  return d3.ascending(
	    incomeStrToNum(a["median income"]),
	    incomeStrToNum(b["median income"]) 
	  );	
	}) ) :
        (_vis.data.sort(function(a, b) {
	  return d3.descending(
	    incomeStrToNum(a["median income"]),
	    incomeStrToNum(b["median income"]) 
	  );			
	}) )
    );

  //redo x domain per sort selection 
	_vis.xScale.domain(_vis.data.map( function(d) { return d.state; } ));
					
	_vis.svg.select(".x.axis")
		.transition()
		.duration(1000)	
		.call(_vis.xAxis)
		.delay(function(d, i) {
				   return i * 50;
				}).		
		selectAll("text")
			.attr("x", -10)
			.attr("y", 0)
			.attr("transform", "rotate(-45)")		
			.style("text-anchor", "end");		
		

	_vis.svg.selectAll("rect")
		.transition()
		.delay(function(d, i) {
	 	   return i * 50;
 	        })
		.duration(1000)
		.attr("x", function(d) { return _vis.xScale(d.state); })
		/*
		.attr("y", function(d) { return _vis.yScale(
			Number.parseFloat(d["median income"].replace(',','')) 
			); })
		.attr("height", function(d) { 
			return _vis.height - _vis.yScale(Number.parseFloat(d["median income"].replace(',','') ) ); 
		})*/;		
		
		
	//data labels
	_vis.svg.select("#dataLabels")
				.selectAll("text")
					.data(_vis.data)
					.transition()
					.duration(1000)
					.text(function(d) {
						return "$"+d["median income"];
					})
					.attr("text-anchor", "start")
					.attr("x", "0")
					.attr("y", "0")
					.attr("transform", function(d) {
						var x = _vis.xScale(d.state) +
							0.5 * _vis.xScale.rangeBand();
						var y = _vis.yScale(
								incomeStrToNum(d["median income"])
								) - 5;
								
						var rot = (sortOrder == "state") ? 0 : -90;
						return "translate("+x+", "+y+") rotate("+rot+")";
						
					})

					.attr("fill","red")
					.attr("font-size","10px");		
		
}

//==============================================================================

function update(yearSelected) {
	

	_vis.data = [];
	_vis.data = _vis.dataMaster.filter(function(d) { 
			return ( (d.year === yearSelected) && 
				(d.state !== "United States") );
		}
	);
	//Recalculate paddingTop based on new data
	calcPaddingTop();
	
	_vis.xScale.domain(_vis.data.map( function(d) { return d.state; } ));
					
	_vis.svg.select(".x.axis")
		.transition()
		.duration(1000)
		.call(_vis.xAxis)
		.delay(function(d, i) {
				   return i * 50;
				})
		.selectAll("text")
			.attr("x", -10)
			.attr("y", 0)
			.attr("transform", "rotate(-45)")
			.style("text-anchor", "end");	
			
	
	_vis.yScale.domain([0, d3.max(_vis.data, function(d) {				
					return incomeStrToNum(d["median income"]);
				}) + _vis.paddingTop
			]);
				
	//Update y axis along with its padding on data change - do transition
	_vis.svg.select(".y.axis")
		.transition()
		.duration(1000)	
		.call(_vis.yAxis);
	
	_vis.svg.selectAll("rect")
		.data(_vis.data)
		.transition()
		.duration(1000)
		.attr("x", function(d) { return _vis.xScale(d.state); })
		.attr("y", function(d) { 
				return _vis.yScale(incomeStrToNum(d["median income"])); 
			}
		)
		.attr("height", function(d) { 
			return _vis.height - 
				_vis.yScale(incomeStrToNum(d["median income"])); 
		});
		
	_vis.svg.select("#dataLabels")
				.selectAll("text")
					.data(_vis.data)
					.transition()
					.duration(1000)
					.text(function(d) {
						return "$"+d["median income"];;
					})
					.attr("text-anchor", "middle")
					.attr("x", function(d) { return _vis.xScale(d.state); })
					.attr("y", function(d, i) {
						var heightAdjust = 0;
						var incomeDiff = 0;
						
						if ( (i > 0) && Math.abs(
								incomeStrToNum(_vis.data[i-1]["median income"]) -
								incomeStrToNum(d["median income"]) ) < 2000 ) {
								heightAdjust = 20;
						}

						return _vis.yScale(incomeStrToNum(d["median income"])) - 
							5 + heightAdjust;;
						})
					.attr("transform", "")
					.attr("fill","red")
					.attr("font-size","10px");
					

	plotUSavg(yearSelected);
	
	//Reset radio-group as well
	d3.select("input[value='state']")
		.property("checked",true);
		
	d3.select(".yearDisplay")
		.text(yearSelected);
}

//==============================================================================
function calcPaddingTop() {
	
	_vis.paddingTop = Math.floor(
		d3.max(_vis.data, function(d) { 
			return incomeStrToNum(d["median income"]);
		}) / 5
	);
}

//==============================================================================
function incomeStrToNum(incomeStr) {
	return +incomeStr.replace(',','');
	
}
