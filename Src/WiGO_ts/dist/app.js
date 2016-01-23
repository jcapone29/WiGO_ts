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
                .state('eventfreinds', {
                url: '/eventfreinds',
                controller: 'WiHomeCtrl',
                templateUrl: 'templates/eventFriendList.html'
            })
                .state('setitup', {
                url: '/setitup',
                controller: 'SetItUpCtrl',
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
            function WiHomeCtrl($scope, _, $ionicSideMenuDelegate, $state, WiService, $ionicModal, $ionicSlideBoxDelegate, $cordovaContacts, $ionicPopover, $cordovaGeolocation) {
                this.$scope = $scope;
                this._ = _;
                this.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
                this.$state = $state;
                this.WiService = WiService;
                this.$ionicModal = $ionicModal;
                this.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                this.$cordovaContacts = $cordovaContacts;
                this.$ionicPopover = $ionicPopover;
                this.$cordovaGeolocation = $cordovaGeolocation;
                this.showside = false;
                this.signinloading = false;
                this.showside = true;
                this.NewUserModalLoad();
                this.GetCurrentLocation();
            }
            WiHomeCtrl.prototype.LocalStorageCheck = function () {
                this.WiService.userdictionary.UserName = localStorage.getItem("WiGOUserName");
                this.WiService.userdictionary.Password = localStorage.getItem("WiGOUserPassword");
                if (this.WiService.userdictionary.UserName == null || this.WiService.userdictionary.UserName == 'undefined' || this.WiService.userdictionary.Password == null || this.WiService.userdictionary.Password == 'undefined') {
                    this.WiService.userdictionary.UserName = '';
                    this.WiService.userdictionary.Password = '';
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
                this.WiService.ConfirmLogin(this.WiService.userdictionary).then(function (response) {
                    if (response.data.length > 0) {
                        _this.WiService.userdictionary = response.data[0];
                        _this.signinloading = false;
                        _this.showside = true;
                        _this.$state.go('tabs.home');
                        _this.AreaPlaces();
                        _this.ListDates();
                        _this.GetUserGroups();
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
                    _this.WiService.places = response;
                    _this.WiService.listHoods = _this._.uniq(_this._.pluck(_this.WiService.places, 'Neighborhood'));
                    _this._.forEach(_this.WiService.places, (function (place) {
                        place.Distance = _this.WiService.getDistanceFromLatLonInKm(place.Lat, place.Long);
                    }));
                });
            };
            WiHomeCtrl.prototype.GetUserGroups = function () {
                var _this = this;
                this.WiService.GetUserGroups(this.WiService.userdictionary.UserID).then(function (response) {
                    _this.WiService.friendGroups = response;
                });
            };
            WiHomeCtrl.prototype.UserDataCache = function () {
                localStorage.setItem("WiGOUserName", this.WiService.userdictionary.UserName);
                localStorage.setItem("WiGOUserPassword", this.WiService.userdictionary.Password);
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
                this.WiService.userNameList = new Array('');
                this.WiService.GetUsers().then(function (response) {
                    for (var i = 0; i < response.length; i++) {
                        _this.WiService.userNameList.push(response[i]['username']);
                        _this.WiService.friendList.push(response[i]);
                    }
                    _this.$scope.modal.show();
                });
            };
            WiHomeCtrl.prototype.CreateAccount = function () {
                var _this = this;
                this.signinloading = true;
                this.WiService.CreateNewUser(this.WiService.userdictionary).then(function (response) {
                    _this.signinloading = false;
                    _this.$scope.modal.hide();
                    _this.showside = true;
                    _this.$state.go('tabs.home');
                });
            };
            WiHomeCtrl.prototype.ListDates = function () {
                var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                var monthNames = ["January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December"
                ];
                this.WiService.DaysOfWeek = new Array();
                for (var i = 0; i < 7; i++) {
                    var weekdates = new EventDates();
                    var date = new Date();
                    date.setDate(date.getDate() + i);
                    var dayposition = date.getDay().toString();
                    var day = days[dayposition];
                    weekdates.Month = date.getMonth() + 1;
                    weekdates.Day = date.getDate();
                    weekdates.Year = date.getFullYear();
                    weekdates.DayOfWeek = day.toString();
                    weekdates.MonthName = monthNames[date.getMonth()];
                    this.WiService.DaysOfWeek.push(weekdates);
                }
                this.WiService.eventUserList.DateOfEvent = this.WiService.DaysOfWeek[0].Day.toString();
            };
            WiHomeCtrl.prototype.SignOut = function () {
                localStorage.clear();
                this.LocalStorageCheck();
            };
            WiHomeCtrl.prototype.SetitUp = function () {
                this.$state.go('setitup');
            };
            WiHomeCtrl.prototype.GetCurrentLocation = function () {
                var _this = this;
                this.WiService.location = new UserLocation();
                this.$cordovaGeolocation.getCurrentPosition().then(function (position) {
                    _this.WiService.location = position["coords"];
                });
            };
            WiHomeCtrl.$inject = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts", "$ionicPopover", "$cordovaGeolocation"];
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
        var FreindGroup = (function () {
            function FreindGroup() {
            }
            return FreindGroup;
        })();
        HooGo.FreindGroup = FreindGroup;
        var UserLocation = (function () {
            function UserLocation() {
            }
            return UserLocation;
        })();
        HooGo.UserLocation = UserLocation;
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
                this.eventUserList = new HooGo.EventList();
                this.eventFreinds = new Array();
                this.DaysOfWeek = new Array();
                ///User Info////
                this.userdictionary = new HooGo.UserInfo();
                this.userNameList = new Array('');
                //Friends Info/////
                this.friendList = new Array();
                this.friendGroups = new Array();
                ///Area Info////
                this.places = new Array();
                /////////////
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
            WiService.prototype.GetUserGroups = function (userid) {
                return this.$http.get(this.HostedURL + "usergroups?userid=" + userid).then(function (r) { return r.data; });
            };
            WiService.prototype.GetLocation = function () {
                var test = this.GoogleMapsLocation + this.eventSelected.Lat + "," + this.eventSelected.Long + "&sensor=true";
                return this.$http.get(test).then(function (r) { return r.data; });
            };
            WiService.prototype.getDistanceFromLatLonInKm = function (lat2, lon2) {
                var lat1 = this.location.latitude;
                var lon1 = this.location.longitude;
                var deg2Rad = function (deg) {
                    return deg * Math.PI / 180;
                };
                var r = 6371; // Radius of the earth in km
                var dLat = deg2Rad(lat2 - lat1);
                var dLon = deg2Rad(lon2 - lon1);
                var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2Rad(lat1)) * Math.cos(deg2Rad(lat2)) *
                        Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = r * c; // Distance in km
                d = d * 0.621371;
                d = +d.toPrecision(3);
                return d;
            };
            WiService.$inject = ["$http", "$q"];
            return WiService;
        })();
        HooGo.WiService = WiService;
        HooGo.app.service("WiService", WiService);
    })(HooGo = WiGO.HooGo || (WiGO.HooGo = {}));
})(WiGO || (WiGO = {}));
var WiGO;
(function (WiGO) {
    var HooGo;
    (function (HooGo) {
        var SetItUpCtrl = (function () {
            function SetItUpCtrl($scope, _, $ionicSideMenuDelegate, $state, WiService, $ionicModal, $ionicSlideBoxDelegate, $cordovaContacts, $ionicPopover, $cordovaGeolocation) {
                this.$scope = $scope;
                this._ = _;
                this.$ionicSideMenuDelegate = $ionicSideMenuDelegate;
                this.$state = $state;
                this.WiService = WiService;
                this.$ionicModal = $ionicModal;
                this.$ionicSlideBoxDelegate = $ionicSlideBoxDelegate;
                this.$cordovaContacts = $cordovaContacts;
                this.$ionicPopover = $ionicPopover;
                this.$cordovaGeolocation = $cordovaGeolocation;
            }
            SetItUpCtrl.prototype.SelectHood = function () {
                var area = this._.filter(this.WiService.places, "Neighborhood", this.WiService.eventSelected.Neighborhood);
                this.WiService.toparea = this._.sample(area, 10);
            };
            SetItUpCtrl.prototype.RandomizeHood = function () {
                if (this.WiService.eventSelected == undefined) {
                    this.WiService.eventSelected = new HooGo.LocationList();
                    this.WiService.eventSelected.Neighborhood = this._.sample(this.WiService.listHoods);
                }
                else {
                    this.WiService.eventSelected.Neighborhood = this._.sample(this.WiService.listHoods);
                }
                var area = this._.filter(this.WiService.places, "Neighborhood", this.WiService.eventSelected.Neighborhood);
                this.WiService.toparea = this._.sample(area, 10);
            };
            SetItUpCtrl.prototype.SearchHood = function () {
                var topsearch = [];
                var search = this.WiService.eventSelected.BusinessName;
                var test = this._.forEach(this.WiService.places, function (n, key) {
                    if (n["BusinessName"].toLowerCase().indexOf(search.toLowerCase()) > -1)
                        topsearch.push(n);
                });
                this.WiService.toparea = this._.sample(topsearch, 10);
            };
            SetItUpCtrl.prototype.EventSelect = function (Event) {
                var _this = this;
                this.WiService.eventSelected = Event;
                this.WiService.GetLocation().then(function (response) {
                    _this.WiService.eventSelected.Address = response.results[0]['formatted_address'];
                });
            };
            SetItUpCtrl.prototype.CreateEvent = function () {
                var event = new NewEvent();
                event.LeaderInfo = this.WiService.userdictionary;
                event.Location = this.WiService.eventSelected;
                event.EventDate = this.WiService.eventUserList.DateOfEvent;
                event.WordfromLeader = this.WiService.wordTothePeople;
                console.log(event);
            };
            SetItUpCtrl.prototype.EventFreinds = function () {
                this.$state.go('eventfreinds');
            };
            SetItUpCtrl.$inject = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts", "$ionicPopover", "$cordovaGeolocation"];
            return SetItUpCtrl;
        })();
        HooGo.SetItUpCtrl = SetItUpCtrl;
        HooGo.app.controller("SetItUpCtrl", SetItUpCtrl);
        var EventList = (function () {
            function EventList() {
            }
            return EventList;
        })();
        HooGo.EventList = EventList;
        var NewEvent = (function () {
            function NewEvent() {
            }
            return NewEvent;
        })();
        HooGo.NewEvent = NewEvent;
    })(HooGo = WiGO.HooGo || (WiGO.HooGo = {}));
})(WiGO || (WiGO = {}));
//# sourceMappingURL=app.js.map