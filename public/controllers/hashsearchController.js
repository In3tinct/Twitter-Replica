/**
 * Created by Vaibhav on 3/14/2016.
 */

var app=angular.module('hashSearchPage', []);
//It is called automatically when we open the home page
app.controller('hashSearchController',function($scope,$http) {
    $http({
        method : "GET",
        url : "/fetchHashTweets"
    }).success(function(data){
        $scope.searchResults=data;

        var indexOfHash=(data[0].tweet_comments.indexOf('#'));
        $scope.hashTag=data[0].tweet_comments.substring(indexOfHash, data[0].tweet_comments.length);
    })
});
