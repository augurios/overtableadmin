(function() {
    'use strict';

    angular
        .module('employeeprofile')
        .controller('employeeprofileController', Controller);
  
    Controller.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','SessionService','localStorageService','$uibModal','employeeprofileService','PATHS','PermissionService','getEmployee'];
    /* @ngInject */
    function Controller($scope, $state, $rootScope,$location,toaster,$http,SessionService,localStorageService,$uibModal,employeeprofileService,PATHS,PermissionService,getEmployee) {
     
        //SessionService.getSession(); // get session details
        var vm = this;
        this.employee  =  getEmployee

        this.change = function(){
           employeeprofileService.updateUser(this.employee).then(successcallback,failPayload)
        }

        function successcallback(res){
            if(navigator.onLine){
                if(res.success)
                {
                    $rootScope.$broadcast('updatemployeelocaly');
                      toaster.pop('success', "Success", res.message)
                } 
                else {
                      toaster.pop('failed', "Failed", res.message)
                }
            }
            else{
                toaster.pop('success', "Success","Updated")
            }
           
        }
        function failPayload(err){
            console.log(err)
        }

        activateUserController()
        function activateUserController (){
        

        }//activateUserController
  		
    }
})();