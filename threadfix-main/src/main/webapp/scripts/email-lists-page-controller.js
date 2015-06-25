var module = angular.module('threadfix')

module.controller('EmailListsPageController', function($scope, $http, $modal, $log, tfEncoder){

    var nameCompare = function(a,b) {
        return a.name.localeCompare(b.name);
    };

    $scope.$on('rootScopeInitialized', function() {
        $http.get(tfEncoder.encode('/configuration/emailLists/map')).
            success(function(data) {
                if (data.success) {
                    if (data.object.emailLists.length > 0) {
                        $scope.emailLists = data.object.emailLists;
                        $scope.emailLists.sort(nameCompare);
                    }
                } else {
                    $scope.errorMessage = "Failure. Message was : " + data.message;
                }
                $scope.initialized = true;
            }).
            error(function(data, status, headers, config) {
                $scope.initialized = true;
                $scope.errorMessage = "Failed to retrieve email list. HTTP status was " + status;
            });
    });

    $scope.openNewModal = function() {
        var modalInstance = $modal.open({
            templateUrl: 'createEmailListModal.html',
            controller: 'ModalControllerWithConfig',
            resolve: {
                url: function() {
                    return tfEncoder.encode("/configuration/emailLists/new");
                },
                object: function () {
                    return {};
                },
                config: function() {
                    return {};
                },
                buttonText: function() {
                    return "Create Email List";
                }
            }
        });

        $scope.currentModal = modalInstance;
        modalInstance.result.then(function (emailList) {
            if (!$scope.emailLists) {
                $scope.emailLists = [ emailList ];
            } else {
                $scope.emailLists.push(emailList);
                $scope.emailLists.sort(nameCompare);
            }

            $scope.successMessage = "Successfully created email list " + emailList.name;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };


});