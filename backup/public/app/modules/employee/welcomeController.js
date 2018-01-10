(function() {
    'use strict';

    angular
        .module('welcomeEmployee')
        .controller('employeeWelcomeController', Controller);
  
    Controller.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','SessionService','localStorageService','$uibModal','PATHS','PermissionService','empService'];
    /* @ngInject */
    function Controller($scope, $state, $rootScope,$location,toaster,$http,SessionService,localStorageService,$uibModal,PATHS,PermissionService, empService) {
    
        //SessionService.getSession(); // get session details
        var vm = this;
       
        activateUserController()
        function activateUserController (){
        

        }//activateUserController
  		
    }
})();