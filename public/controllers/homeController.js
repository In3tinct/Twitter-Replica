/**
 * Created by Vaibhav on 3/11/2016.
 */


var app=angular.module('homeApp', []);
//It is called automatically when we open the home page
app.controller('tweetsController',function($scope,$http) {
    $http({
            method : "GET",
            url : "/fetchTweets"
    }).success(function(data){
        alert(data);
        $scope.tweets=data;
    })

    $scope.insertTweet=function(retweet_user_id,retweet_post,isRetweet) {
        $http({
            method: "POST",
            url: "/insertTweet",
            data: {
                "tweetpost": $scope.tweetpost,
                "retweet_user_id": retweet_user_id,
                "retweet_post":retweet_post,
                "isRetweet": isRetweet
            }
        }).success(function (data) {
            if (data.statusCode == 401) {
                console.log('error');
             } else {
                window.location.assign("/home");
            }
        }).error(function (error){
            console.log(error);
        });
    };

    $scope.userProfile=function(user_id,whole_name) {
        $http({
            method: "POST",
            url: "/setDynamicValuesToProfile",
            data: {
                "user_id": user_id,
                "whole_name": whole_name
            }
        }).success(function (data) {
            if (data.statusCode == 200) {
                window.location.assign("/redirectToProfile");
            }
        })
    };

    $scope.isRetweetFunction = function(retweet_user) {

        if(retweet_user==null || retweet_user=='' || retweet_user=='null') {
            return false;
        }else {
            return true;
        }
    }

});


app.controller('badge_counts',function($scope,$http) {
    $http({
        method : "GET",
        url : "/getCounts"
    }).success(function(data){
        $scope.tweetCounts=data.tweetCounts;
        $scope.followingCounts=data.followingCounts;
        $scope.followersCounts=data.followersCounts;
        $scope.fullName=data.fullName;
        $scope.userHandle=data.userHandle;
    })

    $scope.userProfile=function(user_id,whole_name) {
        $http({
            method: "POST",
            url: "/setDynamicValuesToProfile",
            data: {
                "user_id": user_id,
                "whole_name": whole_name
            }
        }).success(function (data) {
            if (data.statusCode == 200) {
                window.location.assign("/redirectToProfile");
            }
        })
    };
});


app.controller('searchController',function($scope,$http) {

    $scope.searchFunction=function(searchValue) {
        $http({
            method: "POST",
            url: "/setSearchValue",
            data: {
                "searchValue": searchValue
            }
        }).success(function (data) {
            if (data.statusCode == 200 && data.searchHash==true ) {
                window.location.assign("/openHashPage");
            }else{
                window.location.assign("/openSearchPage");
            }
        })
    };
});

app.controller('signoutController',function($scope,$http) {

    $scope.signout=function() {
        $http({
            method: "GET",
            url: "/signout"
        }).success(function (data) {
            window.location.assign("/");
        })
    };
});
