
(function(window) {
  
  function USmhiModel(data, storage) {
    this._data = data;
    this._storage = storage;
  }

//=============================================================================

  USmhiModel.prototype.getData = function() {
    return this._data;
  };

//=============================================================================

  USmhiModel.prototype.read = function(year) {
    this._data = this._storage.find(year);
  }

//=============================================================================

  window.usmhiApp = usmhiApp || {};
  window.usmhiApp.Model = USmhiModel;

})(window);



    
