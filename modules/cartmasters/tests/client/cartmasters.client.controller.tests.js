(function () {
  'use strict';

  describe('Cartmasters Controller Tests', function () {
    // Initialize global variables
    var CartmastersController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      CartmastersService,
      mockCartmaster;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _CartmastersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      CartmastersService = _CartmastersService_;

      // create mock Cartmaster
      mockCartmaster = new CartmastersService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'Cartmaster Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Cartmasters controller.
      CartmastersController = $controller('CartmastersController as vm', {
        $scope: $scope,
        cartmasterResolve: {}
      });

      // Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleCartmasterPostData;

      beforeEach(function () {
        // Create a sample Cartmaster object
        sampleCartmasterPostData = new CartmastersService({
          name: 'Cartmaster Name'
        });

        $scope.vm.cartmaster = sampleCartmasterPostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CartmastersService) {
        // Set POST response
        $httpBackend.expectPOST('api/cartmasters', sampleCartmasterPostData).respond(mockCartmaster);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the Cartmaster was created
        expect($state.go).toHaveBeenCalledWith('cartmasters.view', {
          cartmasterId: mockCartmaster._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/cartmasters', sampleCartmasterPostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock Cartmaster in $scope
        $scope.vm.cartmaster = mockCartmaster;
      });

      it('should update a valid Cartmaster', inject(function (CartmastersService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/cartmasters\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('cartmasters.view', {
          cartmasterId: mockCartmaster._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (CartmastersService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/cartmasters\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        // Setup Cartmasters
        $scope.vm.cartmaster = mockCartmaster;
      });

      it('should delete the Cartmaster and redirect to Cartmasters', function () {
        // Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/cartmasters\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('cartmasters.list');
      });

      it('should should not delete the Cartmaster and not redirect', function () {
        // Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
}());
