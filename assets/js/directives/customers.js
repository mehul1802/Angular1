
// status filter
app.controller('customerStatus', function ($scope, $window) {
    $scope.items = ['All', 'Active', 'Inactive'];
    $scope.selectedItem;
    $scope.getSelectedText = function () {

        if ($scope.selectedItem !== undefined) {

            return  $scope.selectedItem;
        } else {
            return  $scope.selectedItem = 'All';
        }
    }
});

app.controller('custmerSearch', custSearch);

function custSearch($timeout, $q, $log) {
    var self = this;

    self.simulateQuery = false;
    self.isDisabled = false;

    // list of `state` value/display objects
    self.states = loadAll();
    self.querySearch = querySearch;
    self.selectedItemChange = selectedItemChange;
    self.searchTextChange = searchTextChange;

    self.newState = newState;

    function newState(state) {
        alert("Sorry! You'll need to create a Constitution for " + state + " first!");
    }

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for states... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        var results = query ? self.states.filter(createFilterFor(query)) : self.states,
                deferred;
        if (self.simulateQuery) {
            deferred = $q.defer();
            $timeout(function () {
                deferred.resolve(results);
            }, Math.random() * 1000, false);
            return deferred.promise;
        } else {
            return results;
        }
    }

    function searchTextChange(text) {
        $log.info('Text changed to ' + text);
    }

    function selectedItemChange(item) {
        $log.info('Item changed to ' + JSON.stringify(item));
    }

    /**
     * Build `states` list of key/value pairs
     */
    function loadAll() {
        var allStates = 'Ritesh, Ritz, Shneor, Ofer, James, Jonathan, Elize, Alize';

        return allStates.split(/, +/g).map(function (state) {
            return {
                value: state.toLowerCase(),
                display: state
            };
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }
}
app.filter('html',function($sce){
	
    return function(input){
    	return $sce.trustAsHtml(input);
    }
})
// Customers List
app.controller('customersList', function ($scope, $http,$sce) {
    var tpl = 'json/customersList.json';
    $http.get(tpl).then(function (response) {
        $scope.customers = response.data.data;
    });

});

// New Product Dialog/Modal
app.controller('custCtrl', function ($scope, $mdDialog) {
    $scope.custNewCustomer = function (ev) {
        $scope.status = '  ';
        $scope.customFullscreen = true;

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'directives/customers/create-customer.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })

    };
});


function DialogController($scope, $mdDialog) {
    $scope.hide = function () {
        $mdDialog.hide();
    };

    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}