/**
 * Created by Vaibhav on 3/10/2016.
 */


var app=angular.module('registerApp', []);
app.controller('registercontroller',function($scope,$http) {
    $scope.invalid_login = true;
    $scope.signup=function() {
        $http({
            method: "POST",
            url: "/register",
            data: {
                "first_name": $scope.first_name,
                "last_name": $scope.last_name,
                "email": $scope.email,
                "password": $scope.password,
                "userhandle": $scope.userhandle
            }
        }).success(function (data) {
            if (data.statusCode == 401) {
                $scope.invalid_login = false;
                window.location.assign("#");
            } else {
                window.location.assign("/home");
            }
        }).error(function (error){

        });
    };
})