module WiGO.HooGo {


    export class SetItUpCtrl {

        public static $inject: string[] = ["$scope", "_", "$ionicSideMenuDelegate", "$state", "WiService", "$ionicModal", "$ionicSlideBoxDelegate", "$cordovaContacts", "$ionicPopover", "$cordovaGeolocation"];


        constructor(public $scope: any, public _: any, public $ionicSideMenuDelegate: any, public $state: any, public WiService: WiService, public $ionicModal: any, public $ionicSlideBoxDelegate: any, public $cordovaContacts: any, public $ionicPopover: any, public $cordovaGeolocation: any) {

            
        }



        YelpBusiness() {
            this.WiService.GetYelpSearch(this.WiService.userSearch).then((response: any) => {

                this.WiService.yelpLocations = response;

                this._.forEach(this.WiService.yelpLocations, ((place: YelpPlaces) => {

                    place.distance = this.WiService.getDistanceFromLatLonInKm(place.location.coordinate["latitude"], place.location.coordinate["longitude"]);


                }));

            
            });

          
        }

        EventSelect(Event: YelpPlaces) {

            this.WiService.eventSelected = Event;

            //this.WiService.GetLocation().then((response: any) => {

            //    this.WiService.eventSelected.location.address = response.results[0]['formatted_address'];

            //});
        }


        CreateEvent() {



            var event = new NewEvent<Object>();
            event.LeaderInfo = this.WiService.userdictionary;
            event.Location = this.WiService.eventSelected;
            event.EventDate = this.WiService.eventUserList.DateOfEvent;
            event.WordfromLeader = this.WiService.wordTothePeople;

            
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
        public Location: YelpPlaces;
        public EventDate: string;
        public WordfromLeader: string;

    }

    export class YelpSearch<Object> {

        public searchterm: string;
        public state: string;
        public city: string;
        public latitude: any;
        public longitude: any;
    }

    export class YelpPlaces {
        public deals: any;
        public display_phone: string;
        public distance: number;
        public image_url: string;
        public is_closed: boolean;
        public location: YelpLocations;
        public mobile_url: string;
        public name: string;
        public phone: string;
        public rating: number;
        public rating_img_url: string;
        public rating_img_url_large: string;
        public rating_img_url_small: string;
        public review_count: number;
        public reviews: any;
        public snippet_image_url: string;
        public snippet_text: string;
        public url: string;

    }

    export class YelpLocations {

        public address: any;
        public city: string;
        public coordinate: any;
        public country_code: string;
        public cross_streets: string;
        public display_address: any;
        public geo_accuracy: number;
        public neighborhoods: any;
        public postal_code: string;
        public state_code: string;
    }
}

