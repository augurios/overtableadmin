(function () {
    /**
     * @ngInject
     */
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('usermodule', [
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
            

                $stateProviderRef.state('user', {
                    url: '/user',                    
                    templateUrl: path.TEMPLATE+'user/user.html',
                    data : { pageTitle: 'PAGE.MANGEUSER',bodyClass:"user",teal:"teal"},
                    resolve: {permit: permitFunction,session: sessionfn},
                   
                });
                permitFunction.$inject = ['PermissionService'];
                function permitFunction(PermissionService) {
                     PermissionService.checkPermission('/user');
                }
                sessionfn.$inject = ['SessionService'];
                function sessionfn(SessionService) {
                    return SessionService.loginResolver().then(function(data){ return data });
                }

        }])
})();


