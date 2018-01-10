angular
    .module('mainServerapp')
    .factory('pathservice',['$http','pouchDB','PATHS', function ($http,pouchDB,PATHS) {
     var db =  pouchDB('lanapp', {adapter : 'idb'});
     var consts = {
        consts:   function (callback) {
                    if(navigator.onLine){
                      $http.get('/auth/getpaths')
                      .success(function (data) {
                          db.put({
                             _id: 'constants',
                            paths : data                   
                          }).then(function (response) {
                            //console.log("response", response);
                            callback(data);
                          }).catch(function (err) {
//                            console.log("err put Paths", err);
                            callback(data);
                          });
                      })
                      .error(function (data) {
                          console.log('Error auth/paths: ' + data)
                          db.get('constants', function(err, doc) {
                            if (err) { return console.log(err); }
                              callback(doc.paths);
                          });
                      });
                    }
                    else{
                      console.log("Offline Path Fecthing")
                      db.get('constants', function(err, doc) {
                        if (err) { return console.log(err); }
                          callback(doc.paths);
                      });
                    }
                }
     }
    return consts;
}]);
(function() {
  'use strict';

  angular
    .module('mainServerapp')
    .factory('SessionService', sessionService)
    .factory('httpRequestInterceptor',httpRequestInterceptor)
    .factory('socket', socketService)
    sessionService.$inject = ['$http', '$location', '$window', 'toaster','$q','$state','pouchDB','$rootScope'];
    /* @ngInject */
    function sessionService($http, $location, $window, toaster,$q,$state,pouchDB,$rootScope) {
      var db =  pouchDB('lanapp', {adapter : 'idb'});

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
            if(navigator.onLine){
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
              }
             else{

                  console.log("Offline Session Fecthing getSession")
                  db.get('usersess', function(err, doc) {
                    if (err) {  console.log(err); $location.path('/login'); }

                       var data = doc.usermoment;
                       console.log(doc.usermoment)
                        if(typeof data.userid == "undefined" ||  data.userid == null || data == 0){
                          var userIsAuthenticated = false;
                          $location.path('/login'); 
                        }
                        else{
                           var userIsAuthenticated = true;
                        }
                  });
                }
          },   // get session
          loginResolver: function () {
             if(navigator.onLine){
                  var deferred = $q.defer();
                   $http.get('/auth/get_session',{cache: false})
                     .success(function(data) { 
                   
                      /*db.put({
                         _id: 'usersess',
                         usermoment : data                   
                      }).then(function (response) {
                        console.log("response session", response);
                      }).catch(function (err) {
//                        console.log("err put session", err);
                      });
                      */
                     
                     db.get('usersess', function(err, doc) {
                          if (err) { 
                              console.log("error on updating session on loginResolver")
                              console.log(err)
                              //since usersessoin is not found here we add the session data to pounchDB
                               db.put({
                                _id: 'usersess',
                                usermoment: data
                              });
                          }
                          else{
                            
                              /*db.put({
                                _id: 'usersess',
                                usermoment: data
                              });*/
                              //console.log("loginResolver Else")
                         /* $http.get('/api/get/employee')
                          .success(function(employess) { 
                         
                             db.put({
                                      _id: 'employee',
                                      emplyoeedata: employess.data
                                    });
                            deferred.resolve({success: true, data: data});
                          })*/
                              /* db.put({
                                _id: 'usersess',
                                _rev: doc._rev,
                                usermoment: data
                              });*/

                          }

                      })
                      if(data == 0 || data == null){
                             $state.go('/login');
                             deferred.resolve({success: false, data: null});
                          }
                          else{
                             deferred.resolve({success: true, data: data});
                          }
                     }).error(function(msg, code) {
                        deferred.reject(msg);
                     });
                   return deferred.promise;
                    }
                    else{
                      var deferred = $q.defer();
                      console.log("Offline Session Fecthing loginResolver")
                      /*db.get('usersess', function(err, doc) {
                        if (err) { return console.log(err); }
                          console.log(doc.usermoment);
                           deferred.resolve({success: true, data: doc.usermoment});
                      });*/
                     /* db.get('usersess').then(function (doc) {
                        console.log(doc.usermoment);
                        return doc.usermoment
                      }).catch(function (err) {
                        console.log(err);
                      });*/
                      //return $q.when(_db.get('usersess'));
                      /*db.get('usersess')
                        .then(function(res) {
                          
                            return res
                            
                          
                        });*/
                    }

          }, 
          rootPage: function () {
                  var deferred = $q.defer();
                   $http.get('/auth/get_session',{cache: false})
                     .success(function(data) { 
                      $http.get('/api/get/employee')
                          .success(function(employess) { 
                            console.log(employess)
                             db.put({
                                      _id: 'employee',
                                      emplyoeedata: employess.data
                                    });
                            deferred.resolve({success: true, data: data});
                          })
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
            if(navigator.onLine){
              var deferred = $q.defer();
               $http.get('/auth/get_session',{cache: false})
                 .success(function(data) { 
                
                   if(data == 0 || data == null){
                        $state.go('/login');
                        deferred.resolve(false);
                      }
                      else{
                        //$location.path('/dashboard');
                       deferred.resolve(true);
                      }
                 }).error(function(msg, code) {
                    deferred.reject(msg);
                 });
               return deferred.promise;
             }
             else{

              console.log("Offline Session Fecthing isLoggedIn")
                  db.get('usersess', function(err, doc) {
                    if (err) {  console.log(err); $state.go('/login'); return false}

                       var data = doc.usermoment;
                      console.log(doc.usermoment)
                         if(data == 0 || data == null){
                            $state.go('/login');
                            return false
                            //deferred.resolve(false);
                          }
                          else{
                            $location.path('/dashboard');
                            return true
                          // deferred.resolve(true);
                          }
                  });
             }
        }, isLoggedIn: function () {
            if(navigator.onLine){
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
             }
             else{

              console.log("Offline Session Fecthing isLoggedIn")
                  db.get('usersess', function(err, doc) {
                    if (err) {  console.log(err); $state.go('/login'); return false}

                       var data = doc.usermoment;
                      console.log(doc.usermoment)
                         if(data == 0 || data == null){
                            $state.go('/login');
                            return false
                            deferred.resolve(false);
                          }
                          else{
                           //$location.path('/dashboard');
                            return true
                            deferred.resolve(true);
                          }
                  });
             }
        },    
          logOut: function () {
            if(navigator.onLine){
                   $http.post('/api/logout')
                          .success(function (data) {
                          if (data.user == null) {
                            db.destroy().then(function (response) {
                                // success
                               window.location= '/' ;
                               toaster.pop('success', "Success", "You have successfully logged out")    
                              }).catch(function (err) {
                                console.log(err);
                              });
                           /*  db.get('employee').then(function(doc) {
                               db.remove(doc);
                               
                            }).then(function (result) {
                               
                            }).catch(function (err) {
                              console.log(err);
                               
                            });

                            db.get('usersess').then(function(doc) {
                                  db.remove(doc);
                                   $state.go('/login');
                                }).then(function (result) {
                                   $state.go('/login');
                                }).catch(function (err) {
                                  console.log(err);
                                   $state.go('/login');
                                });*/
                             
                             // $location.path('/login'); // fix for refresh
                             
                          }
                      })
                          .error(function (data) {
                          console.log('Error: ' + data);
                      });
                }
                else{

                   db.get('employee').then(function(doc) {
                         db.remove(doc);
                         
                      }).then(function (result) {
                         
                      }).catch(function (err) {
                        console.log(err);
                         
                      });
                  db.get('usersess').then(function(doc) {
                       db.remove(doc);
                      
                       window.location= '/' ;
                               toaster.pop('success', "Success", "You have successfully logged out")   
                    }).then(function (result) {
                      window.location= '/' ;
                               toaster.pop('success', "Success", "You have successfully logged out")   
                    }).catch(function (err) {
                      console.log(err);
                       window.location= '/' ;
                               toaster.pop('success', "Success", "You have successfully logged out")   
                    });

                }
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
             $config.headers['x-access-token'] = localStorageService.get('_meanLanApp');
          return $config;
        }
      }
    }//fn httpRequestInterceptor service

    socketService.$inject = ['$rootScope'];
    function socketService($rootScope) {
      var socket = io.connect();
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        },
      };
    }
    
})()

angular
.module('mainServerapp').factory('PermissionService',['$http','$uibModal', '$location','$state', '$window', 'toaster', function ($http,$uibModal, $location,$state, $window, toaster) {

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
              toaster.pop("error","Unauthenticated access","You are not permitted.")
              $state.go('404')
            }
           
        });
    }
}
return permissionModule;
}]);


(function () {
  'use strict';
  angular
    .module('mainServerapp')
    .factory('translationService', translationService);
  /* @ngInject */
  translationService.$inject = ['$window'];
  function translationService($window) {
    var langKey;
    var Service = {
      get: get,
      set: set,
      put: put
    };

    return Service;

    function get(name) {
      if (!langKey) {
        langKey = $window.localStorage.getItem(name);
      }

      return langKey;
    }

    function set(name, value) {
      var isoCode;

      if (!value || value === '') {
        value = 'en';
      }
      isoCode = value;
      langKey = value;
      // $window.moment.locale(isoCode);
      $window.localStorage.setItem(name, value);
    }

    function put(name, value) {
      var isoCode;

      if (!value || value === '') {
        value = 'en';
      }
      isoCode = value;
      langKey = value;
      // $window.moment.locale(isoCode);
      $window.localStorage.setItem(name, value);
    }
  }
})();

angular
    .module('mainServerapp')
    .factory('dataservice',['$http','pouchDB','breeze','$timeout', dataserviceFn])

    function dataserviceFn($http,pouchDB,breeze,$timeout) {

        // convert server PascalCase property names to camelCase
        breeze.NamingConvention.camelCase.setAsDefault();

        // create a new manager talking to sample service 
        var host="http://sampleservice.breezejs.com";
        var serviceName = host+"/api/todos";
        var manager = new breeze.EntityManager(serviceName);


        
        var service = {
          getAllTodos: getAllTodos,
          save: save,
          reset: reset
        };
        return service;
        
        /*** implementation ***/  

        function getAllTodos() {
          console.log("Getting Todos");
          return breeze.EntityQuery.from("Todos")
                .using(manager).execute()
                .then(success)
                .catch(function(error){ opFailed('Get Todos', error)} );
        
          function success(data) {
              console.log("Retrieved " + data.results.length);
              return data.results;
          }
        }
        
        function opFailed(operation, error){
          console.log(operation + " failed: \n"+error);
          throw error; // re-throw so next in promise chain sees it
        }
        
        function save(){
          var changeCount = manager.getChanges().length;
          var msg = (save) 
            ? "Saving "+ changeCount + " change(s) ..."
            : "No changes to save";
            
          console.log(msg);
          return manager
            .saveChanges()
            .then( function (data) { 
              console.log("Saved  " + changeCount);} 
            )
            .catch(function(error) { opFailed('Save', error)} );
        }
        
        function reset() {
          console.log("Resetting the data to initial state");
          manager.clear();
          
          return $http.post(serviceName + '/reset')
            .then( function (data) { console.log("Database reset");} )
            .catch(function(error) { opFailed('Database reset', error)} );

        }

    }



angular
    .module('mainServerapp')
    .factory('socket',['$rootScope', function ($rootScope) {
      var socket = io.connect();
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {  
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
}]);