/**
 * Created by thuannt on 8/9/15.
 */
hcApp = angular.module("hcApp",['ngRoute']);



hcApp.config(['$httpProvider','$routeProvider',function($httpProvider,$routeProvider) {
    //console.debug("config");
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    //$httpProvider.defaults.headers.post['Access-Control-Allow-Origin'] = "*";
    $httpProvider.defaults.transformRequest = [function (obj) {
        var str = [];
        for (var p in obj)
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        return str.join("&");
    }];

    $routeProvider.
        when('/', {
            templateUrl: 'app/templates/public/listing.html',
            controller: 'ListingCtrl'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

hcApp.run(["$http","$rootScope",function($http, $rootScope){
    $rootScope.ready = true;
   console.log('run');
}]);