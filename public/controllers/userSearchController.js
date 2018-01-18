/**
 * Created by Vaibhav on 3/17/2016.
 */
var app=angular.module('userSearchPage', []);
//It is called automatically when we open the home page
app.controller('userSearchController',function($scope,$http) {
    $http({
        method : "GET",
        url : "/searchUserName"
    }).success(function(data){
        $scope.searchResults=data;
        $scope.searchKey=data[0].searchKey;
    })

    $scope.follow=function(followingId){
        $http({
            method : "POST",
            url : "/followUser",
            data: {
                "followingId": followingId
            }
        }).success(function(data){
            $scope.searchResults=data;
        })
    }
});
