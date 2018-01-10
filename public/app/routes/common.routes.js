(function () {
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('application.routes', [
        ])
        .config(['$stateProvider', 
            '$urlRouterProvider', 
            '$locationProvider', 
            '$httpProvider', 
            '$compileProvider','PATHS',
            function (
                     $stateProvider,
                     $urlRouterProvider, 
                     $locationProvider, 
                     $httpProvider, 
                     $compileProvider,path
                   ) 
            {  
            
            $urlRouterProviderRef = $urlRouterProvider;
            $locationProvider.html5Mode(true);
            $stateProviderRef = $stateProvider;
            $urlRouterProvider.otherwise('/404');
            
             
            $stateProviderRef.state('404', {
                    url: '/404',                    
                    templateUrl: path.TEMPLATE+'errors/404.html',
                    controller  : 'not_found',
                    data : { pageTitle: 'PAGE.NOTFOUND',bodyClass:"page-404","nopanel": true},
            });
        }])
})();


