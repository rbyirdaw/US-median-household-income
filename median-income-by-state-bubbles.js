
var _vis = {};

//==============================================================================
function init() {
	_vis = {
		paddingTop: 0,

		margin: {top: 1, right: 20, bottom: 20, left: 20},
		width: 850,
		height: 750,
		
		svg: undefined,
		diameter: undefined,
		
		//Data being displayed - default is 2014
		data: undefined,
		
		dataUSavg: [],
		//Complete data
		dataMaster: [],
		
		defYear: "2014"
	};
	
	//Adjust width, height
	_vis.width = _vis.width - _vis.margin.left - _vis.margin.right;
	_vis.height = _vis.height - _vis.margin.top - _vis.margin.bottom;
	
	_vis.diameter = 0.96 * _vis.width;
	_vis.color = d3.scale.category20b();
	
		
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
			
			createSVG();
			//create elements
			create();
				

		}
	);
		
	
	//Set up HTML event listeners
		
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
				.attr("class", "center-svg")
				.attr("width", _vis.width + _vis.margin.left + 
					_vis.margin.right)
				.attr("height", _vis.height + _vis.margin.top + 
					_vis.margin.bottom)
				.append("g")
					.attr("transform", "translate(" + _vis.margin.left + 
						"," + _vis.margin.top + ")");
	
}
//==============================================================================
function create() {			


	var dataSet = [];
	d3.map(_vis.data, function(d) {
		dataSet.push(
			{
				value: incomeStrToNum(d["median income"]),
				state: d.state,
				income: d["median income"]
			}
		);
	});

	
	_vis.bubble = d3.layout.pack()
		.sort(null)
		.size([_vis.diameter, _vis.diameter])
		.padding(1.5);

	_vis.nodes = _vis.svg.selectAll(".node")
		.data(_vis.bubble.nodes({children:dataSet}).filter(function(d) { return !d.children; }) )
		.enter()
		.append("g")
		.attr("class", "node")
		.attr("transform", "translate(0,0)");
		//.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
	
    //create the bubbles
	_vis.nodes.append("circle")
		.style("fill", function(d) { console.log(typeof d.value); return _vis.color(d.value); });

    
	_vis.nodes.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "state")
		.style({
			"fill":"white", 
			"font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
			"font-size": "12px"
		});
		
	_vis.nodes.append("text")
		.attr("text-anchor", "middle")
		.attr("class", "income")
		.style({
			"fill":"white", 
			"font-family":"Helvetica Neue, Helvetica, Arial, san-serif",
			"font-size": "12px"
		});		

	//first plot
	plot();
		
}

//==============================================================================
function plot() {
  	_vis.nodes.select("circle")
    .transition()
		.attr("r", function(d){ return d.r; })
		.attr("cx", function(d){ return d.x; })
		.attr("cy", function(d){ return d.y; })
		
    
    _vis.nodes.select(".state")
      .transition()
		.attr("x", function(d){ return d.x; })
		.attr("y", function(d){ return d.y - 5; })
		.text(function(d){ return d.state; });

    _vis.nodes.select(".income")
      .transition()
		.attr("x", function(d){ return d.x; })
		.attr("y", function(d){ return d.y + 10; })
		.text(function(d){ return "$"+d.income; });		

}




//==============================================================================

function update(yearSelected) {
	

	_vis.data = [];
	_vis.data = _vis.dataMaster.filter(function(d) { 
			return ( (d.year === yearSelected) && 
				(d.state !== "United States") );
		}
	);

	var dataSet = [];
	d3.map(_vis.data, function(d) {
		dataSet.push(
			{
				value: incomeStrToNum(d["median income"]),
				state: d.state,
				income: d["median income"]
			}
		);
	});
	
	_vis.nodes
		.data(_vis.bubble.nodes({
			children:dataSet}).filter(function(d) { 
				return !d.children; }) 
			);
		
	d3.select(".yearDisplay")
		.text(yearSelected);
		
	plot();
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
	

		
		
	
}
//==============================================================================
function incomeStrToNum(incomeStr) {
	return +incomeStr.replace(',','');
	
}
