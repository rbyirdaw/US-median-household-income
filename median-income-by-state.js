
var _vis = {};

//==============================================================================
function init() {
	_vis = {
		paddingTop: 10,
		margin: {top: 20, right: 20, bottom: 80, left: 60},
		width: 960,
		height: 500,
		
		svg: undefined,
		xScale: undefined,
		yScale: undefined,
		xAxis: undefined,
		yAxis: undefined,
		
		dataMaster: []
	};
	
	//Adjust width, height
	_vis.width = _vis.width - _vis.margin.left - _vis.margin.right;
	_vis.height = _vis.height - _vis.margin.top - _vis.margin.bottom;
	
	//Begin building chart
	createSVG();
	setupScales();
	createDefPlot();
	createAxes();
	
	
	var dataAll = d3.csv("median-household-income-by-state-master.csv",
		function(error, data) {
			if (error) {
				console.log(error);
			}
			else {
				return {
					year: data.year,
					state: data.state,
					medianIncome: data["median income"],
					se: data.se,
					footNote: data.footnote
				};
			}
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
	//_vis.svg = d3.select("body")
				//.append("svg")
				
	//Insert svg before range input
	_vis.svg = d3.select("body")
				.insert("svg", "[name='yearSelect']")			
				.attr("width",_vis.width + _vis.margin.left + 
					_vis.margin.right)
				.attr("height",_vis.height + _vis.margin.top + 
					_vis.margin.bottom)
				.append("g")
					.attr("transform", "translate(" + _vis.margin.left + 
						"," + _vis.margin.top + ")");
	
}
//==============================================================================
function setupScales() {
	_vis.xScale = d3.scale.ordinal()
			.domain(dataset.map( function(d) { return d.state; } ))
			.rangeRoundBands([0, _vis.width], 0.05);
			
	_vis.yScale = d3.scale.linear()
			.domain([0, d3.max(dataset, function(d) {				
					return Number.parseFloat(d["median income"].replace(',',''));
				})			
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
			.attr("id", "xaxis")
			.attr("transform", "translate(0," + _vis.height + ")")
			.call(_vis.xAxis)
			.selectAll("text")
				.attr("x", -10)
				.attr("y", 0)
				.attr("transform", "rotate(-45)")
				.style("text-anchor", "end");
	
	
	_vis.svg.append("g")
			.attr("id", "yaxis")
			.call(_vis.yAxis);
	
}

//==============================================================================
function createDefPlot() {			

		
	_vis.svg.selectAll("rect")
			.data(dataset)
			.enter()
			.append("rect")
				.attr("x", function(d) { return _vis.xScale(d.state); })
				.attr("width", _vis.xScale.rangeBand())
				.attr("y", function(d) { return _vis.yScale(
						Number.parseFloat(d["median income"].replace(',','')) 
					); })
				.attr("height", function(d) { 
					return _vis.height - _vis.yScale(
						Number.parseFloat(d["median income"].replace(',','') ) 
					); 
				})
			   .on("click", function() {				   
				   //default ordering is by state
			   		sortBars("state");
					//so reset radio-group as well
					d3.select("input[value='state']")
						.property("checked",true);

			   });				
		

	var txt = _vis.svg.append("g")
				.attr("id", "dataLabels")
				.selectAll("text")
					.data(dataset)
					.enter()
					.append("text")
					.text(function(d) {
						return Number.parseFloat(d["median income"].replace(',',''));
					})
					.attr("text-anchor", "middle")
					.attr("x", function(d) { return _vis.xScale(d.state); })
					.attr("y", function(d) { 
						return _vis.yScale(
							Number.parseFloat(d["median income"].replace(',','')) 
							) + 15; 
						})
					.attr("fill","red")
					.attr("font-size","10px");
			
}

//==============================================================================
function sortBars(sortOrder) {

	if (sortOrder === "state") {
		dataset.sort(function(a, b) {
			return d3.ascending(a.state, b.state);
		});
	}
	else if (sortOrder === "ascending") {
		dataset.sort(function(a, b) {
			return d3.ascending(
				Number.parseFloat(a["median income"].replace(',','')),
				Number.parseFloat(b["median income"].replace(',','')) 
				);	
		});
	}
	else if (sortOrder === "descending") {
		dataset.sort(function(a, b) {
			return d3.descending(
				Number.parseFloat(a["median income"].replace(',','')),
				Number.parseFloat(b["median income"].replace(',','')) 
				);			
		});
	}	
	
	_vis.xScale.domain(dataset.map( function(d) { return d.state; } ));
					
	_vis.svg.select("#xaxis")
		.transition()
		.duration(1000)
		/*
		this doesn't work since labels are not individuals
	    delay(function(d, i) {
	 	   return i * 50;
	    }).
		*/		
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
		.attr("y", function(d) { return _vis.yScale(
			Number.parseFloat(d["median income"].replace(',','')) 
			); })
		.attr("height", function(d) { 
			return _vis.height - _vis.yScale(Number.parseFloat(d["median income"].replace(',','') ) ); 
		});		
		
		
	//data labels
	_vis.svg.select("#dataLabels")
				.selectAll("text")
					.data(dataset)
					.transition()
					.duration(1000)
					.text(function(d) {
						return Number.parseFloat(d["median income"].replace(',',''));
					})
					.attr("text-anchor", "middle")
					.attr("x", function(d) { return _vis.xScale(d.state); })
					.attr("y", function(d) { 
						return _vis.yScale(
							Number.parseFloat(d["median income"].replace(',','')) 
							) + 15; 
						})
					.attr("fill","red")
					.attr("font-size","10px");		
		
}

//==============================================================================

function update(value) {
	
	//alert(value);
	var dataNew = [];
	if (value === "2014")
		dataNew = dataset;
	else if (value === "2013")
		dataNew = dataset_2013;
	
	_vis.xScale.domain(dataNew.map( function(d) { return d.state; } ));
					
	_vis.svg.select("#xaxis")
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
			
	
	_vis.yScale.domain([0, d3.max(dataNew, function(d) {				
					return Number.parseFloat(d["median income"].replace(',',''));
				})
			]);
				
	_vis.svg.select("#yaxis")
		.call(_vis.yAxis);
	
	_vis.svg.selectAll("rect")
		.data(dataNew)
		.transition()
		.duration(1000)
		.attr("y", function(d) { return _vis.yScale(Number.parseFloat(d["median income"].replace(',','')) ); })
		.attr("height", function(d) { 
			return _vis.height - _vis.yScale(Number.parseFloat(d["median income"].replace(',','') ) ); 
		});
		
	_vis.svg.select("#dataLabels")
				.selectAll("text")
					.data(dataNew)
					.transition()
					.duration(1000)
					.text(function(d) {
						return Number.parseFloat(d["median income"].replace(',',''));
					})
					.attr("text-anchor", "middle")
					.attr("x", function(d) { return _vis.xScale(d.state); })
					.attr("y", function(d) { 
						return _vis.yScale(
							Number.parseFloat(d["median income"].replace(',','')) 
							) + 15; 
						})
					.attr("fill","red")
					.attr("font-size","10px");
		
}

