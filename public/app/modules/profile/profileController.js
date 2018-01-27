(function () {
    'use strict';

    angular
        .module('profile')
        .controller('profileController', Controller);

    Controller.$inject = ['SessionService', 'localStorageService', 'dashboardService', 'toaster', 'session', '$translate', 'translationService', '$timeout', '$scope', 'profileService', '$rootScope'];
    /* @ngInject */
    function Controller(SessionService, localStorageService, dashboardService, toaster, session, $translate, translationService, $timeout, $scope, profileService, $rootScope) {

        console.log("profile ready");
        var loggedUser = JSON.parse(localStorage.getItem('logedInUser'));
        profileService.getUserDetails(loggedUser.userid).then(function (resData) {
            $scope.userDetails = resData.data;
            console.log($scope.userDetails);
            if (resData.data.image)
                $scope.logo = resData.data.image;
        });

        $scope.upwd = '';
        $scope.ucpwd = '';

        $scope.updateUser = function () {
            if ($scope.upwd == '' && $scope.ucpwd == '') {
                console.log($scope.userDetails);
                profileService.updateUser($scope.userDetails, null).then(function (resData) {
                    //$scope.userDetails = resData.data;
                    toaster.pop('success', "User edit", "User profile has been updated successfully")
                });
                $scope.updateUserImage();
            } else {
                if ($scope.upwd != $scope.ucpwd) {
                    toaster.pop('error', "Error", "Password and confirm password are not matching");
                } else {
                    var passwordToUpdate = $scope.upwd;
                    console.log($scope.userDetails);
                    profileService.updateUser($scope.userDetails, passwordToUpdate).then(function (resData) {
                        //$scope.userDetails = resData.data;
                        toaster.pop('success', "User edit", "User profile has been updated successfully")
                    });
                    $scope.updateUserImage();
                }
            }
        }


        $scope.generateUUID = function () {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxxxxxxxxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = (d + Math.random() * 16) % 16 | 0;
                d = Math.floor(d / 16);
                return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
            return uuid;
        };

        $scope.initAWS = function () {
            var albumBucketName = 'ithoursclientdata';
            var bucketRegion = 'Oregon';
            var IdentityPoolId = 'us-west-2:2edbb998-fe7d-4078-89b0-96b302d6a578'
            AWS.config.update({
                region: 'us-west-2',
                credentials: new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: IdentityPoolId
                })
            });
            $scope.AWSS3 = new AWS.S3({
                apiVersion: '2006-03-01',
                params: { Bucket: albumBucketName }
            });
        }
        $scope.initAWS();

        $scope.updateToDB = function (imageurl) {
            console.log(imageurl);
            profileService.updateUserImageToDB($scope.userDetails._id, imageurl).then(function (resData) {
                //$scope.userDetails = resData.data;
                toaster.pop('success', "User edit", "User profile image has been updated successfully")
                $scope.$emit("LOADDUSERDATA", $scope.userDetails._id);
            });
        }

        $scope.updateUserImage = function () {
            if ($scope.isfileuploaded) {
                var fileVal = $("#fileinputlogo")[0];
                if (fileVal.files && fileVal.files.length > 0) {
                    $scope.AWSS3.upload({
                        Key: $scope.generateUUID(),
                        Body: fileVal.files[0],
                        ACL: 'public-read'
                    }, function (err, data) {
                        if (err) {
                            alertservice.showAlert('error', "Failed", "There was an error uploading your photo");
                        } else {
                            console.log(data);
                            $scope.updateToDB(data.Location);
                        }
                    });
                }
            }
        }

        $scope.logo = null; // "http://www.anaivanovic.com/sites/default/files/styles/flexslider_full_mobile/public/profile.jpg";
        $scope.removelogo = function () {
            $scope.logo = null;
            $scope.isfileuploaded = false;
        }

        $scope.isfileuploaded = false;
        $scope.openfilemodel = function () {
            var inputfile = $("#fileinputlogo");
            inputfile.change($scope.setFile);
            inputfile.click();
        }

        $scope.setFile = function () {
            var reader = new FileReader();
            reader.onload = function (event) {
                $scope.logo = event.target.result
                $scope.isfileuploaded = true;
                $scope.$apply();
            }
            reader.readAsDataURL($("#fileinputlogo")[0].files[0]);
        }
    }
})();