
(function() {
  
  d3.csv("median-household-income-by-state-master.csv",
      function(error, data) {
        if (error) {
          return console.log(error);
        }

        var pseudoStorage = usmhiApp.Storage.getInstance(data);

        var defData = pseudoStorage.find(1999);
        var model = new usmhiApp.Model(defData, pseudoStorage);

        var view = new BarView();
        var svgOpt = {
          parentElement: '.svg-holder', 
          width: 1000,
          height: 500,
          margin: {top: 60, right: 20, bottom: 120, left: 80}
        }
          
        view.createSVG(svgOpt);

        var xData = defData.map(function(d) { return d.state; });
        var yData = defData.map(function(d) { 
          return Number.parseFloat(d["median income"].replace(',',''));
        });

        view.createBarChart(xData, yData); 

        var controller = new usmhiApp.Controller(model, view);

      }

  );

})();
