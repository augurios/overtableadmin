
(function () {
    'use strict';
    
    angular
        .module('login')
        .service('loginService', LoginService);

        LoginService.$inject = ['$http','$q','$rootScope','pouchDB'];
		/* @ngInject */
		function LoginService($http,$q,$rootScope,pouchDB) {
		 var db =  pouchDB('lanapp', {adapter : 'idb'});
	      return {
	              login: function(user) {
	        
	              	var credetialsLogin = {}
	                credetialsLogin.email = user.email;
	                credetialsLogin.password = user.pwd;
	                credetialsLogin.token = user.token;

		             var deferred = $q.defer();
		             $http.post('api/login', credetialsLogin)
		               .success(function(data) { 
		                 if(data != null){
		                 	
	                 			db.get('usersess').then(function (doc) {
								  db.remove(doc);
								  db.put({
	                                _id: 'usersess',
	                                usermoment: data.data
	                              });
								});

		                 		$http.get('/api/get/employee')
		                 		.success(function(employess) { 
		                 			
		                 			

		                 			// get employee details for current retuarant;
		                 			if(employess.data != 0){
			                 			 db.put({
			                                _id: 'employee',
			                                emplyoeedata: employess.data
			                              },function(){
			                              	deferred.resolve({success: true, data: data});
			                              });
			                 			} else{
			                 					deferred.resolve({success: true, data: data});
			                 			}
		                 			
		                 		})
		                        
		                    }
		                    else{
		                        deferred.resolve({success: false, data: null});
		                    }
		               }).error(function(msg, code) {
		                  deferred.reject(msg);
		               });
		             return deferred.promise;
	            },
	            getEmployess : function(){
	            	// get employee details for current retuarant;
	            	 			var deferred = $q.defer();
	            				$http.get('/api/get/employee')
			                 		.success(function(employess) { 
			                 			console.log(employess.data)
			                 			if(employess.data != 0){

			                 			}
			                 			// Save Employee details current retuarant;
			                 			 /*db.put({
			                                _id: 'employee',
			                                emplyoeedata: employess.data
			                              });*/
			                 			deferred.resolve({success: true, data: employess});
		                 		}).error(function(msg, code) {
				                  deferred.reject(msg);
				               });
		                 		return deferred.promise;
	            }
	        }
	     }//login
    
    
})();