(function () {
    /**
     * @ngInject
     */
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('resetpassword', [
            'application.thirdparty'
        ])
        .config(['$stateProvider', 
            '$urlRouterProvider', 
            '$locationProvider', 
            '$httpProvider', 
            '$compileProvider',
            'PATHS',
            function (
                     $stateProvider,
                     $urlRouterProvider, 
                     $locationProvider, 
                     $httpProvider, 
                     $compileProvider,
                     path
                    ) 
            {  
            
            $urlRouterProviderRef = $urlRouterProvider;
            $stateProviderRef = $stateProvider;
            

            $stateProviderRef.state('reset', {
                url: '/resetpassword',  
                controller  : 'resetPasssword',
                controllerAs  : 'vm',                  
                templateUrl: path.TEMPLATE+'resetpassword/resetpassword.html',
                data : { pageTitle: 'PAGE.RESETPWD',bodyClass:"login"},
                resolve : {checkparams : paramcheck}

            });
            paramcheck.$inject = ['$q','$location','$state']
            
            function paramcheck($q,$location,$state) {
                var locationparamT = $location.search().utm_camp ? true : false;
                var locationparamU = $location.search().utm_hipher ? true : false;
         
                  var defer = $q.defer();
                  if(locationparamU === true && locationparamT === locationparamU){
                    defer.resolve();
                  } else {
                    $location.path('/login');
                   // defer.reject("/login");
                  }
                  return defer.promise;

            }
                
        }])
})();


