'use strict';

var app = angular.module('MockReddit');

app.controller('MainController', ['$scope', function ($scope) {

    function loginDialog(ev) {
        var parentEl = angular.element(document.body);
        var login = $mdDialog.show()
        .title('Sign up')
        .ok('Close')
        $mdDialog.showPrompt({
            parent: parentEl,
            targetEvent: ev,
            templateUrl: '/js/authentication/templates/login.html',
            locals: {
            user: $scope.user
        },
            controller: 'LoginController'
        });

    }
    
    

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



}]);