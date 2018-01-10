(function () {
    /**
     * @ngInject
     */
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('dashboard', [
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
            $stateProviderRef.state('admindashboard', {
                    url: '/dashboard',                    
                    templateUrl: path.TEMPLATE+'dashboard/dashboard.html',
                    controller  : 'dashboard',
                    controllerAs  : 'vm',
                    data : { pageTitle: 'PAGE.DASHBOARD',bodyClass:"dashboard",teal:"teal",lbg:"123"},
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


