
module WiGO.HooGo {

    export class WiService {

        ////Event////
        eventChoice: string;
        eventSelected: YelpPlaces;
        yelpLocations: Array<YelpPlaces> = new Array<YelpPlaces>();
        eventtype: string;
        eventUserList: EventList<Object> = new EventList<Object>();
        eventTimeConvert: Date;
        wordTothePeople: string;
        eventFreinds: Array<UserInfo> = new Array<UserInfo>();
        DaysOfWeek: Array<EventDates<Object>> = new Array<EventDates<Object>>();
        ///User Info////
        userdictionary: UserInfo = new UserInfo();
        userNameList: Array<string> = new Array<string>('');
        userSearch: YelpSearch<Object> = new YelpSearch<Object>();
        location: UserLocation;
        //Friends Info/////
        friendList: Array<UserInfo> = new Array<UserInfo>();
        friendGroups: Array<FreindGroup> = new Array<FreindGroup>();
        ///Area Info////
        places: Array<LocationList> = new Array<LocationList>();
        listHoods: string[];
        toparea: Object[];
        neighborhood: string;
        /////////////


        public localURL: string = "http://localhost:53978/api/HooGoin/";
        public HostedURL: string = "http://ec2-52-23-228-61.compute-1.amazonaws.com/WiGOAPI/api/HooGoin/";
        public GoogleMapsLocation: string = "http://maps.googleapis.com/maps/api/geocode/json?latlng=";
        public static $inject: string[] = ["$http", "$q"];


        constructor(private $http: angular.IHttpService, private $q: angular.IQService) { }

        ConfirmLogin(info: UserInfo) {

            return this.$http.post(this.HostedURL + 'userinfo', info).then(function (response) {
                return response;
            });


        }

        GetYelpSearch(usersearch: YelpSearch<Object>) {
            

            usersearch.searchterm = this.eventSelected.name;
            usersearch.city = "Boston";
            usersearch.state = "MA";

            console.log(usersearch);

            return this.$http.get(this.HostedURL + "yelpbusiness", { params: usersearch }).then(r => r.data);
        }

        GetPlaces() {

            return this.$http.get(this.HostedURL + "places").then(r => r.data);
        }

        GetUsers() {

            return this.$http.get(this.HostedURL +  "users").then(r => r.data);
        }

        CreateNewUser(info: UserInfo) {

            return this.$http.post(this.HostedURL +  'newUser', info).then(function (response) {
                return response;
            });
        }

        GetUserGroups(userid: number) {

            return this.$http.get(this.HostedURL + "usergroups?userid=" + userid).then(r => r.data);
        }

        //GetLocation() {

        //    var test = this.GoogleMapsLocation + this.eventSelected.Lat + "," + this.eventSelected.Long + "&sensor=true";

        //    return this.$http.get(test).then(r => r.data);

        //}

        getDistanceFromLatLonInKm(lat2: number, lon2: number): number {
            var lat1 = this.location.latitude;
            var lon1 = this.location.longitude;



            var deg2Rad = deg => {
                return deg * Math.PI / 180;
            }

            var r = 6371; // Radius of the earth in km
            var dLat = deg2Rad(lat2 - lat1);
            var dLon = deg2Rad(lon2 - lon1);
            var a =
                Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(deg2Rad(lat1)) * Math.cos(deg2Rad(lat2)) *
                Math.sin(dLon / 2) * Math.sin(dLon / 2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            var d = r * c; // Distance in km

            d = d * 0.621371;
            d = +d.toPrecision(3);
            return d;
        }
    }

    app.service("WiService", WiService);
}