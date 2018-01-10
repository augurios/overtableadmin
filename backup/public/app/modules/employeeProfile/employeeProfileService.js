(function () {
    'use strict';

    angular
        .module('employeeprofile')
        .factory('employeeprofileService', serviceFn);

    serviceFn.$inject = ['$http','pouchDB','localStorageService','$rootScope'];
    /* @ngInject */
    function serviceFn($http,pouchDB,localStorageService,$rootScope) {
        var db =  pouchDB('lanapp', {adapter : 'idb'});
        var service = {};
        service.CurrentEmployee   = CurrentEmployee;
        service.updateUser        = CurrentEmployeeUpdate;
        return service;
        
        /////////
       function myMapFunction(doc) {
         if (doc._id == 'usersess') {
            if (doc.usermoment.employee) {
                emit(doc.usermoment.employee);
            } else {
                emit(doc.name);
            }
          }
        }

        function getMapByID(doc) {
         if (doc._id == 'employee') {
            if (doc.emplyoeedata) {
                emit(doc.emplyoeedata);
            } else {
                emit(doc.name);
            }
          }
        }

        function CurrentEmployee() {
           
            if(navigator.onLine){
                return $http.get('/api/v1/employeedetails').then(handleSuccessLocally, handleError('Error getting all users'));
            }
            else{
            
                return  db.query(myMapFunction).then(function (result) {
                      return result.rows[0].key
                }).catch(function (err) {
                     console.log(err)
                });
            }

        }

        function CurrentEmployeeUpdate(data) {
           
            if(navigator.onLine){
                return $http.post('/api/v1/currentemployeeUpdate',data).then(handleSuccess, handleError('Error getting all users'));
            }
            else{
              
              data.flag = 1;
              return db.query(getMapByID,{include_docs : true}).then(function (result) {
                        //console.log(result.rows[0].key)
                        var empIds = []
                        empIds = data._id
                        var indexed ; 
                        
                        var filteredArray = result.rows[0].key.filter(function(itm){
                          return empIds.indexOf(itm._id) > -1;
                        });

                        //console.log(filteredArray)
                       
                       
                       for(var i = 0, len = result.rows[0].key.length; i < len; i++) {
                           
                             if(result.rows[0].key[i]._id == data._id){
                                indexed =  i;

                                db.get('employee').then(function(doc) {
                                  var newdata = doc
                                  
                                   delete doc.emplyoeedata[indexed];
                                   doc.emplyoeedata[indexed] =  data

                                   var syncData = {
                                    edit :  data._id,
                                    data : data,
                                    syncstatus: 0
                                   }
                                   

                                    if(localStorageService.get('_meanLanAppSync')){
                                      // put employee data on 1st array node
                                        //localStorageService.set('_meanLanAppSync',{employeeprofile : syncData});//
                                       var arr = localStorageService.get('_meanLanAppSync');
                                      // arr.push(localStorageService.get('_meanLanAppSync'));
                                      if("1" in arr){
                                        delete arr[1];
                                        arr[1] = {employeeprofile : syncData}
                                      }
                                       else{
                                         arr[1] = {employeeprofile : syncData}
                                       }
                                       console.log("New struct")
                                       console.log(arr)
                                       localStorageService.set('_meanLanAppSync',arr)
                                    }
                                    

                                    return db.put({
                                      _id: 'employee',
                                      _rev: doc._rev,
                                      emplyoeedata: doc.emplyoeedata
                                    });

                                 });

                             }
                        }

                }).catch(function (err) {
                     console.log(err)
                });

         /*   db.get('employee').then(function(doc) {
              return db.put({
                _id: 'employee',
                _rev: doc._rev,
                
              });
            }).then(function(response) {
              // handle response
            }).catch(function (err) {
              console.log(err);
            });*/
            //session  update
               /*db.get('usersess').then(function(doc) {
                    console.log(doc)
                    var doc_rev =  doc._rev
                    var data = doc.usermoment
                    delete doc.usermoment.employee;
                    var updataion;
                    doc.usermoment.employee = data;
                    updataion = doc.usermoment.employee
                
                   db.put({
                        _id: 'usersess',
                        _rev: doc_rev,
                        usermoment: updataion
                      });

                }).then(function(response) {
                  // handle response
                   console.log(response)
                }).catch(function (err) {
                  console.log(err);
                });*/
            }

        }
       


        function handleSuccess(res) {
            return res.data;
        }
        function handleSuccessLocally(res) {
            return res.data.data[0];
        }

        function handleError(error) {
            return function () {
                return { success: false, message: error };
            };
        }
    }

})();