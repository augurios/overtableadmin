(function () {
    'use strict';

    angular
        .module('reports')
        .controller('reportsController', Controller);

    Controller.$inject = ['SessionService', 'localStorageService', 'dashboardService', 'toaster', 'session', '$translate', 'translationService', '$timeout', '$scope', 'reportsService', '$rootScope'];
    /* @ngInject */
    function Controller(SessionService, localStorageService, dashboardService, toaster, session, $translate, translationService, $timeout, $scope, reportsService, $rootScope) {
	    
        $scope.endDate = forUiDate(new Date())
        $scope.StartDate = forUiDate(new Date(new Date().getTime() - (7 * 24 * 60 * 60 * 1000)))

        function forUiDate(Date) {
            var obj = Date.getDate() + "/" + (Date.getMonth() + 1) + "/" + Date.getFullYear()
            return obj 
        }

        $scope.isReport = false;
	    
        function changeDateFormat(date) {
            var Date1 = date.split("/")
            Date1 = Date1[2] + "/" + Date1[1]+ "/"+ Date1[0];
            Date1 = new Date(Date1).toISOString();
            return Date1
        }

        function forlocalDate(date) {
            var Date1 = date.split("/")
            Date1 = Date1[2] + "/" + Date1[1] + "/" + Date1[0];
            Date1 = new Date(Date1)
            return Date1
        }

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

        $scope.makeReport = function (startdate, enddate) {

            if (startdate && enddate) {
                if(forlocalDate(startdate) > new Date() || forlocalDate(enddate) > new Date())
                    return toaster.pop('error', "Error", "Date Can't be greater than form Today date");
               else if (forlocalDate(startdate) > forlocalDate(enddate))
                   return toaster.pop('error', "Error", "End Date should not be less than Start Date");

                var StartDate = changeDateFormat(startdate);
                var EndDate = changeDateFormat(enddate)

                $scope.isReport = false;
                $scope.isReportLoading = true;
                var GraphData = [];
                reportsService.GetShiftByDate($rootScope.logedInUser.userid, StartDate, EndDate).then(function (response) {

                    $scope.isReport = true;
                    $scope.isReportLoading = false;

                    $scope.Shifts = response.ShiftData;
                    var Ingridiant = response.IngridentData;
                    var Sides = response.Sidedata
                    var AllProducts = [];

                    $scope.AllShiftGrandTotal = 0;
                    var prodArray = [];

                    $scope.allIngridiantTotal = 0;

                    for (var i = 0; i < $scope.Shifts.length; i++) {
                        $scope.Shifts[i].ShiftGrandTotal = 0;
                        for (var j = 0; j < $scope.Shifts[i].invoices.length; j++) {

                            var totalprice = priceCalculation($scope.Shifts[i].invoices[j])
                            $scope.Shifts[i].ShiftGrandTotal = $scope.Shifts[i].ShiftGrandTotal + totalprice.grandtotal;
                        }
                        $scope.AllShiftGrandTotal = $scope.AllShiftGrandTotal + $scope.Shifts[i].ShiftGrandTotal
                        //for graph Data
                        GraphData.push([i, $scope.Shifts[i].ShiftGrandTotal, $scope.Shifts[i].starttime])

                        for (var Ordercount = 0; Ordercount < $scope.Shifts[i].orders.length; Ordercount++) {
                            var p = $scope.Shifts[i].orders[Ordercount].product;
                            var index = -1;
                            for (var k = 0; k < prodArray.length; k++) {
                                if (prodArray[k].pid == p.clientId) {
                                    index = k;
                                    break;
                                }
                            }
                            if (index >= 0) {
                                prodArray[index].count = prodArray[index].count + 1;
                            }
                            else
                                prodArray.push({ count: 1, product: p, pid: p.clientId });

                            
                            $scope.allIngridiantTotal = $scope.allIngridiantTotal + getIngridentTotal($scope.Shifts[i].orders[Ordercount], Ingridiant, Sides)
                        }
                    }
                  

                    $scope.employeesPercent = (((($scope.AllShiftGrandTotal - ($scope.AllShiftGrandTotal * 13 / 100).toFixed(2))) * 10) / 100).toFixed(2)


                    $scope.topProduct = _.sortBy(prodArray, 'count');
                    $scope.topProduct.reverse()
                    //for get Use Ingrident Value

                   
                    setTimeout(function () {
                        //  $scope.isReport = true;
                        //  $scope.isReportLoading = false;
                        $scope.$apply();

                        /* Make some random data for the Chart*/

                        var d1 = [];
                        for (var i = 0; i <= 10; i += 1) {
                            d1.push([i, parseInt(Math.random() * 30)]);
                        }
                        var d2 = [];
                        for (var i = 0; i <= 25; i += 4) {
                            d2.push([i, parseInt(Math.random() * 30)]);
                        }
                        var d3 = [];
                        for (var i = 0; i <= 10; i += 1) {
                            d3.push([i, parseInt(Math.random() * 30)]);
                        }

                        console.log(d1, d2, d3)
                        console.log(GraphData);
                        /* Chart Options */

                        var options = {
                            series: {
                                shadowSize: 0,
                                curvedLines: { //This is a third party plugin to make curved lines
                                    apply: true,
                                    active: true,
                                    monotonicFit: false
                                },
                                lines: {
                                    show: false,
                                    points: { show: true },
                                    lineWidth: 0,
                                },
                            },
                            grid: {
                                borderWidth: 0,
                                labelMargin: 10,
                                hoverable: true,
                                clickable: true,
                                mouseActiveRadius: 6,

                            },
                            xaxis: {
                                tickDecimals: 0,
                                ticks: false
                            },

                            yaxis: {
                                tickDecimals: 0,
                                ticks: false
                            },

                            legend: {
                                show: false
                            }
                        };

                        /* Let's create the chart */

                        //if ($("#curved-line-chart")[0]) {
                        //    $.plot($("#curved-line-chart"), [
                        //        {data: d1, lines: { show: true, fill: 0.98 }, label: 'Product 1', stack: true, color: '#e3e3e3' },
                        //        {data: d3, lines: { show: true, fill: 0.98 }, label: 'Product 2', stack: true, color: '#f1dd2c' }
                        //    ], options);
                        //}

                        if ($("#number-stats-chart")[0]) {
                            $.plot($("#number-stats-chart"), [
                                {
                                    data: GraphData, lines: { show: true, fill: 0.4 }, points: {
                                        show: false
                                    }, label: 'Product 1', stack: true, color: '#fff'
                                }
                            ], options);
                        }

                        /* Tooltips for Flot Charts */

                        if ($(".flot-chart")[0]) {
                            $(".flot-chart").bind("plothover", function (event, pos, item) {
                                if (item) {
                                    var x = item.datapoint[0].toFixed(2),
                                        y = item.datapoint[1].toFixed(2);
                                    var graphData = getGraphDate(item);

                                    if (graphData && graphData.date)
                                        $(".flot-tooltip").html(graphData.date + " - " + graphData.total).css({ top: item.pageY + 5, left: item.pageX + 5 }).show();
                                }
                                else {
                                    $(".flot-tooltip").hide();
                                }
                            });

                            $("<div class='flot-tooltip' class='chart-tooltip'></div>").appendTo("body");

                        }


                    }, 1000)
                });
            } else {
                toaster.pop('error', "Error", "Please Select The Date");
            }
        }
	    

        function getIngridentTotal(order, Ingridiant, Sides) {
            var pricetoreturn =0;
            var product = order.product;
            var UseIng = [];
            if (product && product.Ingradients) {
                for (var ingcounter = 0; ingcounter < product.Ingradients.length; ingcounter++) {
                    var ing = _.find(Ingridiant, function (num) { return num.clientId == product.Ingradients[ingcounter].ingradientClientId });
                  
                    var proding = product.Ingradients[ingcounter];
                    var p = getPriceFromEdits(ing, order.date);
                    var q = parseFloat(proding.quantity)
                    var finalprice = p*q;
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
            var obj  = _.find(ingObj.Edits, function (num) { return new Date(moment.utc(num.created_at).format("MM/DD/YYYY HH:mm:ss A")) < new Date(moment.utc(date).format("MM/DD/YYYY HH:mm:ss A"))})
               // if(order.moment.utc(date).format("MM/DD/YYYY HH:mm:ss A")  > moment.utc(ingObj.Edits[i].created_at).format("MM/DD/YYYY HH:mm:ss A"))
             if (obj)
              return  obj.Cost
             else
                 return ingObj.Cost
        }

	    function getGraphDate(item) {
	        var data;
	      //  for (var i = 0; i < item.series.data.length; i++) {
	           // for (var j; j < item.datapoint.length; j++) {
	        data = _.find(item.series.data, function (num) { return num[0] == item.datapoint[0] })
	        console.log(data);
	        if (data) {
	            var date = new Date(data[2])
	            date = date.getDate() + "/" + date.getMonth() + 1 + "/" + date.getFullYear();
	            var graphObject = { date: date, total: data[1] }

	            return graphObject
	        }
	        else {
	            return ""
	        }
	    }


	    $scope.limit = 5;
	    $scope.isShow = true
	    $scope.viewAll = function () {
            $scope.isShow=false
	            $scope.limit = $scope.topProduct.length
	    }
	    $scope.Showless = function () {
	        $scope.isShow = true
	        $scope.limit = 5;
	    }
    }
})();