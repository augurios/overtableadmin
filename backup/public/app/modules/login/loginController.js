(function() {
    'use strict';

    angular
        .module('login')
        .controller('login', LoginController);

    LoginController.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','localStorageService','loginService'];
    
    function LoginController($scope, $state, $rootScope,$location,toaster,$http,localStorageService,loginService) {
    	var vm = this
    	this.buttontext = "Sign In"
        this.authenticate = function (){
        	this.buttontext = "Signing..."
        	   vm.buttontext = "Wait..";

		           if ($scope.authenticate.$valid) {
		                 var promise = loginService.login(vm.credential);
		                    promise.then(
		                      function(payload) { 
		                 
		                      	if(payload.data.success) {
		                                $rootScope.token =  payload.data.data.token;
		                                $http.defaults.headers.common['x-access-token'] = payload.data.data.token;
		                                localStorageService.set('_meanLanApp',payload.data.data.token);
		                                localStorageService.set('_meanLanAppLogIn',1);
		                                vm.buttontext = "Logined";
		                                window.location= '/dashboard'     
		                                //$location.path('/dashboard');  fix for refresh
		                                toaster.pop('success', "Success", payload.data.message)
		                            }
		                            else{
		                            	 toaster.pop('error', "Failed", payload.data.message)
		                            } 
		                      		 vm.buttontext = "Sign In";
		                        },
		                      function(errorPayload) {
		                          if(!errorPayload.success){
		                               toaster.pop('error', "Failed", errorPayload.message)
		                           }
		                      }); 
		           }
		           else{
		            vm.buttontext = "Sign In";
		            vm.submitted = true;
		           }
        }
    }
    	
})();