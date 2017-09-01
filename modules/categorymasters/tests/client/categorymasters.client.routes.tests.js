(function () {
  'use strict';

  describe('Categorymasters Route Tests', function () {
    // Initialize global variables
    var $scope,
      CategorymastersService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _CategorymastersService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      CategorymastersService = _CategorymastersService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('categorymasters');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/categorymasters');
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
          CategorymastersController,
          mockCategorymaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('categorymasters.view');
          $templateCache.put('modules/categorymasters/client/views/view-categorymaster.client.view.html', '');

          // create mock Categorymaster
          mockCategorymaster = new CategorymastersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Categorymaster Name'
          });

          // Initialize Controller
          CategorymastersController = $controller('CategorymastersController as vm', {
            $scope: $scope,
            categorymasterResolve: mockCategorymaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:categorymasterId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.categorymasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            categorymasterId: 1
          })).toEqual('/categorymasters/1');
        }));

        it('should attach an Categorymaster to the controller scope', function () {
          expect($scope.vm.categorymaster._id).toBe(mockCategorymaster._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/categorymasters/client/views/view-categorymaster.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          CategorymastersController,
          mockCategorymaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('categorymasters.create');
          $templateCache.put('modules/categorymasters/client/views/form-categorymaster.client.view.html', '');

          // create mock Categorymaster
          mockCategorymaster = new CategorymastersService();

          // Initialize Controller
          CategorymastersController = $controller('CategorymastersController as vm', {
            $scope: $scope,
            categorymasterResolve: mockCategorymaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.categorymasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/categorymasters/create');
        }));

        it('should attach an Categorymaster to the controller scope', function () {
          expect($scope.vm.categorymaster._id).toBe(mockCategorymaster._id);
          expect($scope.vm.categorymaster._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/categorymasters/client/views/form-categorymaster.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          CategorymastersController,
          mockCategorymaster;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('categorymasters.edit');
          $templateCache.put('modules/categorymasters/client/views/form-categorymaster.client.view.html', '');

          // create mock Categorymaster
          mockCategorymaster = new CategorymastersService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Categorymaster Name'
          });

          // Initialize Controller
          CategorymastersController = $controller('CategorymastersController as vm', {
            $scope: $scope,
            categorymasterResolve: mockCategorymaster
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:categorymasterId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.categorymasterResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            categorymasterId: 1
          })).toEqual('/categorymasters/1/edit');
        }));

        it('should attach an Categorymaster to the controller scope', function () {
          expect($scope.vm.categorymaster._id).toBe(mockCategorymaster._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/categorymasters/client/views/form-categorymaster.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
