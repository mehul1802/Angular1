// Status Filter
app.controller('invStatus', function ($scope) {
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
// Category Filter
app.controller('invCategory', function ($scope, $element, $filter) {
    $scope.cats = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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

// Channel Filter
app.controller('invChannel', function ($scope, $element) {
    $scope.channels = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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

// Customer Filter
app.controller('invCustomer', function ($scope, $element) {
    $scope.customers = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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
// Autocomplete Search
app.controller('invSearch', invtSearch);
function invtSearch($timeout, $q, $log) {
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
        var allStates = 'Nokia Mobile, samsung TV, Onida AC';

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
// show Edit/View Mode
app.controller('showProductCard', function ($scope, $element, $timeout) {
    //This will hide the DIV by default.
    $scope.editProduct = false;
    $scope.viewProduct = false;
    var header = $('.header').height() + $('.subheader-wrap').height(); 
    $scope.showEditCard = function () {
        $scope.viewProduct = true;
        $scope.editProduct = true;
        var prod_view = $element.find('.int-product-view');
        var product_attr = prod_view.offset().top;
        $('.int-product-view').attr('data-myval', product_attr);
  
        $("li.active  .product-card").css('top','0');
        $('li.active .int-product-edit md-toolbar').css('width', 'inheirt');
        var sticky = $("li.active .activeBox .product-card").hasClass('md-stick');
        $('li.active .collapsible-body').attr("data-scroll","0");
       
        $timeout(function () {
           
            $('li.active .int-product-view').fadeOut("fast");
              $('li.active .int-product-view .product-card').removeClass('md-stick');
              $('li.active .collapsible-body .card').removeClass('activeBox');
         },5);
       
               
        $timeout(function () { 
             $('li.active .int-product-edit').css("display","block");
            $('li.active .int-product-edit').addClass('activeBox');
            $('li.active').data('sscroll', '0');
        	if(sticky){                  
                   var scroll_sticky = $("li.active .activeBox").offset().top;                  
                    $('#app-main').animate({
                                    scrollTop: (scroll_sticky - 128)},
                            'slow');
                    $('li.active .int-product-edit .product-card').addClass('md-stick');
                }
        },10);
        
    } 
    $scope.showViewCard = function () {
        $scope.editProduct = false;
        $scope.viewProduct = false;
        var sticky = $("li.active .activeBox .product-card").hasClass('md-stick');

        $('li.active .collapsible-body').attr("data-scroll","0");
        $timeout(function () {
            $('li.active .int-product-view').css("display","block");
            $('li.active .int-product-edit').fadeOut("fast");
            $('li.active .int-product-view').css("display","block");
            $('li.active .int-product-edit').fadeOut("fast");
            $('li.active .collapsible-body .card').removeClass('activeBox');
            $('li.active .int-product-view').addClass('activeBox');
            $('li.active').data('sscroll', '0');
            if(sticky){ 
            	$('#app-main').animate({
       				 scrollTop: -($("li.active .int-product-view").offset().top)},
       		  'slow');
       		  $('li.active .int-product-edit .product-card').removeClass('md-stick');
       		  $('li.active .int-product-view .product-card').addClass('md-stick');              
             }
        }, 10);
        
       
    }
    
});
// Close the tab using Product card toolbar
$('.md-toolbar-tools h2').on('click', function (e) {
    $(this).parents('.active').children('.collapsible-header').trigger('click');
});

/*
 * Edit Mode
 */

// Category Filter
app.controller('invEditCategory', function ($scope, $element) {
    $scope.cats = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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

// Channel Filter
app.controller('invEditProChannel', function ($timeout, $q) {
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

/*
 * New Product Mode
 */

// Category Filter
app.controller('invNewProCategory', function ($scope, $element) {
    $scope.cats = ['All', 'Amazon', 'Shopify', 'Flipkart', 'WooCommerce'];
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

// New Product Dialog/Modal
app.controller('invCtrl', function ($scope, $mdDialog, $timeout) {

    // Hide/Show Collapsible(accordion)
    $scope.invHideProduct = function (e) {
        var currElem = angular.element(e.target);

        if (!currElem.hasClass('material-icons')) {
            $timeout(function () {
                $('.stock-collection ul li.active').children('.collapsible-header').trigger('click');
            }, 10);
        }
    };

    $scope.invNewProduct = function (ev) {
        $scope.status = '  ';
        $scope.customFullscreen = true;

        $mdDialog.show({
            controller: DialogController,
            templateUrl: 'directives/inventory/new_product.tmpl.html',
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


// Out of Stock Products List
app.controller('oosProductList', function ($scope, $http) {
    var tpl = 'json/inv_oos.json';
    $http.get(tpl).then(function (response) {
        $scope.oosProducts = response.data.data;
    });
});

// Close to Minimum Products List
app.controller('ctmProductList', function ($scope, $http) {
    var tpl = 'json/inv_ctm.json';
    $http.get(tpl).then(function (response) {
        $scope.ctmProducts = response.data.data;
    });
});

// Active Products List
app.controller('activeProductList', function ($scope, $http) {
    var tpl = 'json/inv_active.json';
    $http.get(tpl).then(function (response) {
        $scope.activeProducts = response.data.data;
    });
});

// Shadow on slidenav content scroll
app.directive('invContentScroll', function ($location, $anchorScroll, $window) {
    return {
        restrict: 'A',
        link: function (scope, elem, attrs) {

            $(elem).on('scroll', function (evt) {
                // Get Header Height
                var headerHeight = $('.header').height();
                // Get Sub Header Height
                var subHeaderHeight = $('.subheader-wrap').height();
                // Get Offset of the active div
                var activeOffset = $('li.active .activeBox').offset().top - headerHeight - subHeaderHeight;
                // Get active box Height
                var activeBoxHeight = $('li.active .activeBox').height() - 80;

                var totoalHeaderHeight = headerHeight + subHeaderHeight;
  
                
                var activeBoxScrollVal = $('li.active .collapsible-body').attr("data-scroll");
                
                if (activeBoxScrollVal == 0) {  
                   
                    var activeBoxScroll = activeOffset + activeBoxHeight + document.getElementById('app-main').scrollTop;
                    $('li.active .collapsible-body').attr("data-scroll", activeBoxScroll);
                }
                activeBoxScroll =$('li.active .collapsible-body').attr("data-scroll");
                // Get Scroll Top of View
                var currentScroll = document.getElementById('app-main').scrollTop;
                var currentScrollOffset = $(".collapsible .active").offset();
               
               //console.log("test"+currentScroll);
              // console.log(activeBoxScroll);
              // console.log(activeOffset + activeBoxHeight);
                if (currentScroll > (activeBoxScroll - 80)) {
                    
                    var top = $('li.active .activeBox md-toolbar').css('top');
                    
                    top = top.replace('px', '');

                        //console.log(currentScroll + 80 - activeBoxScroll);
                        $('li.active .activeBox md-toolbar').css('top', ((headerHeight + subHeaderHeight) - (currentScroll + 80 - activeBoxScroll)) + 'px');
                    

                } else if ((totoalHeaderHeight > currentScrollOffset.top)) {

                    var tswidth = $('li.active .activeBox').width();

                    $('li.active .activeBox md-toolbar').addClass('md-stick');
                    $('li.active .activeBox md-toolbar').addClass('scroll-shadow');
                    $('li.active .activeBox md-toolbar').css('top', headerHeight + subHeaderHeight);
                    $('li.active .activeBox md-toolbar').css('width', tswidth + 'px');

                } else {
                    $('li.active .activeBox md-toolbar').removeClass('md-stick');
                    $('li.active .activeBox md-toolbar').removeClass('scroll-shadow');
                    $('li.active .activeBox md-toolbar').css('top', '0px');
                }

            });
        }

    }

});