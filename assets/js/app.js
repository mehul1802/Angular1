var app = angular.module("ofmapp", ["ngMessages", "ngRoute", "ngMaterial", "ngAnimate"]);

// Loading Bar 
app.controller('AppCtrl', function ($scope, $mdSidenav, $timeout) {
    $scope.determinateValue = 0;
    $scope.$on('$viewContentLoaded', function () {
        $scope.determinateValue = 100;
    });
    
});

// OFM Theme Config
app.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
            .primaryPalette('blue', {
                'default': 'A700'
            })
            .accentPalette('blue', {
                'default': 'A700'
            });
})

// UI-Routing
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: "dashboard.html"
            })
            .when("/login", {
                templateUrl: "login.html"
            })
            .when("/inventory", {
                templateUrl: "inventory.html"
            })
            .when("/orders", {
                templateUrl: "orders.html"
            })
            .when("/integrations", {
                templateUrl: "integrations.html"
            })
            .when("/customers", {
                templateUrl: "customers.html"
            })
            .when("/app-details", {
                templateUrl: "app-details.html",
                controller: 'appDetailsCtrl'
            })
            .when("/customer-details", {
                templateUrl: "customer-details.html",
                controller: 'custDetailsCtrl'
            });

    $routeProvider.otherwise({redirectTo: "/"});
});

// Load Header
app.directive('header', function ($mdSidenav) {
    return {
        restrict: 'A',
        replace: true,
        scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
        templateUrl: "directives/header.html",
        link: function($scope, $element, attrs) {
            $("#usermenu-dropdown").dropdown();
            $scope.toggleLeft = function (comID) {
                     $mdSidenav('mobileMenu').toggle();
                 };
        }
        /*controller: ['$scope', '$filter', '$mdSidenav', function ($scope, $filter,$mdSidenav) {
                $("#usermenu-dropdown").dropdown();
                 
                 // Mobile Menu
                 $scope.toggleLeft = function (comID) {
                     $mdSidenav('teleft').toggle();
                    console.log('testtes');
                 };
            }]*/
    }
});

// Load Sub Header
app.directive('subheader', function ($location, $compile, $rootScope, $http) {
    var path = $location.path();
    var screens = ['inventory', 'orders', 'integrations', 'customers'];

    var newPath = path.replace("/", "");
    var hasSubHeader = screens.lastIndexOf(newPath);
    var tempPath = "";

    if (hasSubHeader !== -1) {
        tempPath = "directives" + path + "/sub_header.tmpl.html";
    }

    return {
        restrict: 'A',
        replace: false,
        scope: {user: '='}, // This is one of the cool things :). Will be explained in post.
        templateUrl: tempPath,
        controller: ['$scope', '$filter', function ($scope, $filter) {
                // Your behaviour goes here :)
            }],
        link: function (scope, element, attrs) {
            $rootScope.$on('$locationChangeSuccess', function (event, url, oldUrl, state, oldState) {
                var hashurl = arguments[1].replace(/[^#]+(#.+)/, "$1");
                hashurl = hashurl.replace("#/", "");
                hasSubHeader = screens.lastIndexOf(hashurl);
                if (hasSubHeader !== -1) {
                    var tpl = "directives/" + hashurl + "/sub_header.tmpl.html";
                    $http.get(tpl).then(function (response) {
                        element.html($compile(response.data)(scope));
                    });
                } else {
                    element.html('');
                }
            });
        }

    }
    
});

// Change active link
app.directive('autoActive', ['$location', function ($location) {
        return {
            restrict: 'A',
            scope: false,
            link: function (scope, element) {
                function setActive() {
                    var path = $location.path();
                    if (path) {
                        angular.forEach(element.find('li'), function (li) {
                            var anchor = li.querySelector('a');
                            var newPath = path.replace("/", "");

                            if (anchor.href.match('/#' + newPath + '(?=\\?|$)')) {
                                angular.element(li).addClass('active');
                            } else if (newPath == '' && angular.element(li).hasClass('dashboard-link')) {
                                angular.element(li).addClass('active');
                            } else {
                                angular.element(li).removeClass('active');
                            }
                        });
                    }
                }

                setActive();

                scope.$on('$locationChangeSuccess', setActive);
            }
        }
    }]);

// Focus On search filter

app.directive('forceSelectFocus', function() {
  return {
    restrict: 'A',
    require: ['^^mdSelect', '^ngModel'],
    link: function(scope, element, controller) {
      scope.$watch(function () {
        var foundElement = element;
        while (!foundElement.hasClass('md-select-menu-container')) {
          foundElement = foundElement.parent();
        }
        return foundElement.hasClass('md-active');
      }, function (newVal) {
        if (newVal) {
         // console.log(controller[1]);
            element.focus();
        }
      })
    }
  }
});

app.run(function ($rootScope, $location, $route, $timeout) {

    $rootScope.config = {};
    $rootScope.config.app_url = $location.url();
    $rootScope.config.app_path = $location.path();
    $rootScope.layout = {};
    $rootScope.layout.loading = false;

    $rootScope.$on('$routeChangeStart', function () {
        //$("#ui-view").html("");
        //show loading
        $timeout(function () {
            $rootScope.layout.loading = true;
        });
    });
    $rootScope.$on('$routeChangeSuccess', function () {

        //hide loading
        $timeout(function () {
            $rootScope.layout.loading = false;
            $('.collapsible').collapsible({
                onOpen: function(el) { $('li.active .collapsible-body').attr("data-scroll","0"); },
                onClose: function(el) {             
                        $("li .product-card").removeClass('md-stick');
                        $("li .product-card").css('top','0');
                    
                }  
            });
        }, 200);
        $('#app-main').removeClass('wrap-active-sideNav');
    });
    $rootScope.$on('$routeChangeError', function () {

        //hide loading 
        $rootScope.layout.loading = false;

    });
});
