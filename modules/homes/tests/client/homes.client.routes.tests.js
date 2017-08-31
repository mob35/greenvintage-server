(function () {
  'use strict';

  describe('Homes Route Tests', function () {
    // Initialize global variables
    var $scope,
      HomesService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _HomesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      HomesService = _HomesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('homes');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/homes');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          HomesController,
          mockHome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('homes.view');
          $templateCache.put('modules/homes/client/views/view-home.client.view.html', '');

          // create mock Home
          mockHome = new HomesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Home Name'
          });

          // Initialize Controller
          HomesController = $controller('HomesController as vm', {
            $scope: $scope,
            homeResolve: mockHome
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:homeId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.homeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            homeId: 1
          })).toEqual('/homes/1');
        }));

        it('should attach an Home to the controller scope', function () {
          expect($scope.vm.home._id).toBe(mockHome._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/homes/client/views/view-home.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          HomesController,
          mockHome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('homes.create');
          $templateCache.put('modules/homes/client/views/form-home.client.view.html', '');

          // create mock Home
          mockHome = new HomesService();

          // Initialize Controller
          HomesController = $controller('HomesController as vm', {
            $scope: $scope,
            homeResolve: mockHome
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.homeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/homes/create');
        }));

        it('should attach an Home to the controller scope', function () {
          expect($scope.vm.home._id).toBe(mockHome._id);
          expect($scope.vm.home._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/homes/client/views/form-home.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          HomesController,
          mockHome;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('homes.edit');
          $templateCache.put('modules/homes/client/views/form-home.client.view.html', '');

          // create mock Home
          mockHome = new HomesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Home Name'
          });

          // Initialize Controller
          HomesController = $controller('HomesController as vm', {
            $scope: $scope,
            homeResolve: mockHome
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:homeId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.homeResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            homeId: 1
          })).toEqual('/homes/1/edit');
        }));

        it('should attach an Home to the controller scope', function () {
          expect($scope.vm.home._id).toBe(mockHome._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/homes/client/views/form-home.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
