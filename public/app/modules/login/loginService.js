
(function () {
    'use strict';
    
    angular
        .module('login')
        .service('loginService', LoginService);

        LoginService.$inject = ['$http','$q','$rootScope'];
	/* @ngInject */
	function LoginService($http,$q,$rootScope) {
      return {
              login: function(user) {
           
              	var credetialsLogin = {}
                credetialsLogin.email = user.email;
                credetialsLogin.password = user.pwd;

	             var deferred = $q.defer();
	             $http.post('api/login', credetialsLogin)
	               .success(function(data) { 
	                 if(data != null){
	                        deferred.resolve({success: true, data: data});
	                    }
	                    else{
	                        deferred.resolve({success: false, data: null});
	                    }
	               }).error(function(msg, code) {
	                  deferred.reject(msg);
	               });
	             return deferred.promise;
            }
        }
     }//login
    
    
})();