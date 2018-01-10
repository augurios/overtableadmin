(function() {
    'use strict';

    angular
        .module('rooms')
        .controller('roomsController', Controller)
        .controller('CreateRoom', CreateRoomController);
    Controller.$inject = ['SessionService', 'localStorageService', 'dashboardService', 'toaster', 'session', '$translate', 'translationService', '$timeout', '$scope', 'shiftsService', '$uibModal', 'PATHS','$rootScope','SweetAlert'];
    /* @ngInject */
    function Controller(SessionService, localStorageService, dashboardService, toaster, session, $translate, translationService, $timeout, $scope, shiftsService, $uibModal, PATHS, $rootScope, SweetAlert) {
        
        $( "#draggable p" ).draggable({ containment: "parent", scroll: false, refreshPositions: true });
        $scope.headers = [{ heading: "Room", show: true }, { heading: "Tables", show: true },
         { heading: "Status", show: true }];

        $scope.getNewTableNumber = function (type) {
            if ($scope.tableNum) {
                var toReturn = 1;
                for (var cnt = 0; cnt < $scope.tableNum.length; cnt++) {
                    if ($scope.tableNum[cnt].type == type)
                        toReturn++
                }
                return toReturn;
            }
            else
                return 1;
        }

        $scope.addTableToUI = function (tableObj) {
            var size = tableObj.size;
            var index = tableObj.number;
            var style = tableObj.style;
            var rotationFilter = tableObj.rotation.split("(");
            var rotationSplit = rotationFilter[1].split(")");
            var rotation = parseFloat(rotationSplit[0]);
            var pid ;
            if(tableObj.type === 'table') {
                pid =  "para" + index;
            } else {
                pid =  "parab" + index;
            }
            var iconid = "icon" + index;
            var spanid = "span" + index;
            var number = index;
            if (tableObj.type == "bar") {
                $("#draggable").append("<p clickedtype='bar' id=\"" + pid + "\" style=\"" + style + "\" class='bar'><strong><img src='/public/assets/img/svg/bar-e.svg' alt='table'></strong><span>Bar " + number + "</span><i class='zmdi zmdi-delete' id=\"" + iconid + "\"></i></p>");
                $("#draggable p").draggable({ containment: "parent", scroll: false, refreshPositions: true });
                var paramsRota = {
		            radians:  rotation,
		            snap: true
		        };
                $('#'+pid+' strong').rotatable(paramsRota);
            } else if (size > 2) {
                $("#draggable").append("<p clickedtype='table' id=\"" + pid + "\" style=\"" + style + "\"><strong><img src='/public/assets/img/svg/table-" + size + "-e.svg' alt='table'></strong><span id=\"" + spanid + "\">" + number + "</span><i class='zmdi zmdi-delete' id=\"" + iconid + "\"></i></p>");
                $("#draggable p").draggable({ containment: "parent", scroll: false, refreshPositions: true });
                var paramsRota = {
		            radians:  rotation,
		            snap: true
		        };
                $('#'+pid+' strong').rotatable(paramsRota);
            } else {
                $("#draggable").append("<p clickedtype='table' id=\"" + pid + "\" style=\"" + style + "\"><strong><img src='/public/assets/img/svg/table-" + size + "-e.svg' alt='table'></strong><span id=\"" + spanid + "\">" + number + "</span><i class='zmdi zmdi-delete' id=\"" + iconid + "\"></i></p>");
                $("#draggable p").draggable({ containment: "parent", scroll: false, refreshPositions: true });
                var paramsRota = {
		            radians:  rotation,
		            snap: true
		        };
                $('#'+pid+' strong').rotatable(paramsRota);
            }

            $("#" + iconid).on('click', function (eve) {
                $scope.elementId = "para" + this.id.replace("icon", "");
                $('#deleteModal').modal('show');
            });
        }

        $scope.addNewBar = function () {
            var tableObj = {
                name: '',
                created_by: JSON.parse(localStorage.getItem('logedInUser')).name,
                updated_by: JSON.parse(localStorage.getItem('logedInUser')).name,
                size: -1,
                restaurant: JSON.parse(localStorage.getItem('logedInUser')).userid,
                roomid: $scope.editabelRoom._id,
                userId: JSON.parse(localStorage.getItem('logedInUser')).userid,
                number: $scope.getNewTableNumber('bar'),
                type: 'bar',
                rotation: 'transform: rotate(0rad);'
            };
            $scope.tableNum.push(tableObj);
            $scope.addTableToUI(tableObj);
        }

        $scope.addNewTable = function (size) {

            var tableObj = {
                name: '',
                created_by: JSON.parse(localStorage.getItem('logedInUser')).name,
                updated_by: JSON.parse(localStorage.getItem('logedInUser')).name,
                size: size,
                restaurant: JSON.parse(localStorage.getItem('logedInUser')).userid,
                roomid: $scope.editabelRoom._id,
                userId: JSON.parse(localStorage.getItem('logedInUser')).userid,
                number: $scope.getNewTableNumber('table'),
                type:'table',
                rotation: 'transform: rotate(0rad);'
                
            };
            $scope.tableNum.push(tableObj);
            $scope.addTableToUI(tableObj);
        }

        $scope.removeTable = function () {
            $("#draggable").remove();
        }
        
        $scope.tableStructure = function (size, index) {
            alert("herer");
            var pid = "para" + index;
            var iconid = "icon" + index;

            if (size == "bar") {
                $("#draggable").append("<p class='bar' id=\"" + pid + "\"><strong><img src='/public/assets/img/svg/bar-e.svg' alt='table'><span>Bar 1</span><i class='zmdi zmdi-delete' id=\"" + iconid + "\"></i></strong></p>");
                $("#draggable p").draggable({ containment: "parent", scroll: false, refreshPositions: true });
                $('#draggable p strong').rotatable();
            } else if (size > 2) {
                $("#draggable").append("<p class='lg' id=\"" + pid + "\"><strong><img src='/public/assets/img/svg/table-" + size + "-e.svg' alt='table'><span>" + size + "</span><i class='zmdi zmdi-delete' id=\"" + iconid + "\"></i></strong></p>");
                $("#draggable p").draggable({ containment: "parent", scroll: false, refreshPositions: true });
                $('#draggable p strong').rotatable();
            } else {
                $("#draggable").append("<p><strong id=\"" + pid + "\"><img src='/public/assets/img/svg/table-" + size + "-e.svg' alt='table'><span>" + size + "</span><i class='zmdi zmdi-delete' id=\"" + iconid + "\"></i></strong></p>");
                $("#draggable p").draggable({ containment: "parent", scroll: false, refreshPositions: true });
                $('#draggable p strong').rotatable();

            }

            $("#" + iconid).on('click', function (eve) {
               
                $scope.elementId="para" + this.id.replace("icon", "");
                $('#deleteModal').modal('show');
            });
        }
        
        var vm = this;
        
        $('#draggable p strong').rotatable();
        
        this.modal = function (info) {
            if (typeof info == "undefined") {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: PATHS.popup + 'room.add.html',
                    controller: 'CreateRoom',
                    controllerAs: 'vm',
                    resolve: { getResturants: listOfrestaurants }
                });
            }
            else {
                var modalInstance = $uibModal.open({
                    animation: true,
                    templateUrl: PATHS.popup + 'employee.edit.html',
                    controller: "EditEmployee",
                    controllerAs: "vm",
                    resolve: {
                        data: function () {
                            return info;
                        }
                    }

                });
            }

        };
        
        $rootScope.$on("partialLoadRoomContrller", function () {
            $scope.getRoom();
        })

        $scope.currentPage = 1;
        $scope.pageSize = 5;
        $scope.getRoom = function () {
            dashboardService.getRoom().then(function (response) {
                console.log(response);
                $scope.allRoom = response;
            }, function (err) { });
        }
        $scope.getRoom();
        $scope.renderRoom = function () {
            jQuery('#draggable p').remove();
            for (var i = 0; i < $scope.tableNum.length; i++) {
                $scope.addTableToUI($scope.tableNum[i]);
            }
        }

        function sortArray(a, b) {
            if (a.number < b.number)
                return -1;
            if (a.number > b.number)
                return 1;
            return 0;
        }

        $scope.changeStatus = function () {
            var room = $scope.editabelRoom;
            var message = "Do you really want to deactivate the room";
            var status = 0;
            if (room.active == 0) {
                message = "Do you really want to activate the room";
                status = 1;
            }

            SweetAlert.swal({
                title: translationService.demand("MESSAGES.SWALTITLE.DELETE.TITLE"),
                text: message,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Confirm",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    if (room) {
                        dashboardService.changeStatus(room._id, status).then(function (response) {
                            toaster.pop('success', $rootScope.title_success, "Room status has been modified successfully..")
                            $scope.getRoom();
                        }, function (err) { });
                    }
                }
            });
        }

        $scope.deleteRoom = function (room) {
            SweetAlert.swal({
                title: translationService.demand("MESSAGES.SWALTITLE.DELETE.TITLE"),
                text: translationService.demand("MESSAGES.SWALTITLE.DELETE.TEXT"),
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: translationService.demand("MESSAGES.SWALTITLE.DELETE.CONFIRMTEXT"),
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    if (room) {
                        dashboardService.deleteRoom(room._id).then(function (response) {
                            toaster.pop('success', $rootScope.title_success, "Room has been deleted successfully..")
                            $scope.getRoom();
                        }, function (err) { });
                    }
                }
            });
        }

        $scope.openRoom = function (room) {
            $scope.editabelRoom = room;
            $scope.tableNum = [];
            $('#roomModal').modal('show');
            var tables = $scope.editabelRoom.tableNum;
            if (tables.length > 0) {
                var afterSort = tables.sort(sortArray);
                for (var i = 0; i < tables.length; i++)
                    $scope.tableNum.push(angular.copy(tables[i]));
            }
            var activetext = "Disable";
            if ($scope.editabelRoom.active == 0)
                activetext = "Enable";
            $scope.activetext = activetext;
            $scope.renderRoom();
        }

        $scope.isTableRemoved = function (id) {
            var isDeleted =true;
            for (var cnt = 0; cnt < $scope.tableNum.length; cnt++) {
                if ($scope.tableNum[cnt]._id == id)
                    isDeleted = false;
            }
            return isDeleted;
        }

        $scope.editTable = function () {
            var addCounter = 0;
            var recieveCounter = 0;
            var isTableDeleted = false;
            var isTableAdded = false;

            var filters = [];
            for (var cnt = 0; cnt < $scope.editabelRoom.tableNum.length; cnt++) {
                var tableid = $scope.editabelRoom.tableNum[cnt]._id;
                if ($scope.isTableRemoved(tableid)) {
                    isTableDeleted = true;
                    dashboardService.deleteTable(tableid).then(function (response) {
                    }, function (err) { });
                } else {
                    filters.push($scope.editabelRoom.tableNum[cnt]);
                }
            }

            $scope.editabelRoom.tableNum = filters;    
                   
            for (var i = 0; i < $scope.tableNum.length; i++) {
                console.log($scope.tableNum[i]);
                var table = $scope.tableNum[i];
                if (table && table._id) {
                    var temp;
                    if(table.type === 'table') {
                        temp = table.number;
                    } else {
                        temp = 'b' +table.number;
                    }

                    if($('#para'+temp)[0].attributes[2]) {
                        table.style = $('#para'+temp)[0].attributes[2].value;
                    }
                   
                   
                     if($('#para'+temp+' > strong')[0].attributes[0]) {
	                      table.rotation = $('#para'+temp+' > strong')[0].attributes[0].value;
                        
                    }
                     
                    dashboardService.updateTableNumber(table._id, table.number,table.style,table.rotation).then(function (response) {
                        console.log(response)
                        console.log("updated with table  id -" + response._id)
                    }, function (err) { });
                } else {
                    isTableAdded = true;
                    addCounter++;
                    var temp1 = $scope.tableNum[i].number;
                    if(table.type === 'bar') {
                        temp1 = 'b' + temp1;
                    }
                    if($('#para'+temp1)[0].attributes[2]) {
                        $scope.tableNum[i].style = $('#para'+temp1)[0].attributes[2].value;

                    }
                    
                    
                     if($('#para'+temp1+' > strong')[0].attributes[0]) {
	                    //console.log($('#para'+temp1+' > strong')[0].attributes[0].value);
	                      $scope.tableNum[i].rotation = $('#para'+temp1+' > strong')[0].attributes[0].value;
                       
                    }
                    
                    dashboardService.table($scope.tableNum[i]).then(function (response) {
                        console.log(response)
                        console.log("added with table  id -" + response._id)
                        $scope.editabelRoom.tableNum.push(response._id);
                        recieveCounter++;
                        if (addCounter == recieveCounter) {
                            console.log("updating room");
                            $('#roomModal').modal('hide');
                            toaster.pop('success', $rootScope.title_success, "table changes have been saved")
                            dashboardService.editRoom($scope.editabelRoom).then(function (response) {
                                console.log(response);
                                $scope.getRoom();
                            }, function (err) { });
                        }
                    }, function (err) { });
                }
            }
            if (isTableDeleted || isTableAdded) {
                if (!isTableAdded) {
                    console.log("only delete case");
                    dashboardService.editRoom($scope.editabelRoom).then(function (response) {
                        toaster.pop('success', $rootScope.title_success, "table changes have been saved")
                        $('#roomModal').modal('hide');
                        $scope.getRoom();
                    }, function (err) { });
                }
            } else {
                toaster.pop('success', $rootScope.title_success, "table changes have been saved")
                $('#roomModal').modal('hide');
                console.log("no update and delete case");
                $scope.getRoom();
            }
           



            //dashboardService.editRoom($scope.editabelRoom).then(function (response) {
            //    console.log(response);
            //    $('#roomModal').modal('hide');
            //    console.log($scope.editabelRoom);
            //    console.log($scope.tableNum);
            //    for (var i = 0; i < $scope.tableNum.length; i++) {
            //        console.log($scope.tableNum[i]);
            //        var table = $scope.tableNum[i];
            //        if (table && table._id) {
            //            dashboardService.updateTableNumber(table._id, table.number).then(function (response) {
            //                console.log(response)
            //                console.log("updated with table  id -" + response._id)
            //            }, function (err) { });
            //        } else {
            //            isAnyNewTable = true;
            //            addCounter++;                        
            //            dashboardService.table($scope.tableNum[i]).then(function (response) {
            //                console.log(response)
            //                console.log("added with table  id -" + response._id)
            //                $scope.editabelRoom.tableNum.push(response._id);

            //            }, function (err) { });
            //        }
            //    }
            //    if (!isAnyNewTable)
            //        $scope.getRoom();
            //}, function (err) { });
        }

        $scope.deleteTable = function () {
            console.log($scope.tableNum);
            var number = $scope.elementId.replace("para", "");
            var arrIndex = -1;
            var clickedtype = $("#" + $scope.elementId).attr("clickedtype");// 'table';

            for (var cnt = 0; cnt < $scope.tableNum.length; cnt++) {
                if (clickedtype == $scope.tableNum[cnt].type) {
                    if ($scope.tableNum[cnt].number == number)
                        arrIndex = cnt;
                }
            }

            var tableObj = $scope.tableNum[arrIndex];

            for (var cnt1 = arrIndex + 1; cnt1 < $scope.tableNum.length; cnt1++) {
                if (clickedtype == $scope.tableNum[cnt1].type) {
                    var number = $scope.tableNum[cnt1].number;
                    var afterDecrement = number - 1;
                    $scope.tableNum[cnt1].number = afterDecrement;
                }
            }
            $scope.tableNum.splice(arrIndex, 1);
            //console.log($scope.tableNum);
            //var contentToRemove = document.querySelectorAll('#' + $scope.elementId);
            //$(contentToRemove).remove();
            $('#deleteModal').modal('hide');
            $scope.renderRoom();
            //var spanid = id=\"" + spanid + "\">" + number + "
        }

        listOfrestaurants.$inject = ['restaurantService'];
        /* @ngInject */
        function listOfrestaurants(restaurantService) {
            return restaurantService.getList().then(function (data) { return data });
        }
    }
})();
CreateRoomController.$inject = ['$uibModalInstance', '$scope', '$state', '$rootScope', 'SessionService', '$stateParams', '$location', '$window', 'toaster', 'dashboardService', 'getResturants', 'translationService'];
/* @ngInject */
function CreateRoomController($uibModalInstance, $scope, $state, $rootScope, SessionService, $stateParams, $location, $window, toaster, dashboardService, getResturants, translationService) {
    var vm = this

    vm.room = {}
    if (getResturants.data) {
        vm.employee.restaurants = getResturants.data
    }

    this.create = function () {
        if (vm.userform.$valid) {
            vm.room.created_by = JSON.parse(localStorage.getItem('logedInUser')).name;
            vm.room.updated_by = JSON.parse(localStorage.getItem('logedInUser')).name;
            vm.room.restaurant = JSON.parse(localStorage.getItem('logedInUser')).userid;
            vm.room.tableNum = [];
            dashboardService.createRoom(vm.room).then(function (data) {
                console.log(data);
                if (data && data.iserror) {
                    toaster.pop('error', $rootScope.title_fail, "Room exist with the same name, Please choose another name...");
                } else {
                    $rootScope.$emit("partialLoadRoomContrller", {});
                    if (data) {
                        toaster.pop('success', $rootScope.title_success, "Room added successfully..")
                        $uibModalInstance.close('ok');
                    }
                }
            }, function (err) {
                console.log(err)
            })

        }
        else {
            toaster.pop('error', $rootScope.title_fail, translationService.demand("MESSAGES.ALLFIELDSRQ"))
        }
    }

    $scope.close = function () {
        $uibModalInstance.close('ok');
    }
}