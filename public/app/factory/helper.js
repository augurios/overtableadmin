(function() {
    'use strict';

    angular
        .module('serverMeanapp')
        .factory('helper', helpfunctions);

    helpfunctions.$inject = ['$window'];

    /* @ngInject */
    function helpfunctions($window) {
        var root = {};
       
        root.show = function(msg){
          alert(msg);
        };

        root.createHeader = function (arr,elementsarray) {
            return angular.forEach(elementsarray, function(key,value){
                var ret;
                 ret = $.grep(arr, function(e){ 
                   e.heading != key
                });
            })
        }

        return root;
    }
})();