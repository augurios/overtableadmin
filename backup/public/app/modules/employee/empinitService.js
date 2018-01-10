
(function () {
    'use strict';

    angular
        .module('welcomeEmployee')
        .factory('empService', serviceFn);

    serviceFn.$inject = ['$http','$location','toaster','$q','$state','pouchDB','localStorageService'];
    /* @ngInject */
    function serviceFn($http,$location,toaster,$q,$state,pouchDB,localStorageService) {
        var db =  pouchDB('lanapp', {adapter : 'idb'});
        var service = {};
        service.terminateEmployeeSession       = endsession;
        service.authEmployee                   = authenticate;
        //service.authEmployeeLocal              = authenticateLocal;
        return service;
        
        /////////
       

       
        function endsession() {
           //return $http.post('/api/v1/authenticateemployee'}).then(handleSuccess, handleError('Error getting all users'));
            if(navigator.onLine){
               $http.post('/api/v1/terminateempsession')
                        .success(function (data) {
                          console.log(data)
                        if (!data.data.employee) {
                          var sessonwohe = localStorageService.get('_meanLanAppSync')
                           console.log(sessonwohe[0])
                           //delete sessonwohe[0];
                           sessonwohe.splice(0, 1);
                           //delete sessonwohe[0]["session"];
                           console.log(sessonwohe)
                           //arr.push(sessonwohe)
                           localStorageService.set('_meanLanAppSync',sessonwohe)
                          db.get('usersess', function(err, doc) {
                              if (err) { 
                                  console.log("err end session")
                                  console.log(err)
                              }
                              else{
                                 delete doc.usermoment.employee;
                                 var termination = doc.usermoment;
                                 //console.log("datas", doc)
                                 /* var id= doc._rev;
                                  var datas = doc
                                  doc.usermoment.employee = {}
                                  datas.usermoment = doc.usermoment
                                  console.log("datas", datas)*/
                                  db.put({
                                          _id: 'usersess',
                                          _rev: doc._rev,
                                          usermoment: termination
                                        });
                                
                              }

                          })
                            $location.path('/dashboard');
                            toaster.pop('success', "Success", "You have terminated session")
                        }
                        else{
                            alert("Failed")
                        }
                    })
                        .error(function (data) {
                        console.log('Error: ' + data);
                    });
            }
            else{
                db.get('usersess', function(err, doc) {
                    if (err) { 
                        console.log("err end session")
                        console.log(err)
                    }
                    else{
                       
                       var sessonwohe = localStorageService.get('_meanLanAppSync')
                       console.log(sessonwohe[0])
                       //delete sessonwohe[0];
                       sessonwohe.splice(0, 1);
                       //delete sessonwohe[0]["session"];
                       console.log(sessonwohe)
                       //arr.push(sessonwohe)
                       // add flag that the user has logged out
                       
                       localStorageService.set('_meanLanAppSync',sessonwohe)

                       

                       delete doc.usermoment.employee;
                       var termination = doc.usermoment;
                       //console.log("datas", doc)
                       /* var id= doc._rev;
                        var datas = doc
                        doc.usermoment.employee = {}
                        datas.usermoment = doc.usermoment
                        console.log("datas", datas)*/
                        db.put({
                                _id: 'usersess',
                                _rev: doc._rev,
                                usermoment: termination
                              });
                       $location.path('/dashboard');
                            toaster.pop('success', "Success", "You have terminated session")
                       
                    }

                })
               /**/
            }
        }
        function authenticate(){
            if(navigator.onLine){
                //alert("online entered on offline")
                var deferred = $q.defer();
                   $http.get('/api/v1/authenticateemployee',{cache: false})
                     .success(function(data) { 
                      console.log(data)
                       if(data.data == 0 || data.data == null){
                             $location.path('/dashboard');
                             deferred.resolve({success: false, data: null});
                          }
                          else{
                             deferred.resolve({success: true, data: data});
                          }
                     }).error(function(msg, code) {
                       $location.path('/dashboard');
                        deferred.reject(msg);
                     });
                   return deferred.promise;
            }
            else{
                
                db.get('usersess', function(err, doc) {
                    if (err) { 
                        console.log("err authenticate empoyee")
                        console.log(err)
                    }
                    else{
                        console.log("check authenticate empoyee")
                        console.log(doc.usermoment.employee)
                                    
                         if(!doc.usermoment.employee){
                           $location.path('/dashboard');
                         }
                         else{
                          return true
                         // $location.path('/employee');
                        }
                    }

                })
               /**/
            }
        }
       


        function handleSuccess(res) {
            return res.data;
        }

        function handleSuccessLocal(res) {
            var return_data = res.data;
            db.get('usersess', function(err, doc) {
                    if (err) { 
                        console.log("err end session")
                        console.log(err)
                    }
                    else{
                         console.log("Done handleSuccessLocal")
                        console.log(doc)
                        var id= doc._rev;
                        var datas = doc
                        datas.employee = return_data
                        db.get('usersess').then(function(doc) {
                               db.put({
                                _id: 'usersess',
                                _rev: doc._rev,
                                usermoment: datas
                              });
                               return res.data;
                            }).then(function(response) {
                            }).catch(function (err) {
                              console.log(err, "err on employee login");
                            });
                    }

                })
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }

    }

})();