(function() {
    'use strict';

    angular
        .module('shifts')
        .controller('shiftsController', Controller);

    Controller.$inject = ['SessionService','localStorageService','dashboardService','toaster','session','$translate','translationService','$timeout','$scope','shiftsService','$rootScope'];
    /* @ngInject */
    function Controller(SessionService, localStorageService, dashboardService, toaster, session, $translate, translationService, $timeout, $scope, shiftsService, $rootScope) {
        
        $scope.currentPage = 1;
        $scope.pageSize = 5;
       
        $scope.setPaging = function () {

            
            //$scope.totalsize = $scope.shift.length / $scope.pageSize;

        }

        $scope.getmessgae = function () {
           
            var start = (($scope.currentPage - 1) * $scope.pageSize)  +1;
            var end = $scope.currentPage * $scope.pageSize;
            return start + " to " + end + " of " + $scope.shift.length;

        }


        shiftsService.GetShifting($rootScope.logedInUser.userid).then(function (response) {
            response = _.filter(response, function (num) { return num.restaurant == $rootScope.logedInUser.userid; });
            
            for (var rcount = 0; rcount < response.length; rcount++) {
                var invoices = response[rcount].invoices;
                for (var vcount = 0; vcount < invoices.length; vcount++) {
                    if (invoices[vcount].invoiceStatus != "ARCHIVED") {
                        invoices.splice(vcount, 1);
                    }

                }
            }
            $scope.shift = $scope.Calculate(response);
          
        }, function (err) { console.log(err) });


        //$scope.shift = [{Name:'Demo', Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" },
        //{ Name: 'test',     Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" },
        //{ Name: 'Pankaj',   Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" },
        //{ Name: 'Akash',    Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" },
        //{ Name: 'Himanshu', Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" },
        //{ Name: 'Ramesh',   Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" },
        //{ Name: 'Vikas',    Date: "12/7/17", Times: "10:00am - 3:57pm", Bills: "15", Orders: "18" }
        //]

        $scope.Calculate = function (data) {
            for (var cprise = 0; cprise < data.length; cprise++) {
                var order = data[cprise].orders;
                data[cprise].total = 0;
                for (var ocount = 0; ocount < order.length; ocount++) {
                    data[cprise].total = data[cprise].total + order[ocount].product.Price;
                }
                data[cprise].grandtotal = data[cprise].total + data[cprise].total * 0.15;
            }
            console.log(data)
            return data;
        }


        $scope.headers = [{ heading: "Name", show: true }, { heading: "Start time", show: true },
            { heading: "End time", show: true },
            { heading: "Bills", show: true },
            { heading: "Orders", show: true }];

          $scope.openReport = function (showData) {
              
              $scope.currentShift = showData;
               
              // get total in cash
              
              $scope.currentShift.totalCash = 0;
              $scope.currentShift.totalCredit = 0;
              
              for (var i = 0; i < showData.invoices.length; i++) {
	           	
	           	if(showData.invoices[i].iscash) {
		           	$scope.currentShift.totalCash = $scope.currentShift.totalCash + showData.invoices[i].orders[0].product.Price;
	           	} else {
		           	$scope.currentShift.totalCredit = $scope.currentShift.totalCredit + showData.invoices[i].orders[0].product.Price;
	           	}
	           	
	            
              }
              
              // get total costs
              
              $scope.currentShift.totalCost = 0;
               for (var i = 0; i < showData.orders.length; i++) {
	               $scope.currentShift.totalCost = $scope.currentShift.totalCost + showData.orders[1].product.Costs;
               }
              
              // total Sales
              
              $scope.currentShift.totalSales =  0;
               for (var i = 0; i < showData.orders.length; i++) {
	               $scope.currentShift.totalSales = $scope.currentShift.totalSales + showData.orders[1].product.Price;
              }
              
              // get total people served
              
              $scope.currentShift.totalServed = 0;
              
              for (var i = 0; i < showData.invoices.length; i++) {
	            $scope.currentShift.totalServed = $scope.currentShift.totalServed + showData.invoices[i].people;
              }
              
              // get promedio por persona
              
              $scope.currentShift.avgPerPerson = $scope.currentShift.totalSales / $scope.currentShift.totalServed;
              
              // Calcula earnings
              
              $scope.currentShift.totalEarnings = $scope.currentShift.totalSales - $scope.currentShift.totalCost;
              
              
              console.log("Shift Data: ", showData);
	          $('#reportModal').modal('show');
          }
    }
})();