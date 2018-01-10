(function () {
    /**
     * @ngInject
     */
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;
    
    angular
        .module('employeemanagement', [
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
            

                $stateProviderRef.state('manageemployee', {
                    url: '/manage-employee',                    
                    templateUrl: path.TEMPLATE+'restaurant-admin/employee/employee.html',
                    controller  : 'employeeController',
                    controllerAs  : 'vm',
                    data : { pageTitle: 'PAGE.MANGEMPLOYE',bodyClass:"employee-admin",teal:"teal"},
                    resolve: {permit: permitFunction,session: sessionfn},
                   
                });
                permitFunction.$inject = ['PermissionService'];
                 /* @ngInject */
                function permitFunction(PermissionService) {
                     PermissionService.checkPermission('/manage-employee');
                }
                sessionfn.$inject = ['SessionService'];
                 /* @ngInject */
                function sessionfn(SessionService) {
                    return SessionService.loginResolver().then(function(data){ return data });
                }
               

        }])
})();


