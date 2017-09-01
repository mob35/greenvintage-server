(function () {
  'use strict';

  describe('Productmasters Route Tests', function () {
    // Initialize global variables
    var $scope,
      ProductmastersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ProductmastersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ProductmastersService = _ProductmastersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('productmasters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/productmasters');
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
          ProductmastersController,
          mockProductmaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('productmasters.view');
          $templateCache.put('modules/productmasters/client/views/view-productmaster.client.view.html', '');

          // create mock Productmaster
          mockProductmaster = new ProductmastersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Productmaster Name'
          });

          // Initialize Controller
          ProductmastersController = $controller('ProductmastersController as vm', {
            $scope: $scope,
            productmasterResolve: mockProductmaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:productmasterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.productmasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            productmasterId: 1
          })).toEqual('/productmasters/1');
        }));

        it('should attach an Productmaster to the controller scope', function () {
          expect($scope.vm.productmaster._id).toBe(mockProductmaster._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/productmasters/client/views/view-productmaster.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ProductmastersController,
          mockProductmaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('productmasters.create');
          $templateCache.put('modules/productmasters/client/views/form-productmaster.client.view.html', '');

          // create mock Productmaster
          mockProductmaster = new ProductmastersService();

          // Initialize Controller
          ProductmastersController = $controller('ProductmastersController as vm', {
            $scope: $scope,
            productmasterResolve: mockProductmaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.productmasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/productmasters/create');
        }));

        it('should attach an Productmaster to the controller scope', function () {
          expect($scope.vm.productmaster._id).toBe(mockProductmaster._id);
          expect($scope.vm.productmaster._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/productmasters/client/views/form-productmaster.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ProductmastersController,
          mockProductmaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('productmasters.edit');
          $templateCache.put('modules/productmasters/client/views/form-productmaster.client.view.html', '');

          // create mock Productmaster
          mockProductmaster = new ProductmastersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Productmaster Name'
          });

          // Initialize Controller
          ProductmastersController = $controller('ProductmastersController as vm', {
            $scope: $scope,
            productmasterResolve: mockProductmaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:productmasterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.productmasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            productmasterId: 1
          })).toEqual('/productmasters/1/edit');
        }));

        it('should attach an Productmaster to the controller scope', function () {
          expect($scope.vm.productmaster._id).toBe(mockProductmaster._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/productmasters/client/views/form-productmaster.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
