options = {};
// fill apikey and token
PARAMS = {
    API_KEY :   "",
    TOKEN   :   ""
};
hcApp.service('ListingService', ["$rootScope","$http","$q",function ($rootScope,$http,$q) {
    function prepareParam(params){
        for(key in PARAMS){
            params[key] = PARAMS[key]
        }
        return params;
    };
    function callApi(url,params){
        var deferred = $q.defer();
        var data = prepareParam(params);
        $http.post(url, data, options)
            .success(function (data, status, headers, config) {
                // this callback will be called asynchronously
                // when the response is available
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
                deferred.reject(data);
            });
        return deferred.promise;
    }
    this.getAllListing = function(params){
        return callApi('http://api.homecaravan.local/listing_api/index',params);
    }
}]);
