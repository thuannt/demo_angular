/**
 * Created by thuannt on 8/9/15.
 */
hcApp.controller('ListingCtrl',["$scope", "$rootScope", "$location", "ListingService",function($scope, $rootScope, $location, ListingService){
    $rootScope.ready = false;
    var response = ListingService.getAllListing({

    });
    response.then(function(response){
        $rootScope.ready = true;
        $scope.listings = response.data.listings;
    });
}]);
