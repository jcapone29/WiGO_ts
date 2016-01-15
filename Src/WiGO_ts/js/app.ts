module WiGO.HooGo {

    export var app = angular.module("wigo.hoogo", ['ionic', 'ionic-letter-avatar', 'ngCordova']).factory('_', [
        '$window',
        function ($window: any) {
            return $window._;
        }
    ]);

    app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider
            .state('signin', {
                url: '/sign-in',
                controller: 'WiHomeCtrl',
                templateUrl: 'templates/sign-in.html',
        
            })
            .state('tabs', {
                url: '/tab',
                controller: 'WiHomeCtrl',
                templateUrl: 'templates/tabs.html'
            })
            .state('tabs.home', {
                url: '/home',
                views: {
                    'home-tab': {
                        templateUrl: 'templates/home.html',
                        controller: 'WiHomeCtrl'
                    }
                }
            })
            .state('settings', {
                url: '/settings',
                templateUrl: 'templates/settings.html',
                controller: 'WiHomeCtrl',

            })
            .state('about', {
                url: '/about',
                controller: 'WiHomeCtrl',
                templateUrl: 'templates/about.html'
            })
            .state('setitup', {
                url: '/setitup',
                controller: 'WiHomeCtrl',
                templateUrl: 'templates/setitup.html'
            })
         .state('tabs.igoin', {
             url: '/igoin',
             views: {
                 'igoin-tab': {
                     controller: 'WiHomeCtrl',
                     templateUrl: 'templates/IGoin.html'
                 }
             }
        });

        $urlRouterProvider.otherwise('/sign-in');
        $ionicConfigProvider.tabs.position("bottom");

       


    });

    app.filter('range', function () {
        return function (input, total) {
            total = parseInt(total);

            for (var i = 0; i < total; i++) {
                input.push(i);
            }

            return input;
        };
    });


   
}

