
module WiGO.HooGo {


    export class WiHomeCtrl {

        showside: boolean = false;
        signinloading: boolean = false;


        public static $inject: string[] = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts", "$ionicPopover", "$cordovaGeolocation"];

        constructor(public $scope: any, public _: any, public $ionicSideMenuDelegate: any, public $state: any, public WiService: WiService, public $ionicModal: any, public $ionicSlideBoxDelegate: any, public $cordovaContacts: any, public $ionicPopover: any, public $cordovaGeolocation: any) {

            this.showside = true;
            this.NewUserModalLoad();
            this.GetCurrentLocation();
           

        }


        LocalStorageCheck() {

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

        }


        LogIn() {

            this.signinloading = true;
            this.UserDataCache();


            this.WiService.ConfirmLogin(this.WiService.userdictionary).then((response: any) => {

                
                if (response.data.length > 0) {
                    
                    this.WiService.userdictionary = response.data[0];

                    this.signinloading = false;
                    this.showside = true;
                    this.$state.go('tabs.home');
                    this.AreaPlaces();
                    this.ListDates();
                    this.GetUserGroups();
                    
                }

                else {
                    alert('User Does not exist');
                    this.signinloading = false;
                }

            });


        }

        AreaPlaces() {

            this.WiService.GetPlaces().then((response: any) => {


                this.WiService.places = response;
                this.WiService.listHoods = this._.uniq(this._.pluck(this.WiService.places, 'Neighborhood'));
                
                this._.forEach(this.WiService.places, ((place: LocationList) => {

                    place.Distance = this.WiService.getDistanceFromLatLonInKm(place.Lat, place.Long);

                 
                }));

            });


            

        }

        GetUserGroups() {

            this.WiService.GetUserGroups(this.WiService.userdictionary.UserID).then((response: any) => {

             
                this.WiService.friendGroups = response;
            });
        }

        UserDataCache() {

            localStorage.setItem("WiGOUserName", this.WiService.userdictionary.UserName);
            localStorage.setItem("WiGOUserPassword", this.WiService.userdictionary.Password);
        }

        NewUserModalLoad() {

            this.$ionicModal.fromTemplateUrl('templates/newuser.html', (modal) => {
                this.$scope.modal = modal;
            }, {

                    scope: this.$scope,
                    animation: 'slide-in-up'
                });

        }


        NewUserForm() {

            this.WiService.userNameList = new Array<string>('');

            this.WiService.GetUsers().then((response: any) => {

                for (var i = 0; i < response.length; i++) {

                    this.WiService.userNameList.push(response[i]['username']);
                    this.WiService.friendList.push(response[i]);
                }

                this.$scope.modal.show();
            });
        }

        CreateAccount() {

            this.signinloading = true;

            this.WiService.CreateNewUser(this.WiService.userdictionary).then((response: any) => {
                this.signinloading = false;
                this.$scope.modal.hide();
                this.showside = true;
                this.$state.go('tabs.home');
            });

        }



        ListDates() {

            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];



            this.WiService.DaysOfWeek = new Array<EventDates<Object>>();

            for (var i = 0; i < 7; i++) {
                var weekdates = new EventDates<Object>();
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

        }



        SignOut() {

            localStorage.clear();
            this.LocalStorageCheck();
        }

        SetitUp() {

            this.$state.go('setitup');
            
        }




        GetCurrentLocation() {

            this.WiService.location = new UserLocation();

            this.$cordovaGeolocation.getCurrentPosition().then((position: any) => {

                this.WiService.location = position["coords"];
             
            });

        }

        
    }

    app.controller("WiHomeCtrl", WiHomeCtrl);



    export class UserInfo {
        public UserID: number;
        public UserName: string;
        public Password: string;
        public Firstname: string;
        public LastName: string;
        public Email: string;
        public Phone: string;
        public Active: boolean;
        public LastLogin: Date;

    }

    export class LocationList {
        public BusinessName: string;
        public DESCRIPT: string;
        public Neighborhood: string;
        public Address: string;
        public City: string;
        public State: string;
        public Zip: string;
        public LICCATDESC: string;
        public ENDTIME: string;
        public Location: string;
        public Long: number;
        public Lat: number;
        public Distance: number;
    }

    export class EventDates<Object> {

        public DayOfWeek: number;
        public MonthName: string;
        public Month: number;
        public Day: number;
        public Year: number;
    }




    export class FreindGroup
    {
        public UserID: number;
        public GroupID: number;
        public GroupName: string;
        public FriendUserID: number;
        public UserName: string;
        public Phone: number;
        public Email: string;
        public  WiGoUser: boolean;
        public GroupActive: boolean;
    }

    export class UserLocation {

        public accuracy: number
        public altitude: number
        public altitudeAccuracy: any;
        public heading: any;
        public latitude: number;
        public longitude: number;
    }
}