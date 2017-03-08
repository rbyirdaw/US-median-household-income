
(function(window) {

  var MASTER_DATA;

  function Storage(data) {
    MASTER_DATA = data;
  }
  Storage.prototype.find = function(year) {
    console.log('inside find with year = '+year);
    console.log('master data length = '+MASTER_DATA.length);
  };

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

