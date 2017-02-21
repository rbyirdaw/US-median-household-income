
(function() {
  
  d3.csv("median-household-income-by-state-master.csv",
      function(error, data) {
        if (error) {
          return console.log(error);
        }

        //console.log(data.length);

        var defData = data.filter(function(d) {
          return ( (d.year === "1999") && (d.state !== "United States") );
        });

        var view = new BarView();
        var svgOpt = {
          parentElement: '.svg-holder', 
          width: 1000,
          height: 400,
          margin: {top: 60, right: 20, bottom: 120, left: 80}
        }
          
        view.createSVG(svgOpt);

        var xData = defData.map(function(d) { return d.state; });
        var yData = d3.max(defData, function(d) { 
          return Number.parseFloat(d["median income"].replace(',',''));
	});
        view.createBarChart(xData, yData);  

      }

  );

})();
