(function() {
    'use strict';

    angular
        .module('usermodule')
        .controller('userController', Controller);
  
    Controller.$inject = ['$scope','$state','$rootScope','$location','toaster','$http','SessionService','localStorageService','helper','$uibModal','userService','PATHS','PermissionService','SweetAlert','translationService'];
    /* @ngInject */
    function Controller($scope, $state, $rootScope,$location,toaster,$http,SessionService,localStorageService,helper,$uibModal,userService,PATHS,PermissionService,SweetAlert,translationService) {
     
        var vm = this;
        $scope.currentPage = 1;
    	  $scope.pageSize = 10;

        $rootScope.$on("partialLoadUserContrller", function(){
           activateUserController()
        })

        activateUserController()
        function activateUserController (){
          userService.getUsers().then(function(data){
          if(data.success){
            vm.users = data.data
            console.log(data.data);
            $scope.headers = []
            
             
             var i =0;
                angular.forEach(vm.users, function(value, key) {
                  if(key == 0) {
                    angular.forEach(value, function(val, item) {
                      if(item != "_id"){
                         item = item.replace('_', ' ');
                         //item = helper.titleCase(item)
                         var js = {}
                         
                         js.heading = item;
                         js.show = true;
                         $scope.headers[i] = js;
                         i++
                      }
                    
                    })
               }
                });
            $scope.totalsize = vm.users.length;
          }
          else{
            toaster.pop('error', $rootScope.fail , translationService.demand(data.message))
          }
            
          },
          function(err){
            console.log(err)
          })

        }//activateUserController
  		
        this.deleteAction = function(user){
          SweetAlert.swal({   
              title: translationService.demand("MESSAGES.SWALTITLE.DELETE.TITLE"),
              text: translationService.demand("MESSAGES.SWALTITLE.DELETE.TEXT"),
              type: "warning",   
              showCancelButton: true,   
              confirmButtonColor: "#DD6B55",   
              confirmButtonText: translationService.demand("MESSAGES.SWALTITLE.DELETE.CONFIRMTEXT"),
              closeOnConfirm: false
            }, function(isConfirm){  
              if (isConfirm) {     
                 if(user){
                  userService.DeleteUser({userinfo:user}).then(function(data){
                    $rootScope.$emit("partialLoadUserContrller", {});
                     SweetAlert.swal($rootScope.title_success , translationService.demand(data.message), "success");   
                  })
                }
               
              }
              });
         
        }
       
		this.modal = function (info) {
     
      if(typeof info == "undefined"){
         var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: PATHS.popup+'user.add.html',
              controller: 'CreateUser',
              controllerAs: 'vm',
          });
      }
      else{
            var modalInstance = $uibModal.open({
              animation: true,
              templateUrl: PATHS.popup+'user.edit.html',
              controller:function ($uibModalInstance ,$scope,toaster,user){
                $scope.userinfo = user;
                
                $scope.close = function(){
                  $uibModalInstance.close('ok');
                }
                //UpdateUser
                $scope.updateuser = function(){
                /*  if($scope.userform.$valid){*/
                    if($scope.userinfo._id){
                       userService.UpdateUser($scope.userinfo).then(function(data){
                          $rootScope.$emit("partialLoadUserContrller", {});
                          
                          if(data.success){
                            toaster.pop('success', $rootScope.title_success , translationService.demand(data.message))
                          }
                          else{
                             toaster.pop('error', $rootScope.title_fail , translationService.demand(data.message))
                          }
                          
                        },function(err){
                          console.log(err)
                        })
                       $uibModalInstance.close('ok');
                    }
                 /* }
                  else{
                      toaster.pop('error', $rootScope.title_fail ,  translationService.demand("MESSAGES.ALLFIELDSRQ"))
                  }*/
                 
                }

              },
              resolve: {
                user: function () {
                  return info;
                }
              }
              
          });
     }
     
      };
    }



    
})();

(function() {
    'use strict';

    angular
        .module('usermodule')
        .controller('CreateUser', AController);
          AController.$inject = ['$uibModalInstance','$scope','$state','$rootScope','SessionService','$stateParams','$location','$window','toaster','userService','translationService'];
          /* @ngInject */
          function AController($uibModalInstance, $scope, $state, $rootScope,SessionService, $stateParams, $location,$window,toaster,userService,translationService) {
            SessionService.getSession(); // get session details
            var vm = this;
            $scope.close = function(){
              $uibModalInstance.close('ok');
            }
            vm.createuser = function (){
                  if (vm.userform.$valid) {
                        userService.createUser(vm.user).then(function(data){
                          $rootScope.$emit("partialLoadUserContrller", {});
                          
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
          }
})();
