(function() {
    'use strict';

    angular
        .module('resetpassword')
        .controller('resetPasssword', Controller);
  
    Controller.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','SessionService','localStorageService','helper','$uibModal','userService','PATHS','PermissionService','resetService','translationService'];
    /* @ngInject */
    function Controller($scope, $state, $rootScope,$location,toaster,$http,SessionService,localStorageService,helper,$uibModal,userService,PATHS,PermissionService,resetService,translationService) {
     
        //SessionService.getSession(); // get session details
        var vm = this;
        activateUserController()
        function activateUserController (){

        }//activateUserController
        this.changepassword = function(){
            
            vm.credential.token = $location.search().utm_camp;
            vm.credential.email = $location.search().utm_hipher;

            //if($scope.changepassword.$valid){
                if(vm.credential.new != vm.credential.confirm){
                    toaster.pop("error",$rootScope.title_fail , translationService.demand("MESSAGES.PASSWORDNOTMATCH"))
                    return false
                }
                resetService.changePassword(vm.credential).then(function(data){
                    $scope.changepassword = {}
                    
                    if(data.success){
                        $state.go('/login');
                        toaster.pop("success",$rootScope.title_success , translationService.demand(data.message))
                    }
                    else{
                        toaster.pop("error", $rootScope.title_fail ,translationService.demand(data.message))
                    }
                },function(err){

                })
            //}
        }
  	}
    
})();