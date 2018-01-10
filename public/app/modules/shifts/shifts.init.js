(function () {
    /**
     * @ngInject
     */
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('shifts', [
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
                     path,$rootScope
                    ) 
            {  
            
            $urlRouterProviderRef = $urlRouterProvider;
            $stateProviderRef = $stateProvider;
            
            // loads url from the index
            $stateProviderRef.state('shifts', {
                    url: '/shifts',                    
                    templateUrl: path.TEMPLATE+'shifts/shifts.html',
                    controller  : 'shiftsController',
                    controllerAs  : 'vm',
                    data : { pageTitle: 'PAGE.DASHBOARD',bodyClass:"shifts",teal:"teal",lbg:"123"},
                    resolve: {
                        session: sessionfn
                    }
            });
            

        }])
            sessionfn.$inject = ['SessionService'];
            function sessionfn(SessionService) {
                return SessionService.loginResolver().then(function(data){ return data });
            }
})();


