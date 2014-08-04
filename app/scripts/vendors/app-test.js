angular.module('app', ['lelylan.directives.type', 'ngMockE2E']);

app.run(function($httpBackend, $timeout, Profile) {

  // fixtures path
  jasmine.getFixtures().fixturesPath = 'spec/fixtures';

  // set the user as logged
  Profile.set({id: '1'});

  // stub requests
  type = JSON.parse(readFixtures('type.json'));

  // mock requests
  $httpBackend.when('GET', /\/templates\//).passThrough();
  $httpBackend.whenGET('http://api.lelylan.com/types/1').respond(type);
});
