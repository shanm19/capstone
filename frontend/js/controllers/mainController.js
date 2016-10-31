'use strict';

var app = angular.module('MockReddit');

app.controller('MainController', ['$scope', function ($scope) {

    

    $scope.posts = [
        {
            title: 'Hairy Dogs eat Chicken',
            content: 'Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first!',
            originalPoster: 'doglover123',
            upvotes: 10,
            downvotes: 2,
            netVotes: 8
        }, {
            title: 'Hairy Dogs eat Chicken AND BEEF AND MORE FOODS I NEED TO MAKE THIS SENTENCE LONGER TO MAKE SURE IT WILL WRAP IN A WAY THAT\'S VISUALLY APPEALING',
            content: 'Hair dogs eat chicken you1 heard it here first! Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first! Hair dogs eat chicken you heard it here first!',
            originalPoster: 'doglover1231',
            upvotes: 10,
            downvotes: 2,
            netVotes: 8
        }];

    $scope.image = 'http://surfingsports.com/images/casey_michigan_sup1.jpg'


    $scope.FBlogin = function(){
        UserService.FBlogin()
        .then(function(response){
            console.logt('Maincontroller ', response)
            $scope.user = response;
        })
    }


}]);