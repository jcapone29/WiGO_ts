var WiGO;
(function (WiGO) {
    var HooGo;
    (function (HooGo) {
        HooGo.app = angular.module("wigo.hoogo", ['ionic', 'ionic-letter-avatar', 'ngCordova']).factory('_', [
            '$window',
            function ($window) {
                return $window._;
            }
        ]);
        HooGo.app.config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
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
        HooGo.app.filter('range', function () {
            return function (input, total) {
                total = parseInt(total);
                for (var i = 0; i < total; i++) {
                    input.push(i);
                }
                return input;
            };
        });
    })(HooGo = WiGO.HooGo || (WiGO.HooGo = {}));
})(WiGO || (WiGO = {}));
var WiGO;
(function (WiGO) {
    var HooGo;
    (function (HooGo) {
        var WiHomeCtrl = (function () {
            function WiHomeCtrl($scope, _, $ionicSideMenuDelegate, $state, WiService, $ionicModal, $ionicSlideBoxDelegate, $cordovaContacts) {
                this.$scope = $scope;
                this._ = _;
                this.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
                this.$state = $state;
                this.WiService = WiService;
                this.$ionicModal = $ionicModal;
                this.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                this.$cordovaContacts = $cordovaContacts;
                this.showside = false;
                this.userdictionary = new UserInfo();
                this.userNameList = new Array('');
                this.places = new Array();
                this.signinloading = false;
                this.eventUserList = new EventList();
                ////////////
                this.DaysOfWeek = new Array();
                this.showside = true;
                this.NewUserModalLoad();
            }
            WiHomeCtrl.prototype.LocalStorageCheck = function () {
                this.userdictionary.UserName = localStorage.getItem("WiGOUserName");
                this.userdictionary.Password = localStorage.getItem("WiGOUserPassword");
                if (this.userdictionary.UserName == null || this.userdictionary.UserName == 'undefined' || this.userdictionary.Password == null || this.userdictionary.Password == 'undefined') {
                    this.userdictionary.UserName = '';
                    this.userdictionary.Password = '';
                    this.$state.go('signin');
                }
                else {
                    this.LogIn();
                }
            };
            WiHomeCtrl.prototype.LogIn = function () {
                var _this = this;
                this.signinloading = true;
                this.UserDataCache();
                this.WiService.ConfirmLogin(this.userdictionary).then(function (response) {
                    if (response.data.length > 0) {
                        _this.userdictionary = response.data[0];
                        _this.signinloading = false;
                        _this.showside = true;
                        _this.$state.go('tabs.home');
                        _this.AreaPlaces();
                        _this.ListDates();
                    }
                    else {
                        alert('User Does not exist');
                        _this.signinloading = false;
                    }
                });
            };
            WiHomeCtrl.prototype.AreaPlaces = function () {
                var _this = this;
                this.WiService.GetPlaces().then(function (response) {
                    _this.places = response;
                    _this.listHoods = _this._.uniq(_this._.pluck(_this.places, 'Neighborhood'));
                });
            };
            WiHomeCtrl.prototype.UserDataCache = function () {
                localStorage.setItem("WiGOUserName", this.userdictionary.UserName);
                localStorage.setItem("WiGOUserPassword", this.userdictionary.Password);
            };
            WiHomeCtrl.prototype.NewUserModalLoad = function () {
                var _this = this;
                this.$ionicModal.fromTemplateUrl('templates/newuser.html', function (modal) {
                    _this.$scope.modal = modal;
                }, {
                    scope: this.$scope,
                    animation: 'slide-in-up'
                });
            };
            WiHomeCtrl.prototype.NewUserForm = function () {
                var _this = this;
                this.userNameList = new Array('');
                this.WiService.GetUsers().then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        _this.userNameList.push(response[i]['username']);
                    }
                    _this.$scope.modal.show();
                });
            };
            WiHomeCtrl.prototype.CreateAccount = function () {
                var _this = this;
                this.signinloading = true;
                this.WiService.CreateNewUser(this.userdictionary).then(function (response) {
                    _this.signinloading = false;
                    _this.$scope.modal.hide();
                    _this.showside = true;
                    _this.$state.go('tabs.home');
                });
            };
            WiHomeCtrl.prototype.SelectHood = function () {
                var area = this._.filter(this.places, "Neighborhood", this.eventSelected.Neighborhood);
                this.toparea = this._.sample(area, 3);
            };
            WiHomeCtrl.prototype.RandomizeHood = function () {
                if (this.eventSelected == undefined) {
                    this.eventSelected = new LocationList();
                    this.eventSelected.Neighborhood = this._.sample(this.listHoods);
                }
                else {
                    this.eventSelected.Neighborhood = this._.sample(this.listHoods);
                }
                var area = this._.filter(this.places, "Neighborhood", this.eventSelected.Neighborhood);
                this.toparea = this._.sample(area, 3);
            };
            WiHomeCtrl.prototype.SearchHood = function () {
                var topsearch = [];
                var search = this.eventSelected.BusinessName;
                var test = this._.forEach(this.places, function (n, key) {
                    if (n["BusinessName"].toLowerCase().indexOf(search.toLowerCase()) > -1)
                        topsearch.push(n);
                });
                this.toparea = this._.sample(topsearch, 3);
            };
            WiHomeCtrl.prototype.ListDates = function () {
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                for (var i = 0; i < 7; i++) {
                    var weekdates = new EventDates();
                    var date = new Date();
                    date.setDate(date.getDate() + i);
                    var dayposition = date.getDay().toString();
                    var day = days[dayposition];
                    weekdates.Day = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                    weekdates.DayOfWeek = day.toString();
                    this.DaysOfWeek.push(weekdates);
                }
                this.eventUserList.DateOfEvent = this.DaysOfWeek[0].Day;
            };
            WiHomeCtrl.prototype.EventSelect = function (Event) {
                var _this = this;
                this.eventSelected = Event;
                this.WiService.GetLocation(this.eventSelected.Location).then(function (response) {
                    _this.eventSelected.Address = response.results[0]['formatted_address'];
                });
            };
            WiHomeCtrl.prototype.CreateEvent = function () {
                var event = new NewEvent();
                event.LeaderInfo = this.userdictionary;
                event.Location = this.eventSelected;
                event.EventDate = this.eventUserList.DateOfEvent;
                event.WordfromLeader = this.wordTothePeople;
                console.log(event);
            };
            WiHomeCtrl.prototype.SignOut = function () {
                localStorage.clear();
                this.LocalStorageCheck();
            };
            WiHomeCtrl.prototype.SetitUp = function () {
                this.$state.go('setitup');
            };
            WiHomeCtrl.$inject = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts"];
            return WiHomeCtrl;
        })();
        HooGo.WiHomeCtrl = WiHomeCtrl;
        HooGo.app.controller("WiHomeCtrl", WiHomeCtrl);
        var UserInfo = (function () {
            function UserInfo() {
            }
            return UserInfo;
        })();
        HooGo.UserInfo = UserInfo;
        var LocationList = (function () {
            function LocationList() {
            }
            return LocationList;
        })();
        HooGo.LocationList = LocationList;
        var EventDates = (function () {
            function EventDates() {
            }
            return EventDates;
        })();
        HooGo.EventDates = EventDates;
        var NewEvent = (function () {
            function NewEvent() {
            }
            return NewEvent;
        })();
        HooGo.NewEvent = NewEvent;
        var EventList = (function () {
            function EventList() {
            }
            return EventList;
        })();
        HooGo.EventList = EventList;
    })(HooGo = WiGO.HooGo || (WiGO.HooGo = {}));
})(WiGO || (WiGO = {}));
var WiGO;
(function (WiGO) {
    var HooGo;
    (function (HooGo) {
        var WiService = (function () {
            function WiService($http, $q) {
                this.$http = $http;
                this.$q = $q;
                this.localURL = "http://localhost:53978/api/HooGoin/";
                this.HostedURL = "http://ec2-52-23-228-61.compute-1.amazonaws.com/WiGOAPI/api/HooGoin/";
                this.GoogleMapsLocation = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
            }
            WiService.prototype.ConfirmLogin = function (info) {
                return this.$http.post(this.HostedURL + 'userinfo', info).then(function (response) {
                    return response;
                });
            };
            WiService.prototype.GetPlaces = function () {
                return this.$http.get(this.HostedURL + "places").then(function (r) { return r.data; });
            };
            WiService.prototype.GetUsers = function () {
                return this.$http.get(this.HostedURL + "users").then(function (r) { return r.data; });
            };
            WiService.prototype.CreateNewUser = function (info) {
                return this.$http.post(this.HostedURL + 'newUser', info).then(function (response) {
                    return response;
                });
            };
            WiService.prototype.GetLocation = function (location) {
                location = location.replace('(', '');
                location = location.replace(')', '');
                var test = this.GoogleMapsLocation + location + "&sensor=true";
                return this.$http.get(test).then(function (r) { return r.data; });
            };
            WiService.$inject = ["$http", "$q"];
            return WiService;
        })();
        HooGo.WiService = WiService;
        HooGo.app.service("WiService", WiService);
    })(HooGo = WiGO.HooGo || (WiGO.HooGo = {}));
})(WiGO || (WiGO = {}));
//# sourceMappingURL=app.js.map