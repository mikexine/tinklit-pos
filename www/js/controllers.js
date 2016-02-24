angular.module('app.controllers', [])

.controller('logInCtrl', function($scope, $state, $ionicPopup, $cordovaBarcodeScanner, $ionicAnalytics) {
    $scope.signIn = function(user) {
        if (typeof user !== "undefined") {
            window.localStorage['token'] = user.token;
            window.localStorage['client'] = user.client;
            $ionicAnalytics.track('User logged in');
           window.localStorage.setItem('loggedIn',true);
            $state.go('tinklItPOS', {}, {
            reload: true
        });
        } else {
        }
    };

    $scope.showPopup = function() {
        $ionicAnalytics.track('Showing Info Popup');
        var alertPopup = $ionicPopup.alert({
            title: 'Get your API Keys',
            template: 'Go to tinkl.it, then visit your shop page and click on "New Terminal". Generate a terminal with "APP role" and insert the keys in this app.'
        });

        alertPopup.then(function(res) {
        });
    };

  $scope.scanNow = function(user) {
        $ionicAnalytics.track('Scan Api Keys');
        $cordovaBarcodeScanner.scan().then(function(imageData) {
            var scannedKeys = imageData.text.split("%");
            $scope.user = {};
            $scope.user.client = scannedKeys[0];
            $scope.user.token = scannedKeys[1];
        }, function(error) {
        });
    };


})

.controller('tinklItPOSCtrl', function($scope, $http, $state, Data, moment, $ionicAnalytics) {
    $scope.Data = Data;

    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.statuscard = {};
        $scope.statuscard.status = "Checking Tinkl.it..."
        $http({
            method: 'GET',
            url: 'http://api-staging.tinkl.it/v1/status'
        }).success(function(data, status) {
            if (data.status === "ok") {
                $scope.statuscard.status = "everything is alright!";
                $scope.statuscard.time = moment(data.date).fromNow() + ".";
                $ionicAnalytics.track('POS Status OK');
            } else {
                $scope.statuscard.status = "Errors.."
            }

        });
        $http({
            method: 'GET',
            url: 'http://api-staging.tinkl.it/v1/rates',
            headers: {
                'Content-Type': 'application/json',
                'X-CLIENT-ID': window.localStorage['client'],
                'X-AUTH-TOKEN': window.localStorage['token']

            }
        }).success(function(data, status) {
            $scope.statuscard.rate = data.rate + " €.";
            $ionicAnalytics.track('POS Rate Loaded');
        });

    });

    $scope.pay = function(rawTransaction) {
        if (typeof rawTransaction !== "undefined") {
            $ionicAnalytics.track('Invoice Created', {
                price: rawTransaction.amount
            });
            $http({
                    method: 'POST',
                    url: 'http://api-staging.tinkl.it/v1/invoices',
                    data: {
                        price: rawTransaction.amount,
                        item_code: rawTransaction.description,
                        currency: 'EUR'
                    },
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CLIENT-ID': window.localStorage['client'],
                        'X-AUTH-TOKEN': window.localStorage['token']

                    }
                })
                .success(function(data, status) {

                    Data.btc_address = data.btc_address;
                    Data.btc_price = data.btc_price;
                    Data.expiration_time = data.expiration_time;
                    Data.item_code = data.item_code;
                    Data.rate = data.rate;
                    Data.url = data.url;
                    Data.guid = data.guid;
                                $state.go('paywall', {}, {
                reload: true
            });

                })
                .error(function(data, status) {
                });

        } else {
        }
    };


    $scope.getInvoices = function() {
        $state.go('invoices', {}, {
            reload: true
        });
    };

})

.controller('paywallCtrl', function($scope, $state, $http, Data, $timeout, $ionicPopup, $ionicAnalytics) {
    $scope.Data = Data;

    $ionicAnalytics.track('Entered Paywall');

    var setTimeout = function(scope, fn, delay) {
        var promise = $timeout(fn, delay);
        var deregister = scope.$on('$destroy', function() {
            $timeout.cancel(promise);
        });
        promise.then(deregister);
        var deregisterTwo = scope.$on('payed', function() {
            $timeout.cancel(promise);
        });
        promise.then(deregisterTwo);
    };

    var payPopup = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Payment received',
            template: 'Payment received! Nice!'
        });

        alertPopup.then(function(res) {
            $ionicAnalytics.track('Popup Payment Received');
        });
    };
    var tmp = true;
    update();

    function update() {
        if (tmp) {
            $http({
                method: 'GET',
                url: 'http://api-staging.tinkl.it/v1/invoices/' + Data.guid,
                headers: {
                    'Content-Type': 'application/json',
                    'X-CLIENT-ID': window.localStorage['client'],
                    'X-AUTH-TOKEN': window.localStorage['token']

                }
            }).success(function(data, status) {
                if (data.status === "payed" && tmp) {
                    tmp = false;
                    payPopup();

                    $scope.$broadcast('payed');

                }
            });
        } else {
            $scope.$broadcast('payed');
        };

        setTimeout($scope, update, 1000);
    }

    $scope.finish = function() {
        $state.go('tinklItPOS', {}, {
            reload: true
        });
    };
})

.controller('invoicesCtrl', function($scope, $state, $http, Data, $ionicAnalytics) {
    $scope.$on('$ionicView.beforeEnter', function() {
        $scope.invoices = JSON.parse(window.localStorage['invoices'] || '{}');

        $http({
            method: 'GET',
            url: 'http://api-staging.tinkl.it/v1/invoices',
            headers: {
                'Content-Type': 'application/json',
                'X-CLIENT-ID': window.localStorage['client'],
                'X-AUTH-TOKEN': window.localStorage['token']

            }
        }).success(function(data, status) {
            $scope.invoices = data.invoices;
                window.localStorage['invoices'] = JSON.stringify(data.invoices);

            $ionicAnalytics.track('Loaded invoices');
        });

    });
        $scope.goToPos = function() {
        $ionicAnalytics.track('Invoices -> Pos');
        $state.go('tinklItPOS', {}, {
            reload: true
        });
    };
})