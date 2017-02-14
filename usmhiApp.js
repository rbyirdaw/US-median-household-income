
(function() {
  
  d3.csv("median-household-income-by-state-master.csv",
      function(error, data) {
        if (error) {
          return console.log(error);
        }

        console.log(data.length);

      }

  );

})();
