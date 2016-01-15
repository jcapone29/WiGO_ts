
module WiGO.HooGo {


    export class WiHomeCtrl {

        showside: boolean = false;
        userdictionary: UserInfo = new UserInfo();
        userNameList: Array<string> = new Array<string>('');
        places: Array<LocationList<Object>> = new Array<LocationList<Object>>();
        listHoods: string[];
        toparea: Object[];
        signinloading: boolean = false;
        neighborhood: string;
        ////Event////
        eventChoice: string;
        eventSelected: LocationList<Object>;
        eventtype: string;
        eventUserList: EventList<Object> = new EventList<Object>();
        eventTimeConvert: Date;
        wordTothePeople: string;
        ////////////
        DaysOfWeek: Array<EventDates<Object>> = new Array<EventDates<Object>>();



        public static $inject: string[] = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts"];

        constructor(public $scope: any, public _: any, public $ionicSideMenuDelegate: any, public $state: any, public WiService: WiService, public $ionicModal: any, public $ionicSlideBoxDelegate: any, public $cordovaContacts: any) {

            this.showside = true;
            this.NewUserModalLoad();

        }


        LocalStorageCheck() {

            this.userdictionary.UserName = localStorage.getItem("WiGOUserName");
            this.userdictionary.Password = localStorage.getItem("WiGOUserPassword");
            
            if ( this.userdictionary.UserName == null || this.userdictionary.UserName == 'undefined' || this.userdictionary.Password == null || this.userdictionary.Password == 'undefined') {
                
                this.userdictionary.UserName = '';
                this.userdictionary.Password = '';
                this.$state.go('signin');
            }

            else {

                this.LogIn();
                
            }

        }


        LogIn() {

            this.signinloading = true;
            this.UserDataCache();


            this.WiService.ConfirmLogin(this.userdictionary).then((response: any) => {

                
                if (response.data.length > 0) {
                    
                    this.userdictionary = response.data[0];

                    this.signinloading = false;
                    this.showside = true;
                    this.$state.go('tabs.home');
                    this.AreaPlaces();
                    this.ListDates();

                }

                else {
                    alert('User Does not exist');
                    this.signinloading = false;
                }

            });


        }

        AreaPlaces() {

            this.WiService.GetPlaces().then((response: any) => {


                this.places = response;
                this.listHoods = this._.uniq(this._.pluck(this.places, 'Neighborhood'));

            });

        }

        UserDataCache() {

            localStorage.setItem("WiGOUserName", this.userdictionary.UserName);
            localStorage.setItem("WiGOUserPassword", this.userdictionary.Password);
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

            this.userNameList = new Array<string>('');

            this.WiService.GetUsers().then((response: any) => {

                for (var i = 0; i < response.length; i++) {

                    this.userNameList.push(response[i]['username']);
                }

                this.$scope.modal.show();
            });
        }

        CreateAccount() {

            this.signinloading = true;

            this.WiService.CreateNewUser(this.userdictionary).then((response: any) => {
                this.signinloading = false;
                this.$scope.modal.hide();
                this.showside = true;
                this.$state.go('tabs.home');
            });

        }

        SelectHood() {


            var area = this._.filter(this.places, "Neighborhood", this.eventSelected.Neighborhood);
            this.toparea = this._.sample(area, 3);


        }

        RandomizeHood() {

            if (this.eventSelected == undefined) {

                this.eventSelected = new LocationList();

                this.eventSelected.Neighborhood = this._.sample(this.listHoods);
            }

            else {
                this.eventSelected.Neighborhood = this._.sample(this.listHoods);
            }

            var area = this._.filter(this.places, "Neighborhood", this.eventSelected.Neighborhood);
            this.toparea = this._.sample(area, 3);
        }


        SearchHood() {

           

            var topsearch = [];
            var search = this.eventSelected.BusinessName;
            var test = this._.forEach(this.places, function (n, key) {
                if (n["BusinessName"].toLowerCase().indexOf(search.toLowerCase()) > -1)

                    topsearch.push(n);
                
            });

            this.toparea = this._.sample(topsearch, 3);

            
          
        }

        ListDates() {

            var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

            for (var i = 0; i < 7; i++) {
                var weekdates = new EventDates<Object>();
                var date = new Date();

                date.setDate(date.getDate() + i);

                var dayposition = date.getDay().toString();
                var day = days[dayposition];

                weekdates.Day = date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
                weekdates.DayOfWeek = day.toString();
                this.DaysOfWeek.push(weekdates);

            }

            this.eventUserList.DateOfEvent = this.DaysOfWeek[0].Day

        }

        EventSelect(Event: LocationList<Object>) {

            this.eventSelected = Event;
           
            this.WiService.GetLocation(this.eventSelected.Location).then((response: any) => {

                this.eventSelected.Address = response.results[0]['formatted_address'];

            });
        }


        CreateEvent() {

           

            var event = new NewEvent<Object>();
            event.LeaderInfo = this.userdictionary;
            event.Location = this.eventSelected;
            event.EventDate = this.eventUserList.DateOfEvent;
            event.WordfromLeader = this.wordTothePeople;

            console.log(event);
        }

        SignOut() {

            localStorage.clear();
            this.LocalStorageCheck();
        }

        SetitUp() {

            this.$state.go('setitup');
        }

    }

    app.controller("WiHomeCtrl", WiHomeCtrl);



    export class UserInfo {
        public UserName: string;
        public Password: string;
        public Firstname: string;
        public LastName: string;
        public Email: string;
        public Phone: string;
        public Active: boolean;
        public LastLogin: Date;

    }

    export class LocationList<Object> {
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
    }

    export class EventDates<Object> {

        public DayOfWeek: string;
        public Day: string;
    }

    export class NewEvent<Object> {

        public LeaderInfo: UserInfo;
        public Location: LocationList<Object>;
        public EventDate: string;
        public WordfromLeader: string;

    }

    export class EventList<Object>
    {
        public UserID: number;
        public EventName: string;
        public Location: string;
        public Long: string;
        public Lat: string;
        public Address: string;
        public Attending: boolean;
        public LeaderID: number;
        public DateOfEvent: string;
        public timeOfEvent: number;
        public Active: boolean;
    }
}