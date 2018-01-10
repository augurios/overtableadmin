(function() {
    'use strict';

angular
    .module('serverMeanapp')
    .directive('updateTitle', title)
    .directive('focusline', focusline)
    .directive('loginAccountControl', loginAccountControl)
    .directive('datatables', datatables)
        
    title.$inject =['$rootScope', '$timeout', 'translationService'];
        
            
    var directive = {
        bindToController: true,
        controller: Controller,
        controllerAs: 'vm',
        restrict: 'AE',
        scope: {
        }
    };
    return directive;
    /* @ngInject */
    function title($rootScope, $timeout, translationService) {
        return {
            link: function (scope, element) {

                var listener = function (event, toState) {

                    var title = 'MeanApp';
                    if (toState.data && toState.data.pageTitle){ 
                        title = translationService.demand(toState.data.pageTitle) + " | " +title};

                    $timeout(function () {
                        element.text(title);
                    }, 0, false);
                };

                $rootScope.$on('$stateChangeSuccess', listener);
            }
        };
    }

    function focusline() {

        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: link,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function link(scope, element, attrs) {
             //Add blue animated border and remove with condition when focus and blur
                if($('.fg-line')[0]) {
                    $('body').on('focus', '.fg-line .form-control', function(){
                        $(this).closest('.fg-line').addClass('fg-toggled');
                    })

                    $('body').on('blur', '.form-control', function(){
                        var p = $(this).closest('.form-group, .input-group');
                        var i = p.find('.form-control').val();

                        if (p.hasClass('fg-float')) {
                            if (i.length == 0) {
                                $(this).closest('.fg-line').removeClass('fg-toggled');
                            }
                        }
                        else {
                            $(this).closest('.fg-line').removeClass('fg-toggled');
                        }
                    });
                }

                //Add blue border for pre-valued fg-flot text feilds
                if($('.fg-float')[0]) {
                    $('.fg-float .form-control').each(function(){
                        var i = $(this).val();

                        if (!i.length == 0) {
                            $(this).closest('.fg-line').addClass('fg-toggled');
                        }

                    });
                }
            }
        }

    function loginAccountControl() {

        var directive = {
            bindToController: true,
            controller: Controller,
            controllerAs: 'vm',
            link: linkAccount,
            restrict: 'A',
            scope: {
            }
        };
        return directive;

        function linkAccount(scope, element, attrs) {
            
                $(element).on('click',  function(e){
                    e.preventDefault();

                    var z = $(this).data('block');
                    var t = $(this).closest('.l-block');
                    var c = $(this).data('bg');

                    t.removeClass('toggled');

                    setTimeout(function(){
                        $('.login').attr('data-lbg', c);
                        $(z).addClass('toggled');
                    });

                })
            }
    }

    function datatables() {
        return {
            link: function (scope, element) {
                  $(element).bootgrid({
                    css: {
                        icon: 'zmdi icon',
                        iconColumns: 'zmdi-view-module',
                        iconDown: 'zmdi-expand-more',
                        iconRefresh: 'zmdi-refresh',
                        iconUp: 'zmdi-expand-less'
                    },
                    selection: false,
                    multiSelect: false,
                    rowSelect: false,
                    keepSelection: false
                });

            }
        };
    }

    function Controller(){}
    

})();

angular
    .module('serverMeanapp')
    .directive('usernameAvailable', existence)

existence.$inject = ['$timeout', '$q','$http'];
/* @ngInject */
function existence($timeout, $q,$http) {
  return {
    restrict: 'AE',
    require: 'ngModel',
    link: function(scope, elem, attrs, model) { 
      model.$asyncValidators.usernameExists = function() {

            var val = elem.val();
            var req = {};
       
                switch (attrs.field) {
                    case 'pin':
                       var req = { "pin": val, "subscription": attrs.uninat, restaurant : attrs.restaurant, url : '/auth/pin' };
                        break;
                    case 'email':
                        var req = { "email": val, "subscription": attrs.uninat ,url : '/auth/email'};
                        break;
                    case 'emaployeeemail':
                        var req = { "email": val, "subscription": attrs.uninat, restaurant : attrs.restaurant, url : '/auth/employee-email'  };
                       
                    default:

                }
             return $http.post(req.url,req).then(function(res){
                $timeout(function(){
                model.$setValidity('usernameExists', res.data.success); 
              });
            });
      };
    }
  } 
}