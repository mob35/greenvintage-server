(function () {
  'use strict';

  describe('Ordermasters Route Tests', function () {
    // Initialize global variables
    var $scope,
      OrdermastersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _OrdermastersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      OrdermastersService = _OrdermastersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('ordermasters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/ordermasters');
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
          OrdermastersController,
          mockOrdermaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('ordermasters.view');
          $templateCache.put('modules/ordermasters/client/views/view-ordermaster.client.view.html', '');

          // create mock Ordermaster
          mockOrdermaster = new OrdermastersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ordermaster Name'
          });

          // Initialize Controller
          OrdermastersController = $controller('OrdermastersController as vm', {
            $scope: $scope,
            ordermasterResolve: mockOrdermaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:ordermasterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.ordermasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            ordermasterId: 1
          })).toEqual('/ordermasters/1');
        }));

        it('should attach an Ordermaster to the controller scope', function () {
          expect($scope.vm.ordermaster._id).toBe(mockOrdermaster._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/ordermasters/client/views/view-ordermaster.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          OrdermastersController,
          mockOrdermaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('ordermasters.create');
          $templateCache.put('modules/ordermasters/client/views/form-ordermaster.client.view.html', '');

          // create mock Ordermaster
          mockOrdermaster = new OrdermastersService();

          // Initialize Controller
          OrdermastersController = $controller('OrdermastersController as vm', {
            $scope: $scope,
            ordermasterResolve: mockOrdermaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.ordermasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/ordermasters/create');
        }));

        it('should attach an Ordermaster to the controller scope', function () {
          expect($scope.vm.ordermaster._id).toBe(mockOrdermaster._id);
          expect($scope.vm.ordermaster._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/ordermasters/client/views/form-ordermaster.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          OrdermastersController,
          mockOrdermaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('ordermasters.edit');
          $templateCache.put('modules/ordermasters/client/views/form-ordermaster.client.view.html', '');

          // create mock Ordermaster
          mockOrdermaster = new OrdermastersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Ordermaster Name'
          });

          // Initialize Controller
          OrdermastersController = $controller('OrdermastersController as vm', {
            $scope: $scope,
            ordermasterResolve: mockOrdermaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:ordermasterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.ordermasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            ordermasterId: 1
          })).toEqual('/ordermasters/1/edit');
        }));

        it('should attach an Ordermaster to the controller scope', function () {
          expect($scope.vm.ordermaster._id).toBe(mockOrdermaster._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/ordermasters/client/views/form-ordermaster.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
