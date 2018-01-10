(function() {
    'use strict';

    angular
        .module('login')
        .controller('login', LoginController);
        LoginController.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','localStorageService','loginService','resetService','$translate','$timeout','$filter','$sanitize','translationService'];
    
    function LoginController($scope, $state, $rootScope,$location,toaster,$http,localStorageService,loginService,resetService,$translate,$timeout,$filter,$sanitize,translationService) {
        var vm = this;
        vm.buttontext,vm.title_fail,vm.title_success,vm.message = ""
        vm.disabled;

        $scope.$watch(
            function() { return $filter('translate')('SIGNIN'); },
            function(newval) { vm.buttontext  = newval; }
        );
       

        this.authenticate = function (){
             vm.disabled = true;
             $scope.$watch(
                function() { return $filter('translate')('LOGGINGIN'); },
                function(newval) { vm.buttontext  = newval; }
             );
             $timeout(sendLogin)
		           
        }
        function sendLogin(){
          if ($scope.authenticationform.$valid) {
                     var promise = loginService.login(vm.credential);
                        promise.then(
                          function(payload) { 
                     
                            if(payload.data.success) {
                                    vm.disabled = true;
                                    $rootScope.token =  payload.data.data.token;
                                    $rootScope.logedInUser = payload.data.data;
                                    $rootScope.logedInUserId = payload.data.data.userid;
                                    localStorage.setItem('logedInUser', JSON.stringify(payload.data.data));
                                    $http.defaults.headers.common['x-access-token'] = payload.data.data.token;
                                    $http.defaults.headers.common['logedInUserId'] = $rootScope.logedInUserId;

                                    localStorageService.set('_apref',payload.data.data.token);
                                    localStorageService.set('_aplogin',1);
                                    
                                    $scope.$watch(
                                        function() { return $filter('translate')('SIGNIN'); },
                                        function(newval) { vm.buttontext  = newval; }
                                    );

                                    $location.path('/dashboard'); 
                                     $scope.$watch(
                                        function() { return $filter('translate')(payload.data.message); },
                                        function(newval) { vm.message  = newval; }
                                    );
                                    
                                  
                                    $timeout(function(){
                                      toaster.pop('success', $scope.title_success , vm.message)
                                      
                                    },500)
                                }
                                else{
                                  vm.disabled = "";
                                  $scope.$watch(
                                        function() { return $filter('translate')(payload.data.message); },
                                        function(newval) { vm.message  = newval;}
                                    );

                                   $scope.$watch(
                                      function() { return $filter('translate')('SIGNIN'); },
                                      function(newval) { vm.buttontext  = newval; }
                                  );
                                   
                                   $timeout(function(){
                                          toaster.pop('error', $scope.title_fail , vm.message)
                                        },500)
                                   
                                } 
                               
                            },
                          function(errorPayload) {
                              if(!errorPayload.success){
                                   toaster.pop('error', $scope.title_fail, errorPayload.message)
                               }
                               $scope.$watch(
                                    function() { return $filter('translate')('SIGNIN'); },
                                    function(newval) { vm.buttontext  = newval; }
                                );
                               vm.disabled = "";
                               vm.credential = null
                          }); 
               }
               else{
                $scope.$watch(
                    function() { return $filter('translate')('SIGNIN'); },
                    function(newval) { vm.buttontext  = newval; }
                );
                vm.submitted = true;
                vm.disabled = "";
               }
        }
        this.forgot = function(){
          if ($scope.forgotpassword.$valid) {
            resetService.requestChangePassword(vm.user).then(function(data){
              vm.user.forgotpassword = null
              $state.reload();
                    if(data.success){
                        toaster.pop("success",$rootScope.title_success, translationService.demand(data.message))
                    }
                    else{
                        toaster.pop("error",$rootScope.title_fail, translationService.demand(data.message))
                    }
            },
            function(err){
              toaster.pop('info', $rootScope.title_fail ,  translationService.demand("MESSAGES.ERROROCCURED"))
            })
          }
          else{
             toaster.pop('info', $rootScope.title_fail ,  translationService.demand("MESSAGES.ALLFIELDSRQ"))
          }

        }

    }
})();