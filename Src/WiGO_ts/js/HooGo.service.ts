
module WiGO.HooGo {

    export class WiService {

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

        GetLocation(location: string) {

            location = location.replace('(', '');
            location = location.replace(')', '');

            var test = this.GoogleMapsLocation + location + "&sensor=true";

            return this.$http.get(test).then(r => r.data);

        }

    }

    app.service("WiService", WiService);
}