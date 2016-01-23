module WiGO.HooGo {


    export class SetItUpCtrl {

        public static $inject: string[] = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts", "$ionicPopover", "$cordovaGeolocation"];


        constructor(public $scope: any, public _: any, public $ionicSideMenuDelegate: any, public $state: any, public WiService: WiService, public $ionicModal: any, public $ionicSlideBoxDelegate: any, public $cordovaContacts: any, public $ionicPopover: any, public $cordovaGeolocation: any) {

            
        }



        SelectHood() {

            var area = this._.filter(this.WiService.places, "Neighborhood", this.WiService.eventSelected.Neighborhood);
            this.WiService.toparea = this._.sample(area, 10);


        }

        RandomizeHood() {

            if (this.WiService.eventSelected == undefined) {

                this.WiService.eventSelected = new LocationList();

                this.WiService.eventSelected.Neighborhood = this._.sample(this.WiService.listHoods);
            }

            else {
                this.WiService.eventSelected.Neighborhood = this._.sample(this.WiService.listHoods);
            }

            var area = this._.filter(this.WiService.places, "Neighborhood", this.WiService.eventSelected.Neighborhood);
            this.WiService.toparea = this._.sample(area, 10);
        }


        SearchHood() {

            var topsearch = [];
            var search = this.WiService.eventSelected.BusinessName;
            var test = this._.forEach(this.WiService.places, function (n, key) {
                if (n["BusinessName"].toLowerCase().indexOf(search.toLowerCase()) > -1)

                    topsearch.push(n);

            });




            this.WiService.toparea = this._.sample(topsearch, 10);

        }

        EventSelect(Event: LocationList) {

            this.WiService.eventSelected = Event;

            this.WiService.GetLocation().then((response: any) => {

                this.WiService.eventSelected.Address = response.results[0]['formatted_address'];

            });
        }


        CreateEvent() {



            var event = new NewEvent<Object>();
            event.LeaderInfo = this.WiService.userdictionary;
            event.Location = this.WiService.eventSelected;
            event.EventDate = this.WiService.eventUserList.DateOfEvent;
            event.WordfromLeader = this.WiService.wordTothePeople;

            console.log(event);
        }


        EventFreinds() {
            
            this.$state.go('eventfreinds');
        }


    }

    app.controller("SetItUpCtrl", SetItUpCtrl);

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

    export class NewEvent<Object> {

        public LeaderInfo: UserInfo;
        public Location: LocationList;
        public EventDate: string;
        public WordfromLeader: string;

    }
}

