// Category Filter
app.controller('intCategory', function ($scope, $element) {
    $scope.cats = ['Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
    $scope.searchTerm;
    $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
    };
    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    $element.find('input').on('keydown', function (ev) {
        ev.stopPropagation();
    });
    $scope.autofocus = function (e){
    	console.log('etst');
    	  this.trigger('input');
        
    }
});

// Customer Filter
app.controller('intCustomer', function ($scope, $element) {
    $scope.customers = ['Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
    $scope.searchTerm;
    $scope.clearSearchTerm = function () {
        $scope.searchTerm = '';
    };
    // The md-select directive eats keydown events for some quick select
    // logic. Since we have a search input here, we don't need that logic.
    $element.find('input').on('keydown', function (ev) {
        ev.stopPropagation();
    });
});

// Integration Search
app.controller('intSearch', intSearch);

function intSearch($timeout, $q, $log) {
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
        var allStates = 'Shopify, Amazon, Woocomerce, Ebay, Ali Express';

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

// Active Apps List
app.controller('activeAppsList', function ($scope, $http) {
    var tpl = 'json/int_active_apps.json';
    $http.get(tpl).then(function (response) {
        $scope.activeApps = response.data.data;
    });
});
// Active Apps List
app.controller('inActiveAppsList', function ($scope, $http) {
    var tpl = 'json/int_app_store.json';
    $http.get(tpl).then(function (response) {
        $scope.inActiveApps = response.data.data;
    });
});
