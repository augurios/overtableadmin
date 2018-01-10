(function () {
    /**
     * @ngInject
     */
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('login', [
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
            

                $stateProviderRef.state('/', {
                    url: '/',                    
                    templateUrl: path.TEMPLATE+'login/login.html',
                    controller  : 'login',
                    data : { pageTitle: 'PAGE.LOGIN',bodyClass:"login",teal:"purple",lbg:"123"},
                    //resolve: {hellodash: resolverLogin},
                    resolve: {hellodash: rootpage},
                   
                });
                $stateProviderRef.state('/login', {
                    url: '/login',                    
                    templateUrl: path.TEMPLATE+'login/login.html',
                    controller  : 'login',
                    data : { pageTitle: 'PAGE.LOGIN',bodyClass:"login"},
                    
                  //  resolve: {hellodash: resolverLogin},
                });

                
                resolverLogin.$inject = ['SessionService'];
                function resolverLogin(SessionService) {
                     SessionService.loginResolver().then(function(data) {return data});
                }
                 rootpage.$inject = ['$state','SessionService'];
                function rootpage($state,SessionService) {
                     if(!SessionService.isLoggedIn()){}
                }
        }])
})();


