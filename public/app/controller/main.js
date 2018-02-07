(function() {
    'use strict';

    angular
        .module('serverMeanapp')
        .controller('not_found', NotFoundController)
        .controller('main', Controller)

    
    /* @ngInject */
    function NotFoundController() {
        var vm = this;
        vm.title = 'Controller';

        activate();

        ////////////////

        function activate() {
        }
    }

   

    Controller.$inject = ['$scope', '$state', '$rootScope', '$http', '$window', 'localStorageService', 'SessionService', 'PermissionService', 'toaster', '$translate', '$filter', 'profileService'];
    
     /* @ngInject */
    function Controller($scope, $state, $rootScope, $http, $window, localStorageService, SessionService, PermissionService, toaster, $translate, $filter,profileService) {
        var core = this;
        core.haspermission = function(url){
           PermissionService.checkPermissionMenu(url);
        }
        core.logout = function () {
      
            localStorageService.clearAll();
            $rootScope.token  = {};
            $rootScope.user = {}
            $rootScope.info = {}                              
            SessionService.logOut();
        }
        $scope.changeLanguage = function(langKey) {
          $translate.use(langKey);
        };

        $scope.$watch(
            function() { return $filter('translate')('FAILED'); },
            function(newval) {
             $scope.title_fail  = newval; 
             $rootScope.title_fail  = newval; 
            }
        );
        $scope.$watch(
            function() { return $filter('translate')('SUCCESS'); },
            function(newval) {
             $scope.title_success  = newval; 
             $rootScope.title_success  = newval; 
            }
        );

        $scope.getUserData = function () {
            try {
                var loggedUser = JSON.parse(localStorage.getItem('logedInUser'));
                profileService.getUserDetails(loggedUser.userid).then(function (resData) {
                    if (resData.data.image)
                        $scope.userlogo = resData.data.image;
                    //$scope.$apply();
                });
            } catch (err) {

            }
        }

        $scope.$on("LOADDUSERDATA", function (evt, data) {
            $scope.getUserData(); 
        });

        $scope.getUserData();
    }
})();