
(function(window) {

  var MASTER_DATA;

//=============================================================================
  function Storage(data) {
    MASTER_DATA = data;
  }

//=============================================================================
  Storage.prototype.find = function(year) {

    var resultData = MASTER_DATA.filter(function(d) {
      return ( (+d.year === year) && (d.state !== "United States") );
    });

    return resultData;
  };

//=============================================================================
  var instance;
  var getInstance = function(data) {
    if (instance === undefined) {
      instance = new Storage(data);
    }
    return instance;
  };

  window.usmhiApp = window.usmhiApp || {};
  window.usmhiApp.Storage = {getInstance: getInstance};

})(window);

