angular.module('positions')

/*.controller('positionsCtrl', function($scope, $routeParams, $http) {
	console.log("All positions controller running");
	$http.get('/api/v1/secure/positions',{
		cache: true
	}).success(function(response) {
		console.log(response);
		$scope.positionList = response;
		//console.log($scope.visitBunches);
	});
})*/

.controller('positionsCtrl', ['$scope', '$routeParams', '$http', '$location','$timeout','toaster', function($scope, $routeParams, $http, $location, $timeout, toaster){

	console.log("All positions controller running");
	 var id = $routeParams.id;

	 // AUtomatically swap between the edit and new mode to reuse the same frontend form
	 $scope.mode=(id==null? 'add': 'edit');

	$http.get('/api/v1/secure/positions',{
		cache: true
	}).success(function(response) {
		console.log(response);
		$scope.positionList = response;
		//console.log($scope.visitBunches);
	});


	var refresh = function() {
    $http.get('/api/v1/secure/positions').success(function(response) {
	      $scope.positionList = response;
	      $scope.jobPos = "";
	      switch($scope.mode)    {
	        case "add":
	        	$scope.jobPos = "";
	        break;
	        case "edit":
		        $scope.jobPos = $http.get('/api/v1/secure/positions/' + id).success(function(response){
		          $scope.jobPos = response;
		        });
	      } // switch scope.mode ends
	    }); // get Job position call back ends
	  }; // refresh method ends

	  refresh();

	$scope.save = function(){
	    switch($scope.mode)    {
	      case "add":
	      $scope.create();
	      break;

	      case "edit":
	      $scope.update();
	      break;
	      } // end of switch scope.mode ends

	      //$location.path("/job/list");
	  } // end of save method

	$scope.create = function() {
	    $scope.jobPos.status= "active";
	    $http.post('/api/v1/secure/positions', $scope.jobPos).success(function(response) {
	     toaster.pop({body:"Job Position Added successfully."});
  			$timeout(callSubmit,5000);
            $location.path("/positions");
            refresh();

	    })
	    .error(function(data, status){
	    	console.log('error submitting query '+data+' status '+status);
	    }); 
	  }; // create method ends

	  $scope.update = function() {
	    $http.put('/api/v1/secure/positions/' + $scope.jobPos._id, $scope.jobPos).success(function(response) {
	      toaster.pop({body:"Job Position updated successfully."});
  		  $location.path("/positions");
          refresh();

	    })
	    .error(function(data, status){});
	  }; // update method ends

	  $scope.delete = function(jobPosId) {
	  	console.log('m in delete funct '+jobPosId);
	    $http.delete('/api/v1/secure/positions/' + jobPosId).success(function(response) {
	      refresh();
	      toaster.pop({body:"Job Position deleted successfully."});
  					$timeout(callSubmit,5000);
	    })
	    .error(function(data, status){});
	  }; // delete method ends

    
     $scope.cancel = function() {
        $scope.jobPos="";
        $location.path("/positions");
      };//cancel method ends

	  function callSubmit() {
	    window.history.back();
	}
 }]) 

.controller('positionCtrl', function($scope, $routeParams, $http) {
    console.log($routeParams.id);
	$http.get('/api/v1/secure/positions/'+$routeParams.id+'/candidates',{
		cache: true
	}).success(function(response) {
		$scope.candidateList = response;
        $scope.positionId=$routeParams.id;
	})
    
})

.controller('positionFeedbackCtrlssss', function($scope, $routeParams, $http) { 
    console.log($routeParams.id);
	$http.get('/api/v1/secure/positions/'+$routeParams.id+'/feedback',{
		cache: true
	}).success(function(response) {
		console.log("hreeeeeeeee" + response);
		$scope.feedbackList = response;
	})
    
})

.controller('positionFeedbackCtrl', function($scope, $timeout, $interval, $filter, $location, $routeParams, $http, $rootScope) {
    $scope.order = 0;
    $scope.counter = 0;
    console.log($rootScope.user._id);
    $scope.showSaveNext = true;
    $scope.form_id = "form-" +  $scope.order;
    $scope.candidateId = $routeParams.candidateId;
    $http.get('/api/v1/secure/positions/'+$routeParams.id+ '/' + $routeParams.candidateId + '/feedback',{
        cache: true
    }).success(function(response) {
        console.log("MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        $scope.overallFeedbackTmpl = response;
        $scope.positionId = $routeParams.id;
        $scope.feedbackId = $scope.overallFeedbackTmpl.id;
        console.log ( "$scope.feedbackId = " + $scope.feedbackId);
   
        /*for (var i = 0; i < response.visits.overallfeedback.length; i++) {
            // console.log(response.visits.overallfeedback[i].id+"-"+$rootScope.user._id);
            if(response.visits.overallfeedback[i].id=== $rootScope.user._id)
            {
               if (response.visits.overallfeedback[i].feedbackElg == "true") {
                    $scope.finalFeedback=true;
                } 
            }
        };*/
        $http.get('/api/v1/secure/feedbackDefs/id/'+ $scope.feedbackId).success(function(response) {
            $scope.items = response.item;
            $scope.length = response.item.length - 1;
            $scope.feedbackModel = response;
            $scope.max = $scope.length + 1;
          
            
            console.log("feedbackId= " +  $scope.feedbackId );
            console.log("$scope.positionId = " + $scope.positionId);
            console.log("$scope.candidateId = " + $scope.candidateId);
        });

    });

    $scope.orderIncrement = function()
    {   

        $scope.order = $scope.order + 1;
        // console.log($scope.order,$scope.length);
        if($scope.order == $scope.length)
        {
            $scope.showSaveNext = false;
            // $scope.order = 0;
        }

        if($scope.order < $scope.length)
        {
            $scope.showSaveNext = true;
        }
    }

    $scope.orderDecrement = function()
    {   
        if($scope.order == 0)
        {
            $scope.order =0;
            // $scope.order = 0;
        }
        else
        {
            $scope.order = $scope.order - 1;
            $scope.showSaveNext = true;
        }
        // if($scope.order < $scope.length)
        // {
        //     $scope.showSaveNext = true;
        // }
    }

    var form_div = angular.element('.form-div');
    var max_forms = form_div.length;

    $interval(function() {
        if (angular.element('.form-div').first().hasClass('active')) {
            angular.element('.prev-button').addClass('disabled');
        } else {
            angular.element('.prev-button').removeClass('disabled');
        }
        if (angular.element('.form-div').last().hasClass('active')) {
            angular.element('.save-exit-button').show();
            angular.element('.save-next-button').hide();
        } else {
            angular.element('.save-exit-button').hide();
            angular.element('.save-next-button').show();
        }
    }, 1);

    $scope.progress_percentage = 100 / max_forms;
    angular.element('.progress-bar').css('width', $scope.progress_percentage + "%");
    var count = 1;

    var device_width,
    corousel_inner_width,
    minusWidth;

    changeWidth();

    $(window).resize(function() {
        changeWidth();
    });

    function changeWidth() {
        device_width = angular.element(document).width();
        minusWidth = "-" + device_width;
        corousel_inner_width = device_width * max_forms;
        angular.element('.corousel-inner').css('width', corousel_inner_width + "px");
        form_div.css('width', device_width - 20 + "px");
    }

    function deleteData() {
        delete $scope.feedbackModel._id;
        delete $scope.feedbackModel.createBy;
        delete $scope.feedbackModel.title;
        delete $scope.feedbackModel.createOn;
    }

    $scope.next = function(order) {
        deleteData();
        var providedById = $rootScope.user._id;
        $scope.feedbackModel.positionId = $scope.positionId;
        $scope.feedbackModel.template = $scope.overallFeedbackTmpl;
        $scope.feedbackModel.candidateId = $scope.candidateId;
        $scope.feedbackModel.interviewerid = providedById;
        $scope.feedbackModel.item[$scope.order].answer = $scope.items[$scope.order].answer;
        $scope.feedbackModel.item[$scope.order].providedBy =  providedById;
            // console.log($scope.feedbackModel);
            
            $http.put('/api/v1/secure/feedbacks/'+ $scope.overallFeedbackTmpl , $scope.feedbackModel,{
                cache: true
            }).success(function(response) {
              // console.log(response);
          })    
            $scope.counter++;


            $scope.orderIncrement();


            // if (!(angular.element('.form-div').last().hasClass('active'))) {
            //     var cur_active = angular.element('.form-div.active');
            //     count++;
            //     cur_active.next().addClass('active');
            //     angular.element(".corousel-inner").css("transform", "translateX(" + (count - 1) * minusWidth + "px)");
            //     cur_active.removeClass('active');
            //     angular.element('.progress-bar').css('width', count * $scope.progress_percentage + "%");
            // }
        };

        $scope.prev = function(order) {
            /*if (!(angular.element('.form-div').first().hasClass('active'))) {
                var cur_active = angular.element('.form-div.active');
                count--;
                cur_active.prev().addClass('active');
                cur_active.removeClass('active');
                angular.element('.progress-bar').css('width', $scope.progress_percentage * count + "%");
                angular.element(".corousel-inner").css("transform", "translateX(" + (count - 1) * minusWidth + "px)");
            }*/
            $scope.counter--;
        };

        $scope.submitAndExitForm = function() {
            console.log("Inside submitAndExitForm");
            var providedById = $rootScope.user._id;
            $scope.feedbackModel.positionId = $scope.positionId;
            $scope.feedbackModel.template = $scope.overallFeedbackTmpl;
            $scope.feedbackModel.candidateId = $scope.candidateId;
            $scope.feedbackModel.interviewerid = providedById;
            $scope.feedbackModel.item[$scope.order].answer = $scope.items[$scope.order].answer;
            $scope.feedbackModel.item[$scope.order].providedBy =  providedById;
            console.log($scope.feedbackModel);
            
            $http.post('/api/v1/secure/feedbacks/', $scope.feedbackModel,{
                cache: true
            }).success(function(response) {
              // console.log(response);
          })
            $location.path('/thankyou');

        };

        var arrayContains = Array.prototype.indexOf ?
        function(arr, val) {
            return arr.indexOf(val) > -1;
        } :
        function(arr, val) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === val) {
                    return true;
                }
            }
            return false;
        };

        function arrayIntersection() {
            var val, arrayCount, firstArray, i, j, intersection = [], missing;
            var arrays = Array.prototype.slice.call(arguments); // Convert arguments into a real array

            // Search for common values
            firstArr = arrays.pop();
            if (firstArr) {
                j = firstArr.length;
                arrayCount = arrays.length;
                while (j--) {
                    val = firstArr[j];
                    missing = false;

                    // Check val is present in each remaining array
                    i = arrayCount;
                    while (!missing && i--) {
                        if ( !arrayContains(arrays[i], val) ) {
                            missing = true;
                        }
                    }
                    if (!missing) {
                        intersection.push(val);
                    }
                }
            }
            return intersection;
        }

        $scope.selection = [];
         // toggle selection for a given choice by name
         $scope.toggleSelection = function toggleSelection(choice,index) {
            // console.log(index);

            var idx = $scope.selection.indexOf(choice);
            // is currently selected
            if (idx > -1) {
                $scope.selection.splice(idx, 1);
            }

            // is newly selected
            else {
                $scope.selection.push(choice);
            }

            var answerChoice = arrayIntersection($scope.feedbackModel.choices.toString().split(","),$scope.selection.toString().split(","));
            // console.log(answerChoice.toString());
            //$scope.feedbackModel.answer = answerChoice.toString();
        };

    });


