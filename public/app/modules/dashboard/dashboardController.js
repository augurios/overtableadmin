(function() {
    'use strict';

    angular
        .module('dashboard')
        .controller('dashboard', Controller);

    Controller.$inject = ['SessionService','localStorageService','dashboardService','toaster','session','$translate','translationService','$timeout','$scope'];
    /* @ngInject */
    function Controller(SessionService,localStorageService,dashboardService,toaster,session,$translate,translationService,$timeout,$scope) {
        var vm = this;
        //SessionService.getSession(); // get session details        
        activate();

        function activate() {
             dashboardService.getToken().then(function(data) {
                vm.user = {
                    tokenvar: data.data[0].token
                }
            });
        }
        vm.btn = {
            savenewtoken: false
        }
        vm.generateotoken = function (){
            dashboardService.shownewToken().then(function(data) {
              vm.user = {
                    tokenvar: data.data
                }
                vm.btn = {
                    savenewtoken: true
                }
            });
        }
        
        vm.savenewtoken = function (){
            if(vm.user.token != ""){
               dashboardService.newToken(vm.user).then(function(data) {
                    if(data.success) { 
                     $timeout(function(){
                          toaster.pop('success', $scope.title_success , translationService.demand(data.message))
                          
                        },500)  
                    }
                    else{

                    }   
                    vm.btn = {
                        savenewtoken: false
                    }            
                }); 
            }
            else{
                //alert()
            }
            
        }
    }
})();