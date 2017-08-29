app.controller('custDetailsCtrl', function ($scope) {
    // Edit view on edit icon click
    $('.editCustDetails-icon').click(function () {
        $(this).parents('.collection-item').children('.view-mode').slideUp();
        $(this).parents('.collection-item').children('.edit-mode').slideDown();
    });

    $('.updateCustDetails-icon').click(function () {
        console.log('test');
        $(this).parents('.collection-item').children('.view-mode').slideDown();
        $(this).parents('.collection-item').children('.edit-mode').slideUp();
    });
});


// Customer Details
app.controller('customerDetails', function ($scope, $http) {
    var tpl = 'json/cd_edit.json';
    $http.get(tpl).then(function (response) {
        $scope.cDetails = response.data.data[0];
    });
});