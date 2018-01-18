/**
 * Created by Vaibhav on 3/10/2016.
 */

var app=angular.module('myApp', []);
app.controller('logincontroller',function($scope,$http) {

    $scope.invalid_login = true;
    $scope.unexpected_error = true;

    $scope.submit=function() {
        $http({
            method: "POST",
            url: "/trylogin",
            data: {
                "username": $scope.username,
                "password": $scope.password
            }
        }).success(function (data) {

            if (data.statusCode == 401) {
                $scope.invalid_login = false;
                $scope.unexpected_error = true;
            } else {
                window.location.assign("/home");
            }
        }).error(function (error){
            $scope.invalid_login = true;
            $scope.unexpected_error = false;
        });
    };
})


app.controller('openSignup',function($scope,$http) {

    $scope.signup=function() {
        window.location.assign("/signup");
    };
})

