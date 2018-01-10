(function () {
    'use strict';

 angular
        .module('serverMeanapp', 
        	['application.core',
        	'application.config',
        	'application.routes',
            'login','dashboard','usermodule','resetpassword','employeemanagement','restaurant','shifts','rooms'
        	]
        )
        .run(['$q', '$http', '$stateParams', '$state', '$rootScope', '$location', '$urlRouter', '$route', '$window','$compile','localStorageService','pathservice','REGEX',
                 function ($q, $http, $stateParams, $state, $rootScope, $location, $urlRouter, $route, $window,$compile,localStorageService,pathservice,REGEX) {
                     $rootScope.logedInUser = {};
                     $rootScope.logedInUser = JSON.parse(localStorage.getItem('logedInUser'));
                      

                     pathservice.consts(function (data) {
                         $rootScope.paths = data;
                     });
                    $rootScope.regex = REGEX;
                    $http.defaults.headers.common['x-access-token'] = $rootScope.token;
                    //$http.defaults.headers.common['logedInUserId'] = $rootScope.logedInUserId;
                     try {
                         $http.defaults.headers.common['logedInUserId'] = $rootScope.logedInUser.userid;
                     } catch (err) {

                     }

                    $rootScope.$state = $state;
                    $rootScope.$on("$stateChangeStart", function (event, toState, test) {
                        $rootScope.bodyClass = toState.data.bodyClass;
                        $rootScope.isHome = toState.data.isHome;
                        $rootScope.title = toState.data.pageTitle;
                        $rootScope.teal = toState.data.teal;
                        $rootScope.lbg = typeof (toState.data.lbg) === "undefined" ? toState.data.lbg : "nil" ;
                        $rootScope.nopanel = toState.data.nopanel ? false : true;
                    })
                    // Sort Functionality
                    $rootScope.sort = function(keyname){
                        $rootScope.sortKey = keyname;   //set the sortKey to the param passed
                        $rootScope.reverse = !$rootScope.reverse; //if true make it false and vice versa
                    }

                    $rootScope.lang = 'en';

                    $rootScope.$on('$translateChangeSuccess', function(event, data) {
                        var language = data.language;
                        $rootScope.lang = language;
                    });

                    
                    $rootScope.toaster = {'time-out': 3000,'limit':3, 'close-button':true, 'animation-class': 'toast-right-center'}
                    console.log('Done loading dependencies and configuring module!');

        }] )

        /*.run(function ($q, $http, $stateParams, $state, $rootScope, $location, $urlRouter, $route, $window,$compile,localStorageService,pathservice,REGEX) {
            
            
        });
*/
})();