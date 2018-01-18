/**
 * Created by Vaibhav on 3/14/2016.
 */

var app=angular.module('profileApp', []);
//It is called automatically when we open the home page
app.controller('profileController',function($scope,$http) {
     $scope.followingClicked=true;
    $scope.followersClicked=true;
    $scope.tweetsClicked=false;

    $http({
        method : "GET",
        url : "/fetchProfileInfo"
    }).success(function(data){
        $scope.tweets=data.tweets;
        $scope.tweetCounts=data.tweetCounts;
        $scope.followingCounts=data.followingCounts;
        $scope.followersCounts=data.followersCounts;
        $scope.fullName=data.fullName;
        $scope.userHandle=data.userHandle;
    })

    $scope.fetchFollowingList=function() {
        $http({
            method: "GET",
            url: "/fetchFollowingList"
        }).success(function (data) {
            $scope.followingClicked=false;
            $scope.followersClicked=true;
            $scope.tweetsClicked=true;
            $scope.followingList=data;
        })
    };

    $scope.fetchFollowersList=function() {
        $http({
            method: "GET",
            url: "/fetchFollowersList"
        }).success(function (data) {
            $scope.followersClicked=false;
            $scope.followingClicked=true;
            $scope.tweetsClicked=true;
            $scope.followersList=data;
        })
    };

    $scope.fetchTweetsOnClick=function(){
        $http({
            method : "GET",
            url : "/fetchProfileInfo"
        }).success(function(data){
            $scope.tweetsClicked=false;
            $scope.followersClicked=true;
            $scope.followingClicked=true;
            $scope.tweets=data.tweets;
            $scope.tweetCounts=data.tweetCounts;
            $scope.followingCounts=data.followingCounts;
            $scope.followersCounts=data.followersCounts;
            $scope.fullName=data.fullName;
            $scope.userHandle=data.userHandle;
        })
    }
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
        }).success(function () {
            window.location.assign("/");
        })
    };
});