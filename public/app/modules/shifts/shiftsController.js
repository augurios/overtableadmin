(function () {
    'use strict';

    angular
        .module('shifts')
        .controller('shiftsController', Controller);

    Controller.$inject = ['SessionService', 'localStorageService', 'dashboardService', 'toaster', 'session', '$translate', 'translationService', '$timeout', '$scope', 'shiftsService', '$rootScope'];
    /* @ngInject */
    function Controller(SessionService, localStorageService, dashboardService, toaster, session, $translate, translationService, $timeout, $scope, shiftsService, $rootScope) {

        $scope.currentPage = 1;
        $scope.pageSize = 10;

        $scope.setPaging = function () {


            //$scope.totalsize = $scope.shift.length / $scope.pageSize;

        }

        $scope.getmessgae = function () {

            var start = (($scope.currentPage - 1) * $scope.pageSize) + 1;
            var end = $scope.currentPage * $scope.pageSize;
            return start + " to " + end + " of " + $scope.shift.length;

        }

        $scope.shiftLoaded = false;

        shiftsService.GetShifting($rootScope.logedInUser.userid).then(function (response) {

         
            response = _.filter(response, function (num) { return num.restaurant == $rootScope.logedInUser.userid; });
            shiftsService.GetExpence($rootScope.logedInUser.userid).then(function (Exp) {
                $scope.AllExpence = Exp || []
                //for (var rcount = 0; rcount < response.length; rcount++) {
                //    var invoices = response[rcount].invoices;
                //    for (var vcount = 0; vcount < invoices.length; vcount++) {
                //        if (invoices[vcount].invoiceStatus != "ARCHIVED") {
                //            invoices.splice(vcount, 1);
                //        }

                //    }
                //}

                $scope.shift = $scope.Calculate(response);


                $scope.shiftLoaded = true;
                console.log('shift loaded', $scope.shiftLoaded);
                $('.preloader.pl-xxl').addClass('hidden');

            });
        }, function (err) { console.log(err) });


        $scope.Calculate = function (data) {
            console.log("cal data", data);
            for (var cprise = 0; cprise < data.length; cprise++) {
                //var cprise = 193;
                var order = data[cprise].orders;
                var PandingInvoice = _.filter(data[cprise].invoices, function (inv) {
                    //if ((inv.shiftId || "") == (inv.createdShiftId) || "")
                    //    return false;
                    //else {
                    //    if ((inv.shiftId || "") != (data[cprise].clientId || ""))
                    //        return true;
                    //    else
                    //        return false;
                    //}
                    return inv.shiftId != data[cprise].clientId
                });

                data[cprise].total = 0;

                for (var ocount = 0; ocount < order.length; ocount++) {
                    var isPandingInvoiceOrder = false;
                    for (var inv = 0; inv < PandingInvoice.length; inv++) {
                        if (PandingInvoice[inv].orders && PandingInvoice[inv].orders.length > 0) {
                            var exist = _.find(PandingInvoice[inv].orders, function (ord) { return ord.clientId == order[ocount].clientId })
                            if (exist) {
                                isPandingInvoiceOrder = true
                                break;
                            }
                            else
                                isPandingInvoiceOrder = false
                        }
                    }

                    if (order[ocount].product && !isPandingInvoiceOrder) {
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

            if (invoice.shiftId != $scope.currentShift.clientId)
                orders = [];

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

                var tax = (employeeScore[ii].total * 13 / 100)

                var percentage = ((employeeScore[ii].total - tax) * 10 / 100);



                percentagePerEmployee.push({ "Employee": employeeScore[ii].employee, "Percentage": percentage })
            }

            console.log("Percentage by employee", percentagePerEmployee);

            return percentagePerEmployee;

            //return employeeScore;
        }


        $scope.openReport = function (showData) {

            shiftsService.GetInventry($rootScope.logedInUser.userid).then(function (response) {

                var ingrideant = response.IngridentData
                var sides = response.Sidedata

                var expences = [];
                expences = _.filter($scope.AllExpence, function (exp) { return exp.shift == showData.clientId })

                $scope.currentShift = showData;
                $scope.currentShift.Expences = 0;
                if (expences.length > 0) {
                    for (var i = 0; i < expences.length; i++) {
                        $scope.currentShift.Expences = $scope.currentShift.Expences + expences[i].editamount
                    }
                }


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
                $scope.IngradientsTotals = 0;
                if ($scope.currentShift.orders)
                    for (var ord = 0; ord < $scope.currentShift.orders.length; ord++)
                {
                        $scope.IngradientsTotals = $scope.IngradientsTotals + getIngridentTotal($scope.currentShift.orders[ord], ingrideant, sides);
                }


                $scope.currentShift.totalCost = 0;
                if (showData.orders && showData.orders.length > 0) {
                    console.log("that function that we talked about", showData);
                    for (var i = 0; i < showData.orders.length; i++) {
                        try {
                            if (showData.orders[i].product.Costs)
                                $scope.currentShift.totalCost = $scope.currentShift.totalCost + showData.orders[i].product.Costs;
                            else if (showData.orders[i].product.Price)
                                $scope.currentShift.totalCost = $scope.currentShift.totalCost + showData.orders[i].product.Price;
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
                    $scope.currentShift.avgPerPerson = $scope.currentShift.avgPerPerson.toLocaleString('en');
                    // Calcula earnings
                }
                catch (err) {

                }
                try {
                    $scope.currentShift.totalEarnings = $scope.currentShift.totalSales - $scope.currentShift.totalCost;
                    $scope.currentShift.totalEarnings = $scope.currentShift.totalEarnings.toLocaleString('en');
                    // Calcula earnings
                } catch (err) {

                }

                try {
                    $scope.currentShift.employeeScore = $scope.getpercentage(showData.invoices);
                } catch (err) { };

                console.log("Shift Data: ", showData);


                //   console.log(($scope.currentShift.totalSales - ($scope.currentShift.totalSales * 10 / 100) - (($scope.currentShift.totalSales - ($scope.currentShift.totalSales * 10 / 100)) - ($scope.currentShift.totalSales * 13 / 100) - ($scope.currentShift.totalCost) - $scope.currentShift.Expences)))
                $('#reportModal').modal('show');
            });
        }




        function getIngridentTotal(order, Ingridiant, Sides) {
            var pricetoreturn = 0;
            var product = order.product;
            var UseIng = [];
            if (product && product.Ingradients) {
                for (var ingcounter = 0; ingcounter < product.Ingradients.length; ingcounter++) {
                    var ing = _.find(Ingridiant, function (num) { return num.clientId == product.Ingradients[ingcounter].ingradientClientId });

                    var proding = product.Ingradients[ingcounter];
                    var p = getPriceFromEdits(ing, order.date);
                    var q = parseFloat(proding.quantity)
                    var finalprice = p * q;
                    pricetoreturn = pricetoreturn + finalprice;
                }
            }
            if (product && product.Sides) {

                for (var sidecounter = 0; sidecounter < product.Sides.length; sidecounter++) {
                    var SidesObj = _.find(Sides, function (num) { return num._id == product.Sides[sidecounter] });
                    for (var ingcounter = 0; ingcounter < SidesObj.Ingradients.length; ingcounter++) {
                        var ing = _.find(Ingridiant, function (num) { return num.clientId == SidesObj.Ingradients[ingcounter].ingradientClientId });

                        var proding = SidesObj.Ingradients[ingcounter];
                        var p = getPriceFromEdits(ing, order.date);
                        var q = parseFloat(proding.quantity);
                        var finalprice = p * q;
                        pricetoreturn = pricetoreturn + finalprice;
                    }
                }
            }
            return pricetoreturn;
        }


        function getPriceFromEdits(ingObj, date) {
            //for (var i = 0; i < ingObj.Edits.length; i++) {
            if (ingObj) {
                var obj = _.find(ingObj.Edits, function (num) { return new Date(moment.utc(num.created_at).format("MM/DD/YYYY HH:mm:ss A")) < new Date(moment.utc(date).format("MM/DD/YYYY HH:mm:ss A")) })
                // if(order.moment.utc(date).format("MM/DD/YYYY HH:mm:ss A")  > moment.utc(ingObj.Edits[i].created_at).format("MM/DD/YYYY HH:mm:ss A"))
                if (obj)
                    return obj.Cost
                else
                    return ingObj.Cost
            }
        }
    }
})();