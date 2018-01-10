angular
    .module('serverMeanapp')
    .factory('pathservice',['$http', function ($http) {

     var consts = {
        consts:   function (callback) {
                    $http.get('/auth/getpaths')
                    .success(function (data) {
                        callback(data);
                    })
                    .error(function (data) {
                        console.log('Error: ' + data)
                    });
                }
     }
    return consts;
}]);

(function() {
  'use strict';

  angular
    .module('serverMeanapp')
    .factory('SessionService', sessionService)
    .factory('httpRequestInterceptor',httpRequestInterceptor)
    sessionService.$inject = ['$http', '$location', '$window', 'toaster','$q','$state','$rootScope','translationService'];
    /* @ngInject */
    function sessionService($http, $location, $window, toaster,$q,$state,$rootScope,translationService) {
      var Session = {
          data: {
              role_id: ''
          },
          status: {
              status_id: 0
          },
          sessions: {
              sess : {}
          },
          getSession: function () {
            $http.get('/auth/get_session',{cache: false})
              .success(function (data) {
            
                  if(typeof data.userid == "undefined" ||  data.userid == null || data == 0){
                    var userIsAuthenticated = false;
                    $location.path('/login'); 
                  }
                  else{
                     var userIsAuthenticated = true;
                  }
                })
                .error(function (data) {
                    var userIsAuthenticated = false;
                    $location.path('/login'); 
                    console.log('Error: ' + data);
                });
          },   // get session
          loginResolver: function () {
                  var deferred = $q.defer();
                   $http.get('/auth/get_session',{cache: false})
                     .success(function(data) { 
                       if(data == 0){
                             $state.go('/login');
                             deferred.resolve({success: false, data: null});
                          }
                          else{
                              $rootScope.info = {
                                name : data.name ,
                                userid : data.userid ,
                                email : data.email,
                                role : data.role,
                                image : data.image ? data.image : null
                              }
                            
                             deferred.resolve({success: true, data: data});
                          }
                     }).error(function(msg, code) {
                        deferred.reject(msg);
                     });
                   return deferred.promise;
          },    
          rootPage: function () {
                  var deferred = $q.defer();
                   $http.get('/auth/get_session',{cache: false})
                     .success(function(data) { 
                      
                       if(data == 0 || data == null){
                             $state.go('/login');
                             deferred.resolve({success: false, data: null});
                          }
                          else{
                             //$state.reload();
                             deferred.resolve({success: true, data: data});
                          }
                     }).error(function(msg, code) {
                        deferred.reject(msg);
                     });
                   return deferred.promise;
          },  
          isLoggedIn: function () {
           var deferred = $q.defer();
               $http.get('/auth/get_session',{cache: false})
                 .success(function(data) { 
                
                   if(data == 0 || data == null){
                        $state.go('/login');
                        deferred.resolve(false);
                      }
                      else{
                        $location.path('/dashboard');
                       deferred.resolve(true);
                      }
                 }).error(function(msg, code) {
                    deferred.reject(msg);
                 });
               return deferred.promise;
          },
          logOut: function () {
             $http.post('/api/logout')
                    .success(function (data) {
                    if (data.user == null) {
                        $location.path('/login');
                        toaster.pop('success', $rootScope.title_success , translationService.demand("MESSAGES.LOGGEDOUT"))
                    }
                })
                    .error(function (data) {
                    console.log('Error: ' + data);
                });
            },// log out everyone
            userInfo: function (callback) {
              $http.get('/auth/get_session',{cache: false})
                .success(function (data) {
                      return callback(data);
                  })
                  .error(function (data) {
                      var userIsAuthenticated = false;
                      $location.path('/login'); 
                      console.log('Error: ' + data);
                  });
              }
          };

      return Session;

    } //fn session service

    httpRequestInterceptor.$inject = ['$rootScope','localStorageService'];
    /* @ngInject */
    function httpRequestInterceptor($rootScope,localStorageService) {
      return {
         request: function($config) {
             $config.headers['x-access-token'] = localStorageService.get('_apref');
          return $config;
        }
      }
    }//fn httpRequestInterceptor service
    
})()

  angular
    .module('serverMeanapp').factory('PermissionService',['$rootScope','$http','$uibModal', '$location','$state', '$window', 'toaster','translationService', function ($rootScope,$http,$uibModal, $location,$state, $window, toaster, translationService) {

    var permissionModule = {
        checkPermission: function (data) {
            //var params = { pos : $location.$$path}
            var urlRq = typeof data == "undefined" ? $location.$$path : data
            var params = { pos : urlRq } 
            var promise = $http.post('/api/v1/check_permission',params)
              .then(function (response) {
                
                if(response.data == 1){
                  return true
                }
                else{
                  toaster.pop("error",$rootScope.title_fail , translationService.demand("MESSAGES.PERMISSIONDENIED"))
                  $state.go('404')
                }
               
            });
        },
        checkPermissionMenu :  function (data) {
            //var params = { pos : $location.$$path}
           
            var urlRq = typeof data == "undefined" ? $location.$$path : data
            var params = { pos : urlRq } 
            var promise = $http.post('/api/v1/check_permission',params)
              .then(function (response) {
                
                if(response.data == 1){
                  return true
                }
                else{
                   return false
                }
               
            });
        }
    }
    return permissionModule;
}]);