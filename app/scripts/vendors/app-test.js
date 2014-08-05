angular.module('app', ['lelylan.directives.type', 'ngMockE2E']);

app.run(function($httpBackend, $timeout, Profile) {

  // fixtures path
  jasmine.getFixtures().fixturesPath = 'spec/fixtures';

  // set the user as logged
  Profile.set({id: '1'});

  // stub requests
  var type      = JSON.parse(readFixtures('type.json'));
  var property  = JSON.parse(readFixtures('property.json'));
  var _function = JSON.parse(readFixtures('function.json'));
  var status    = JSON.parse(readFixtures('status.json'));

  // mock requests
  $httpBackend.when('GET', /\/templates\//).passThrough();

  /*
   * Type mocks
   */

  $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);
  $httpBackend.whenPUT('http://api.lelylan.com/types/1').respond(type);

  /*
   * Property mocks
   */

  $httpBackend.whenPOST(/http:\/\/api.lelylan.com\/properties/).respond(property);
  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/properties\//).
    respond(function(method, url, data, headers) { return [200, updateProperty(data), {}]; });
  $httpBackend.whenDELETE(/http:\/\/api.lelylan.com\/properties\//).
    respond(function(method, url, data, headers) { return [200, deleteProperty(data), {}]; });

  var updateProperty = function(data) {
    data = angular.fromJson(data);
    console.log(data)
    var property = _.find(type.properties, function(property) { return property.id == data.id });
    if (property) { angular.extend(property, data) }
    return data;
  }

  var deleteProperty = function(data) {
    var property = type.properties.splice(0, 1);
    return property;
  }


  /*
   * Function mocks
   */

  $httpBackend.whenPOST(/http:\/\/api.lelylan.com\/functions/).respond(_function);
  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/functions\//).
    respond(function(method, url, data, headers) { return [200, updateFunction(data), {}] });
  $httpBackend.whenDELETE(/http:\/\/api.lelylan.com\/functions\//).
    respond(function(method, url, data, headers) { return [200, deleteFunction(data), {}] });

  var updateFunction = function(data) {
    data = angular.fromJson(data);
    var _function = _.find(type.functions, function(_function) { return _function.id == data.id });
    if (_function) { angular.extend(_function, data) }
    return data;
  }

  var deleteFunction = function(data) {
    var _function = type.functions.splice(0, 1);
    return _function;
  }


  /*
   * Status mocks
   */

  $httpBackend.whenPOST(/http:\/\/api.lelylan.com\/statuses/).respond(status);
  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/statuses\//).
    respond(function(method, url, data, headers) { return [200, updateStatus(data), {}] });
  $httpBackend.whenDELETE(/http:\/\/api.lelylan.com\/statuses\//).
    respond(function(method, url, data, headers) { return [200, deleteStatus(data), {}] });

  var updateStatus = function(data) {
    data = angular.fromJson(data);
    console.log(data)
    var _status = _.find(type.statuses, function(status) { return status.id == data.id });
    if (status) { angular.extend(status, data) }
    return data;
  }

  var deleteStatus = function(data) {
    var _status = type.statuses.splice(0, 1);
    return _status;
  }

});
