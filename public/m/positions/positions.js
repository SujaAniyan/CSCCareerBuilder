
angular.module('positions', ['ngRoute','ngMaterial','angular-growl', 'ngFileUpload', '720kb.datepicker', 'ngDraggable', 'ngAnimate', 'angular.filter'])

.run(function ($rootScope, $location, $http) {
	$http.get('/token')
		.success(function (user, status) {
		if (user) {
			$rootScope.user = user;
		}
    else {
			// user not found, ask to login
    }
	});
})

.config(['$routeProvider', function ($routeProvider) {
  $routeProvider
  
  .when('/positions', {
        templateUrl: '/public/m/positions/tile.html',
        controller: 'positionsCtrl'
  })
  
   .when('/positions/:id/candidates', {
        templateUrl: '/public/m/positions/candidates.html',
        controller: 'positionCtrl'
  })
  
  .when('/createpos', {
        templateUrl: '/public/m/positions/createPositions.html',
        controller: 'positionsCtrl'
  })

  .when('/positions/:id/edit', {
        templateUrl: '/public/m/positions/createPositions.html',
        controller: 'positionsCtrl'
  })
  
  .when('/positions/:id/:candidateId/feedback', {
        templateUrl: '/public/m/positions/feedbackTemplate.html',
        controller: 'positionFeedbackCtrl'
  })

   .when('/positions/panel', {
        templateUrl: '/public/m/positions/openPositions.html',
        controller: 'positionsCtrl'
  }) 
  
   .when('/feedbackTmpl/list', {
        templateUrl: '/public/m/positions/feedbackViewMain.html',
        controller: 'feedbackController'
    })

   .when('/feedbackTmpl/attach/:id', {
        templateUrl: '/public/m/positions/attachTemplate.html',
        controller: 'feedbackController'
    })

    .when('/feedbackTmpl/add', {
        templateUrl: '/public/m/positions/feedbackViewAdd.html',
        controller: 'feedbackController'
    })

    .when('/feedbackTmpl/:id/edit', {
        templateUrl: '/public/m/positions/feedbackViewAdd.html',
        controller: 'feedbackController'
    })

    .when('/feedbackTmpl/panels', {
        templateUrl: '/public/m/positions/partials/feedbackViewPanels.html',
        controller: 'feedbackController'
    })

    .when('/chat', {
        templateUrl: '/public/m/chat/index.html',
        controller: 'chatCtrl'
    })
  
   .when('/chart', {
        templateUrl:'/public/m/chart/barChart.html'
    })
  
   .when('/changeTheme', {
        templateUrl: '/public/m/positions/changeTheme.html',
        controller: 'positionsCtrl'
    })

    .when('/positions/tables', {
        templateUrl: '/public/m/positions/grid.html',
        controller: 'positionsCtrl'
    }) 

    .when('/positions/:id/addCandi', {
        templateUrl: '/public/m/positions/addCandidates.html',
        controller: 'positionCtrl'
    });
  
  // if none of the above states are matched, use this as the fallback
  $routeProvider.otherwise('/positions');

}]);