angular.module('burgerBrowser',[])
.factory('sessionService', [function(){
  var session = {};

  session.create = function(_id, sessionID, name, email, provider){
    this._id = _id;
    this.sessionID = sessionID;
    this.name = name;
    this.email = email;
    this.provider = provider;
  };

  session.destroy = function(){
    this._id = null;
    this.sessionID = null;
    this.name = null;
    this.email = null;
    this.provider = null;
  };

  return session;

}]);
