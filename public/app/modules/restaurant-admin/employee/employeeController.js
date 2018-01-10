(function() {
    'use strict';

    angular
        .module('employeemanagement')
        .controller('employeeController', Controller)
        .controller('CreateEmployee', CreateEmployeeController)
        .controller('EditEmployee', EditEmployeeController)
  
    Controller.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','SessionService','localStorageService','helper','$uibModal','employeeService','PATHS','PermissionService','SweetAlert','translationService'];
    /* @ngInject */
    function Controller($scope, $state, $rootScope,$location,toaster,$http,SessionService,localStorageService,helper,$uibModal,employeeService,PATHS,PermissionService,SweetAlert,translationService) {
     

        var vm = this;
        vm.data = {}
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.headers = []
        $rootScope.$on("partialLoadEmployeeContrller", function(){
           activateUserController()
        })

        activateUserController()
        function activateUserController (){
            employeeService.myEmployees().then(doneCallbacksDataGrid, failCallbacks)
        }//activateUserController
        
        function doneCallbacksDataGrid(data){

            if(data.success){
            vm.users = data.data
            $scope.headers = []
            var objt = []
             
             var i =0;
                angular.forEach(vm.users, function(value, key) {
                  if(key == 0) {
                     objt = value
                    }
                });

                angular.forEach(objt, function(val, item) {
                  if(item != "_id"){
                     item = item.replace('_', ' ');
                     var js = {}
                     js.heading = item;
                     js.show = true;
                     $scope.headers[i] = js;
                     i++
                  }
                
                })
            $scope.headers.reverse()
            var removeheader = []
            $rootScope.info.role == "admin" ? removeheader = ['pin','dateofbirth','position'] : removeheader = ['pin','dateofbirth','position','restaurant']
            /*helper.createHeader($scope.headers,removeheader).then(function(head){
                $scope.headers = head
            })*/

           angular.forEach(removeheader, function(key,value){
            $scope.headers = $.grep($scope.headers, function(e){ 
                 return e.heading != key
            });
           })
            
            $scope.totalsize = vm.users.length;
          }
          else{
            toaster.pop('error', $rootScope.title_fail , translationService.demand(data.message))
          }
        }

        function failCallbacks(err){

        }

        //Model Popups
        this.modal = function (info) {
             if(typeof info == "undefined"){
                 var modalInstance = $uibModal.open({
                      animation: true,
                      templateUrl: PATHS.popup+'employee.add.html',
                      controller: 'CreateEmployee',
                      controllerAs: 'vm',
                      resolve: {getResturants  :  listOfrestaurants }
                  });
              }
              else{
                    var modalInstance = $uibModal.open({
                      animation: true,
                      templateUrl: PATHS.popup+'employee.edit.html',
                      controller:"EditEmployee",
                      controllerAs:"vm",
                      resolve: {
                        data: function () {
                          return info;
                        }
                      }
                      
                  });
              }
             
        };
        this.deleteAction = function(user){
            SweetAlert.swal({   
              title: translationService.demand("MESSAGES.SWALTITLE.DELETE.TITLE"),
              text: translationService.demand("MESSAGES.SWALTITLE.DELETE.TEXT"),
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: translationService.demand("MESSAGES.SWALTITLE.DELETE.CONFIRMTEXT"),
              closeOnConfirm: true
            }, function(isConfirm){  
              if (isConfirm) {     
                 if(user){
       
                  employeeService.DeleteEmployee({userinfo:user}).then(function(data){
                    $rootScope.$emit("partialLoadEmployeeContrller", {});
                    toaster.pop('success', $rootScope.title_success , translationService.demand(data.message))
                  })
                }
               
              }
              })
        }
      }
  	// Add Employe
    CreateEmployeeController.$inject = ['$uibModalInstance','$scope','$state','$rootScope','SessionService','$stateParams','$location','$window','toaster','employeeService','getResturants','translationService'];
    /* @ngInject */
    function CreateEmployeeController($uibModalInstance, $scope, $state, $rootScope,SessionService, $stateParams, $location,$window,toaster,employeeService,getResturants,translationService) {
        var vm = this
       
        vm.employee = {}
        if(getResturants.data){
          vm.employee.restaurants = getResturants.data
        }

        this.create = function(){
            if (vm.userform.$valid) {
                employeeService.createEmployee(vm.employee).then(function(data){
                  $rootScope.$emit("partialLoadEmployeeContrller", {});
                  
                  if(data.success){
                    toaster.pop('success', $rootScope.title_success , translationService.demand(data.message))
                    $uibModalInstance.close('ok');
                  }
                  else{
                     toaster.pop('error', $rootScope.title_fail , translationService.demand(data.message))
                     $uibModalInstance.close('ok');
                  }
                  
                },function(err){
                  console.log(err)
                })
             
           }
           else{
               toaster.pop('error', $rootScope.title_fail ,  translationService.demand("MESSAGES.ALLFIELDSRQ"))
           }
        }

        $scope.close = function(){
          $uibModalInstance.close('ok');
        }
    }
    // Edit Employe
    EditEmployeeController.$inject = ['$uibModalInstance','$scope','$state','$rootScope','SessionService','$stateParams','$location','$window','toaster','employeeService','data','translationService'];
    /* @ngInject */
    function EditEmployeeController($uibModalInstance, $scope, $state, $rootScope,SessionService, $stateParams, $location,$window,toaster,employeeService,data,translationService) {
        var vm = this
        vm.employee = data;
   
        $scope.close = function(){
          $uibModalInstance.close('ok');
        }

        this.update = function(){
            if (vm.userform.$valid) {
                employeeService.updateEmployee(vm.employee).then(function(data){
                  $rootScope.$emit("partialLoadEmployeeContrller", {});
                  
                  if(data.success){
                    toaster.pop('success',$rootScope.title_success , translationService.demand(data.message))
                    $uibModalInstance.close('ok');
                  }
                  else{
                     toaster.pop('error', $rootScope.title_fail , translationService.demand(data.message))
                     $uibModalInstance.close('ok');
                  }
                  
                },function(err){
                  console.log(err)
                })
             
           }
           else{
               toaster.pop('error', $rootScope.title_fail ,  translationService.demand("MESSAGES.ALLFIELDSRQ"))
           }
        }
      }
    
    listOfrestaurants.$inject = ['restaurantService'];
     /* @ngInject */
    function listOfrestaurants(restaurantService) {
        return restaurantService.getList().then(function(data){ return data });
    }
       
})();