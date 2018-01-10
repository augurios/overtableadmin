(function () {
    'use strict';

 angular
        .module('mainServerapp', 
            ['application.core',
            'application.config',
            'application.routes',
            'welcomeEmployee','login','dashboard','employeeprofile'
            ]
        )
        .run(['$q', '$http', '$stateParams', '$state', '$rootScope', '$location', '$urlRouter', '$route', '$window','$compile','localStorageService','pathservice','REGEX',
                 function ($q, $http, $stateParams, $state, $rootScope, $location, $urlRouter, $route, $window,$compile,localStorageService,pathservice,REGEX) {
                    pathservice.consts(function (data) {
                         $rootScope.paths = data;
                     });
                    $rootScope.regex = REGEX;
                    $http.defaults.headers.common['x-access-token'] = $rootScope.token;

                    $rootScope.$state = $state;
                    $rootScope.$on("$stateChangeStart", function (event, toState, test) {
                        $rootScope.bodyClass = toState.data.bodyClass;
                        $rootScope.isHome = toState.data.isHome;
                        $rootScope.title = toState.data.pageTitle;
                        $rootScope.teal = toState.data.teal;
                        $rootScope.lbg = typeof (toState.data.lbg) === "undefined" ? toState.data.lbg : "nil" ;
                        $rootScope.nopanel = toState.data.nopanel ? false : true;
                    })
                    $rootScope.lang = 'en';

                    $rootScope.$on('$translateChangeSuccess', function(event, data) {
                        var language = data.language;
                        $rootScope.lang = language;
                    });
                      
                    /*$rootScope.syncdetails = {}
                    localStorageService.set('_meanLanAppSync',$rootScope.syncdetails);*/
                    $rootScope.online = navigator.onLine;
                      $window.addEventListener("offline", function() {
                        $rootScope.$apply(function() {
                          $rootScope.online = false;
                        });
                      }, false);

                      $window.addEventListener("online", function() {
                        $rootScope.$apply(function() {
                          $rootScope.online = true;
                        });
                      }, false); 
                    $rootScope.toaster = {'time-out': 3000,'limit':3, 'close-button':true, 'animation-class': 'toast-right-center'}
                    console.log('Done loading dependencies and configuring module!');

        }] )
})();