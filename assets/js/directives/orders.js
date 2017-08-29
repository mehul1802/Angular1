// Status Filter
app.controller('orderStatus', function ($scope, $window) {
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

// Date Filter
app.controller('orderDate', function ($scope) {
    /* $scope.items = ['All', 'Active', 'Inactive'];
     $scope.selectedItem;*/
    $scope.getSelectedText = function (dateFilter) {

        if ($scope.dateFilter == 'custom') {
            //window.alert($scope.dateFilter)
            $('#custom-date').modal('open');
        }
    }
    //$scope.datefilter.splice(0,0,{ key: 'test', value:'test'});
});

// Channel Filter
app.controller('orderChannel', function ($scope, $element) {
    $scope.channels = ['Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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

// Order Search
app.controller('orderSearch', orderSearch);

function orderSearch($timeout, $q, $log) {
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

/*search filter for submit order card*/
app.controller('instantSearchCtrl', function ($scope, $http) {

    /**
     * Search - Slide Nav
     */
    var tpl = 'json/productSearchResult.json';
    $http.get(tpl).then(function (response) {
        $scope.allDataList = response.data.data;

        $scope.resetAll = function () {
            $scope.filteredList = $scope.allDataList;
            $scope.searchProduct = "";
        }
        $scope.search = function () {

            var orderBasicDetails = angular.element(document.querySelector('.submit-order-alldetail'));
            var customerDetails = angular.element(document.querySelector('.customer-detail'));
            var orderProducts = angular.element(document.querySelector('.ordered-items'));
            var orderTotalDetails = angular.element(document.querySelector('.order-total-detail'));


            orderBasicDetails.slideUp(400);
            orderProducts.hide();
            orderTotalDetails.hide();
            removeCardHeight();

            $('.order-product-search').addClass('active-search');
            $('.search-product').css('display', 'block');
            $('.submit-order-detail').stop().animate({scrollTop: 0}, '500', 'swing');

            $scope.filteredList = _.filter($scope.allDataList,
                    function (item) {
                        return searchUtil(item, $scope.searchProduct);
                    });

            if ($scope.searchProduct == '') {
                $scope.filteredList = $scope.allDataList;
            }
        }
        $scope.resetAll();
    });

    /* Search Text in all 3 fields */
    function searchUtil(item, toSearch)
    {
        /* Search Text in all 3 fields */
        return (item.title.toLowerCase().indexOf(toSearch.toLowerCase()) > -1) ? true : false;
    }

    /**
     * Move Search to top - Slide Nav
     */
    $scope.hideSearchResults = function () {

        var orderProducts = angular.element(document.querySelector('.ordered-items'));
        var orderTotalDetails = angular.element(document.querySelector('.order-total-detail'));
        var orderBasicDetails = angular.element(document.querySelector('.submit-order-alldetail'));

        orderBasicDetails.slideDown(400);
        orderProducts.show();
        orderTotalDetails.show();
        setCardHeight();
        $('.search-product').hide();
        $('.order-product-search').removeClass('active-search');
        $scope.resetAll();
    };
});
app.controller('orderProductSearch', function ($scope, $http) {
    var tpl = 'json/productSearchResult.json';
    $http.get(tpl).then(function (response) {
        $scope.searchDataList = response.data.data;
    });
});


/*search category filter for submit new order card*/
app.controller('searchcatfilter', function ($scope, $element) {
    $scope.categories = ['category', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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

/*search customer filter for submit new order card*/
app.controller('searchcustomerfilter', function ($scope, $element) {
    $scope.customers = ['customer', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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


app.controller('ordercardmove', function ($scope, $element, $compile, $mdToast, $routeParams, $http, $filter) {

    /* new order card move to packaging */
    $scope.showneworderToast = function (event) {
        var url = 'json/order_card_move.json';
        $http.get(url).then(function (response) {
            $scope.neworderdetail = angular.fromJson(response.data.data);
            $scope.moveordercard = $scope.neworderdetail.filter(function (item) {
                return item.id == event.currentTarget.id; // example with id 1, or routeParams.id
            });
        });
        var cardmovehtml = "directives/orders/newOrderMove.tmpl.html";
        $http.get(cardmovehtml).then(function (response) {
            var carddata = $compile(response.data)($scope);
            $(carddata).prependTo('.all-packaing-order');

            /*new order toast*/
            var toast = $mdToast.simple()
                    .textContent('Packaging Order Successfully')
                    .action('UNDO')
                    .hideDelay(2000)
                    .highlightAction(true)
                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                    .position('bottom left');

            $mdToast.show(toast).then(function (response) {
                if (response == 'ok') {
                    //alert('You clicked the \'UNDO\' action.');
                }
            });
        });
        $("#new-order-" + event.currentTarget.id).parent('.card-wrap').fadeOut('slow', function () {
            $("#new-order-" + event.currentTarget.id).parent('.card-wrap').remove();
            angular.element(document.querySelector("#package-order-" + event.currentTarget.id)).fadeIn(3000);

        });

    }

    /* Packaging order card move to dispatch */
    $scope.showpackageorderToast = function (event) {
        //alert(event.currentTarget.id);
        var url = 'json/order_card_move.json';
        $http.get(url).then(function (response) {
            $scope.newpackagingorderdetail = angular.fromJson(response.data.data);
            $scope.movepackagingordercard = $scope.newpackagingorderdetail.filter(function (item) {
                return item.id == event.currentTarget.id; // example with id 1, or routeParams.id
            });
        });
        var cardmovehtml = "directives/orders/newOrderMove.tmpl.html";
        $http.get(cardmovehtml).then(function (response) {
            var carddata = $compile(response.data)($scope);
            $(carddata).prependTo('.all-dispatch-order').show("slide", {direction: "right"}, 100);

            /*new order toast*/
            var toast = $mdToast.simple()
                    .textContent('Dispatch Order Successfully')
                    .action('UNDO')
                    .hideDelay(2000)
                    .highlightAction(true)
                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                    .position('bottom left');

            $mdToast.show(toast).then(function (response) {
                if (response == 'ok') {
                    //alert('You clicked the \'UNDO\' action.');
                }
            });
        });
        $("#package-order-" + event.currentTarget.id).parent('.card-wrap').fadeOut('slow', function () {
            $("#package-order-" + event.currentTarget.id).parent('.card-wrap').remove();
            angular.element(document.querySelector("#dispatch-order-" + event.currentTarget.id)).fadeIn(3000);
        });
    }

    /* Dispatch order card Toast */
    $scope.showtrackToast = function (event) {
        /*new order toast*/
        var toast = $mdToast.simple()
                .textContent('Dispatch Order Successfully')
                .action('UNDO')
                .hideDelay(2000)
                .highlightAction(true)
                .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                .position('bottom left');

        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                //alert('You clicked the \'UNDO\' action.');
            }
        });
    }

    /* Out Of stock Toast */
    $scope.showoutofstockToast = function (event) {
        /*new order toast*/
        var toast = $mdToast.simple()
                .textContent('Out Of Stock Order Successfully')
                .action('UNDO')
                .hideDelay(2000)
                .highlightAction(true)
                .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                .position('bottom left');

        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                //alert('You clicked the \'UNDO\' action.');
            }
        });
    }

    /*Submit Order Toast */
    $scope.showActionToast = function (event) {
        /*new order toast*/
        var toast = $mdToast.simple()
                .textContent('Submit Order Successfully')
                .action('UNDO')
                .hideDelay(2000)
                .highlightAction(true)
                .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                .position('bottom left');

        $mdToast.show(toast).then(function (response) {
            if (response == 'ok') {
                //alert('You clicked the \'UNDO\' action.');
            }
        });
    }
});

app.controller('ordersCtrl', function ($scope, $element, $compile, $mdToast, $timeout, $window, $compile) {

    var windowsize = $(window).width();
    if (windowsize <= 480) {
        $timeout(function (e) {

            var wrap = jQuery('.slides_wrap'),
                    slides = wrap.find('.img_slide'),
                    active = slides.filter('.active'),
                    i = slides.index(active),
                    width = wrap.width();

            slides

                    .on('swipeleft', function (e) {
                        if (i === slides.length - 1) {
                            return;
                        }
                        slides.eq(i + 1).trigger('activate');
                    })

                    .on('swiperight', function (e) {
                        if (i === 0) {
                            return;
                        }
                        slides.eq(i - 1).trigger('activate');
                    })

                    .on('activate', function (e) {

                        slides.eq(i).removeClass('active');
                        jQuery(e.target).addClass('active');

                        // Update the active slide index
                        i = slides.index(e.target);

                    })

        }, 200);
    }

});

app.directive('orderSideNav', function ($compile, $http, $mdSidenav, $window, $timeout, $mdToast) {
    return {
        restrict: 'A',
        replace: false,
        templateUrl: "directives/orders/sidenav_default.tmpl.html",
        controller: ['$scope', '$filter', function ($scope, $filter) {
                // Your behaviour goes here :)

            }],
        link: function (scope, element, attrs) {
            scope.openSlideNav = function (e) {
                var componentid = e.currentTarget.getAttribute("data-id");

                // remove all active class
                angular.element(document.querySelector('.card-active')).removeClass('card-active');

                // add active class to current card
                angular.element(e.currentTarget).addClass('card-active');

                var sideNavState = $mdSidenav('csidenav').isOpen();
                var tpl = "directives/orders/" + componentid + ".tmpl.html";
                var activeSideNav = "";
                if (sideNavState) {
                    activeSideNav = "active-sidenav";
                }
                var start_tag = '<md-sidenav class="common-sidenav md-sidenav-right ' + activeSideNav + '" md-component-id="csidenav" md-disable-backdrop md-whiteframe="6" id="sidenav" ng-cloak>';
                var end_tag = '</md-sidenav>';

                $http.get(tpl).then(function (response) {

                    element.html($compile(start_tag + response.data + end_tag)(scope));

                    if (sideNavState == false) {
                        $timeout(function () {
                            // Move Add Button to left
                            var sidenav_width = $('.md-sidenav-right').width();
                            $('.ordercard-open').css('right', sidenav_width + 30 + 'px');
                            // Open Slide Nav
                            $mdSidenav('csidenav').open();
                            //wrap Order Main div
                            $('.orders-main').addClass('active-sideNav');
                            $('#app-main').addClass('wrap-active-sideNav');
                            // Set height of slide Nav content
                            setCardHeight();
                            // enable accordion in the search
                            $('.all-product').collapsible();

                        }, 50);
                    } else {
                        $mdSidenav('csidenav').open();

                        // Set height of slide Nav content
                        setCardHeight();
                        // enable accordion in the search
                        $('.all-product').collapsible();
                    }
                });
            }
            scope.closeSlideNav = function (e) {
                // Close Slide Nav
                $mdSidenav('csidenav').close();
                //wrap Order Main div
                $('.orders-main').removeClass('active-sideNav');
                $('#app-main').removeClass('wrap-active-sideNav');
                // Move Add Button to right
                $('.ordercard-open').css('right', '30px');
            }

            angular.element($window).bind('resize', function () {
                setCardHeight();
            });


        }
    }
});

/* card height dynamic*/
function setCardHeight() {

    var winheight = $(window).height();
    var headerheight = $('.header').height();
    var toolbar = $('#new-order').height();
    var sidefooter = $('.order-total-detail').height();
    var contentheight = winheight - headerheight - headerheight - 175;
    var newcontentheight = winheight - headerheight - headerheight - 117;
    var searchardheight = winheight - headerheight - headerheight - 80 - 55;

    $('.new-order-content').css('height', newcontentheight);
    $('.submit-order-detail').css('height', newcontentheight);
    $('.dispatch-order-content').css('height', contentheight);
    $('.outofstock-order-content').css('height', contentheight);
    $('.packaging-order-content').css('height', contentheight);
    $('.all-product').css('height', searchardheight);
    
    setTimeout(function(){ 
        $('.common-sidenav .card .card-content > div:first').css('overflow-y', 'scroll');
    }, 300);

}
function removeCardHeight() {
    $('.submit-order-detail').css('height', 'auto');
}
// ******************************
// New Order Slide Nav
// ******************************


// Channel Filter
app.controller('newOrderChannelFilter', function ($timeout, $q) {
    var self = this;

    self.readonly = false;
    self.selectedItem = null;
    self.searchText = null;
    self.querySearch = querySearch;
    self.channels = loadChannels();
    self.selectedChannels = [];
    self.numberChips = [];
    self.numberChips2 = [];
    self.numberBuffer = '';
    self.autocompleteDemoRequireMatch = true;
    self.filterSelected = true;
    self.transformChip = transformChip;

    /**
     * Return the proper object when the append is called.
     */
    function transformChip(chip) {
        // If it is an object, it's already a known chip
        if (angular.isObject(chip)) {
            return chip;
        }

        // Otherwise, create a new one
        return {name: chip, type: 'new'}
    }

    /**
     * Search for vegetables.
     */
    function querySearch(query) {
        var results = query ? self.channels.filter(createFilterFor(query)) : [];
        return results;
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(channel) {
            return (channel._lowername.indexOf(lowercaseQuery) === 0) ||
                    (channel._lowertype.indexOf(lowercaseQuery) === 0);
        };

    }

    function loadChannels() {
        var channels = [
            {
                'name': 'Amazon',
                'type': 'amazon'
            },
            {
                'name': 'Ebay',
                'type': 'ebay'
            },
            {
                'name': 'Shopify',
                'type': 'shopify'
            },
            {
                'name': 'WooCommerce',
                'type': 'woocommerce'
            },
            {
                'name': 'Magento',
                'type': 'magento'
            }
        ];

        return channels.map(function (channel) {
            channel._lowername = channel.name.toLowerCase();
            channel._lowertype = channel.type.toLowerCase();
            return channel;
        });
    }
});


// New Order Channel Filter
//app.directive("newOrderChannelFilter12", function () {
//    return {
//        restrict: "A",
//        replace: false,
//        templateUrl: "directives/orders/newOrderChannelFilter.html",
//        controller: function ($scope, $element) {
//            $scope.channels = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
//            $scope.searchTerm;
//            $scope.clearSearchTerm = function () {
//                $scope.searchTerm = '';
//            };
//            // The md-select directive eats keydown events for some quick select
//            // logic. Since we have a search input here, we don't need that logic.
//            $element.find('input').on('keydown', function (ev) {
//                ev.stopPropagation();
//
//            })
//        }
//    }
//});

// New Order Search Category Filter
app.directive("newOrderCategoryFilter", function () {
    return {
        restrict: "A",
        replace: false,
        templateUrl: "directives/orders/newOrderCategoryFilter.html",
        controller: function ($scope, $element) {
            $scope.cardcategories = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
            $scope.searchTerm;
            $scope.clearSearchTerm = function () {
                $scope.searchTerm = '';
            };

            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input').on('keydown', function (ev) {
                ev.stopPropagation();
            })
        }
    }
});

// Shadow on slidenav content scroll
app.directive('contentScroll', function ($location, $anchorScroll, $window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
            $(elem).on('scroll', function (evt) {
                if (elem.scrollTop() > 10) {
                    $('.common-sidenav md-toolbar').addClass('scroll-shadow');
                } else {
                    $('.common-sidenav md-toolbar').removeClass('scroll-shadow');
                }
                if (this.scrollHeight - this.clientHeight - elem.scrollTop() < 20) {
                    $('.order-total-detail').addClass('remove-scroll-shadow');
                } else {
                    $('.order-total-detail').removeClass('remove-scroll-shadow');
                }
            });

        }

    }

});

// New Order Search Customer Filter
app.directive("newOrderCustomerFilter", function () {
    return {
        restrict: "A",
        replace: false,
        templateUrl: "directives/orders/newOrderCustomerFilter.html",
        controller: function ($scope, $element) {
            $scope.customers = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
            $scope.searchTerm;
            $scope.clearSearchTerm = function () {
                $scope.searchTerm = '';
            };
            // The md-select directive eats keydown events for some quick select
            // logic. Since we have a search input here, we don't need that logic.
            $element.find('input').on('keydown', function (ev) {
                ev.stopPropagation();
            })
        }
    }
});

// ******************************
// Data Load for Orders
// ******************************

// New Orders List
app.controller('newOrdersList', function ($scope, $http) {
    var tpl = 'json/orders_new.json';
    $http.get(tpl).then(function (response) {
        $scope.newOrders = response.data.data;
    });
});

// Packaging Orders List
app.controller('packagingOrdersList', function ($scope, $http) {
    var tpl = 'json/orders_packaging.json';
    $http.get(tpl).then(function (response) {
        $scope.packagingOrders = response.data.data;
    });
});

// Dispatch Orders List
app.controller('dispatchOrdersList', function ($scope, $http) {
    var tpl = 'json/orders_dispatch.json';
    $http.get(tpl).then(function (response) {
        $scope.dispatchOrders = response.data.data;
    });
});

// Out of Stock Orders List
app.controller('oosOrdersList', function ($scope, $http) {
    var tpl = 'json/orders_oos.json';
    $http.get(tpl).then(function (response) {
        $scope.ossOrders = response.data.data;
    });
});

// Return Orders List
app.controller('returnOrdersList', function ($scope, $http) {
    var tpl = 'json/orders_return.json';
    $http.get(tpl).then(function (response) {
        $scope.returnOrders = response.data.data;
    });
});


