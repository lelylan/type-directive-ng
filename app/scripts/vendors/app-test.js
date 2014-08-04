angular.module('app', ['lelylan.directives.type', 'ngMockE2E']);

app.run(function($httpBackend, $timeout, Profile) {

  // fixtures path
  jasmine.getFixtures().fixturesPath = 'spec/fixtures';

  // set the user as logged
  Profile.set({id: '1'});

  // stub requests
  type = JSON.parse(readFixtures('type.json'));
  property = JSON.parse(readFixtures('property.json'));

  // mock requests
  $httpBackend.when('GET', /\/templates\//).passThrough();

  // type requests
  $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);

  // property create
  $httpBackend.whenPOST(/http:\/\/api.lelylan.com\/properties/).respond(property);

  // propeerty update
  $httpBackend.whenPUT(/http:\/\/api.lelylan.com\/properties\//).
    respond(function(method, url, data, headers) { return [200, updateProperty(data), {}]; });

  var updateProperty = function(data) {
    console.log(data);

    data = angular.fromJson(data);
    var property = _.find(type.properties, function(property) {
      return property.id == data.id
    });

    var property = type.properties[1];
    angular.extend(property, data);
    return data;
  }

});
