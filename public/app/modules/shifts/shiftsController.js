(function() {
    'use strict';

    angular
        .module('shifts')
        .controller('shiftsController', Controller);

    Controller.$inject = ['SessionService','localStorageService','dashboardService','toaster','session','$translate','translationService','$timeout','$scope','shiftsService','$rootScope'];
    /* @ngInject */
    function Controller(SessionService, localStorageService, dashboardService, toaster, session, $translate, translationService, $timeout, $scope, shiftsService, $rootScope) {
        
        $scope.currentPage = 1;
        $scope.pageSize = 10;
       
        $scope.setPaging = function () {

            
            //$scope.totalsize = $scope.shift.length / $scope.pageSize;

        }

        $scope.getmessgae = function () {
           
            var start = (($scope.currentPage - 1) * $scope.pageSize)  +1;
            var end = $scope.currentPage * $scope.pageSize;
            return start + " to " + end + " of " + $scope.shift.length;

        }

		$scope.shiftLoaded = false;
		
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
            $scope.shiftLoaded = true;
            console.log('shift loaded',$scope.shiftLoaded);
            $('.preloader.pl-xxl').addClass('hidden');
            
          
        }, function (err) { console.log(err) });


        

        $scope.Calculate = function (data) {
	        console.log("cal data",data);
           for (var cprise = 0; cprise < data.length; cprise++) {
                var order = data[cprise].orders;
                data[cprise].total = 0;
                for (var ocount = 0; ocount < order.length; ocount++) {
	                if (order[ocount].product){
		                data[cprise].total = data[cprise].total + order[ocount].product.Price;
	                }
                    
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



        function priceCalculation(invoice) {
            var orders = invoice.orders;
            var tax = 0;
            var prices = { total: 0, grandtotal: 0 };

            if (invoice.override && invoice.override.isPriceOverride) {
                return prices;

            }

            if (orders && orders.length) {
                for (var i = 0; i < orders.length; i++) {
                    if (orders[i].product) {
                        prices.total = prices.total + (orders[i].product.Price * orders[i].quantity)
                    } else {
                        prices.total = 0;
                    }

                }
                prices.grandtotal = prices.total + (prices.total * tax) / 100
            }

            if (invoice.discount && invoice.discount.type) {
                if (invoice.discount.type === 'percentage') {
                    var getpercent = (invoice.discount.Amount / 100 * prices.grandtotal);
                    prices.grandtotal = prices.grandtotal - getpercent;
                } else {
                    // var getpercent = (invoice.discount.Amount / 100 * prices.grandtotal);
                    prices.grandtotal = prices.grandtotal - invoice.discount.Amount;
                }
            }
            //console.log(prices);
            return prices;
        }


        $scope.getpercentage = function (allInvoice) {
            // getting 10% for each employee

            var salesPerEmployee = [];
            for (var i = 0; i < allInvoice.length; i++) {
                console.log("logging totals", allInvoice[i].prices.grandtotal, i);
                var employee = allInvoice[i].servedby.firstname + " " + allInvoice[i].servedby.lastname;
                salesPerEmployee.push({ 'employee': employee, "total": allInvoice[i].prices.grandtotal });
            }
            console.log("Presorted", salesPerEmployee);



            function compare(a, b) {
                // Use toUpperCase() to ignore character casing
                const genreA = a.employee.toUpperCase();
                const genreB = b.employee.toUpperCase();

                let comparison = 0;
                if (genreA > genreB) {
                    comparison = 1;
                } else if (genreA < genreB) {
                    comparison = -1;
                }
                return comparison;
            }

            salesPerEmployee.sort(compare);


            console.log("sorted by employee", salesPerEmployee);

            var employeeScore = [];

            for (var ii = 0; ii < salesPerEmployee.length; ii++) {
                if (employeeScore.length == 0) {
                    employeeScore.push(salesPerEmployee[ii]);
                    console.log("primer metida", employeeScore);
                } else if (salesPerEmployee[ii].employee == employeeScore[employeeScore.length - 1].employee) {
                    console.log("verifica: ", ii, salesPerEmployee[ii].employee, employeeScore[employeeScore.length - 1].employee);
                    employeeScore[employeeScore.length - 1].total = employeeScore[employeeScore.length - 1].total + salesPerEmployee[ii].total
                } else {
                    employeeScore.push(salesPerEmployee[ii]);
                    console.log("otra metida", employeeScore);
                }
            }

            console.log("Sales by employee", employeeScore);

            var percentagePerEmployee = [];

            for (var ii = 0; ii < employeeScore.length; ii++) {


                var percentageTax = employeeScore[ii].total - (13 / 100 * employeeScore[ii].total);
                var percentage = (10 / 100 * percentageTax);

                console.log('total', employeeScore[ii].total, 'percentageTax', percentageTax, percentage, );

                percentagePerEmployee.push({ "Employee": employeeScore[ii].employee, "Percentage": percentage })
            }

            console.log("Percentage by employee", percentagePerEmployee);

            return percentagePerEmployee;

            //return employeeScore;
        }


          $scope.openReport = function (showData) {
              
              $scope.currentShift = showData;
               
               console.log('shift stuff',$scope.currentShift.invoices);
              // get total in cash
              
              $scope.currentShift.totalCash = 0;
              $scope.currentShift.totalCredit = 0;
              
              for (var i = 0; i < showData.invoices.length; i++) {
                  var prices = priceCalculation(showData.invoices[i]);
                  showData.invoices[i].prices = prices;
                  if (showData.invoices[i].iscash) {
                      $scope.currentShift.totalCash = $scope.currentShift.totalCash + prices.grandtotal;
                  } else {
                      $scope.currentShift.totalCredit = $scope.currentShift.totalCredit + prices.grandtotal;
                  }
              }
              // get total costs
              
              $scope.currentShift.totalCost = 0;
              if (showData.orders && showData.orders.length > 0) {
                  for (var i = 0; i < showData.orders.length; i++) {
                      try {
                          if (showData.orders[i].product.Costs)
                              $scope.currentShift.totalCost = $scope.currentShift.totalCost + showData.orders[i].product.Costs;
                      } catch (err) {

                      }
                  }
              }
              // total Sales
              
              $scope.currentShift.totalSales = $scope.currentShift.totalCash + $scope.currentShift.totalCredit;
              //if (showData.orders && showData.orders.length > 0) {
              //    for (var i = 0; i < showData.orders.length; i++) {
              //        try {
              //            if (showData.orders[i].product.Price)
              //                $scope.currentShift.totalSales = $scope.currentShift.totalSales + showData.orders[i].product.Price;
              //        } catch (err) {
              //        }
              //    }
              //}
              // get total people served
              
              $scope.currentShift.totalServed = 0;

              if (showData.invoices && showData.invoices.length > 0) {
                  for (var i = 0; i < showData.invoices.length; i++) {
                      try {
                          $scope.currentShift.totalServed = $scope.currentShift.totalServed + showData.invoices[i].people;
                      } catch (err) {

                      }
                  }
              }
              
              // get promedio por persona
              try {
                  $scope.currentShift.avgPerPerson = $scope.currentShift.totalSales / $scope.currentShift.totalServed;
                  $scope.currentShift.avgPerPerson = $scope.currentShift.avgPerPerson.toFixed(2);
                  // Calcula earnings
              }
              catch (err) {

              }
              try {
                  $scope.currentShift.totalEarnings = $scope.currentShift.totalSales - $scope.currentShift.totalCost;
                  $scope.currentShift.totalEarnings = $scope.currentShift.totalEarnings.toFixed(2);
                  // Calcula earnings
              } catch (err) {

              }

              try {
                  $scope.currentShift.employeeScore = $scope.getpercentage(showData.invoices);
              } catch (err) { };

              console.log("Shift Data: ", showData);
              $('#reportModal').modal('show');

          }
    }
})();