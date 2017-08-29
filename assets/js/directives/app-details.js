app.controller('appDetailsCtrl', function ($scope) {
    // Edit view on edit icon click
    $('.editAppDetails-icon').click(function () {
        $(this).parents('.collection-item').children('.view-mode').slideUp();
        $(this).parents('.collection-item').children('.edit-mode').slideDown();
    });

    $('.updateAppDetails-icon').click(function () {
        $(this).parents('.collection-item').children('.view-mode').slideDown();
        $(this).parents('.collection-item').children('.edit-mode').slideUp();
    });
});

// app Details
app.controller('appDetails', function ($scope, $http) {
    var tpl = 'json/ad_edit.json';
    $http.get(tpl).then(function (response) {
        $scope.app = response.data.data[0];
    });
});