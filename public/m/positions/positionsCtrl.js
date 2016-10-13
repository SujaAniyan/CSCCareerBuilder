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

.controller('positionsCtrl', ['$scope', '$routeParams', '$http', '$location', 'Upload', '$timeout', 'toaster', function($scope, $routeParams, $http, $location, Upload, $timeout, toaster){

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

    $scope.uploadFiles = function(file, errFiles) {
        console.log('positionId '+ $scope.jobPos.positionId);
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: '/api/v1/upload/'+$scope.jobPos.positionId,
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                    $scope.jobDescription = response.data.file.path;
                    console.log('response.data ' + response.data.file.path);
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                evt.loaded / evt.total));
            });
        }
    }

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
        $scope.jobPos.jobDescription= $scope.jobDescription;
        $http.post('/api/v1/secure/positions', $scope.jobPos).success(function(response) {
	     toaster.pop({body:"Job Position Added successfully."});
        $location.path("/positions");
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
    
    $http.get('/api/v1/secure/feedbacks/'+$routeParams.id+ '/' + $routeParams.candidateId +  '/' + $rootScope.user._id,{
        cache: true
    }).success(function(response) {
        console.log("MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE");
        console.log("response = " + response);
        $scope.feedbackModel = response;
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
        };  */     

    })
   .error(function(response){
        console.log('Feedback not saved. User going to enter feedback');
        
         $http.get('/api/v1/secure/positions/'+ $routeParams.id).success(function(response) {
                console.log('Retreiving feedbackid from postions collection..');
                //$scope.feedbackModel = response;
                $scope.feedbackId = response.feedbackTmpl;
                $scope.positionId = $routeParams.id;
                $scope.candidateId = $routeParams.candidateId;
                $scope.fbid = response.feedbackTmpl;
                console.log('feedbackid = ' + response.feedbackTmpl);
                console.log('positionId = ' + $scope.positionId);
                console.log('candidateId = ' + $scope.candidateId);
                console.log('fbid = ' + $scope.fbid);
                $http.get('/api/v1/secure/feedbackDefs/id/'+ response.feedbackTmpl).success(function(response) {
                $scope.items = response.item;
                $scope.length = response.item.length - 1;
                $scope.feedbackModel = response;
                $scope.feedbackId = response.feedbackTmpl;
                $scope.positionId = $routeParams.id;
                $scope.candidateId = $routeParams.candidateId;
                $scope.fbid = response.feedbackTmpl;
                $scope.max = $scope.length + 1;          
                console.log('length = ' +  $scope.length );
                          
                //$scope.feedbackList = response.item;
            })             
         })  
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

    })


.controller('feedbackController', ['$scope', '$http', '$routeParams','$location','growl','$rootScope','$mdDialog','$timeout','toaster',
    function($scope, $http, $routeParams, $location, growl, $rootScope, $mdDialog, $timeout, toaster) {
          $scope.items=[];
          var id = $routeParams.id;
          // AUtomatically swap between the edit and new mode to reuse the same frontend form
          $scope.mode=(id==null? 'add': 'edit');
          $scope.nameonly= "nameonly";
          $scope.hideFilter = true;
          $scope.fbvalid= true;
            $scope.isSaving=false;
          if ($rootScope.user.groups.indexOf("vManager") > -1 ) {
            $scope.isSaving= true; 
          }

        var refresh = function() {
            $http.get('/api/v1/secure/feedbackDefs').success(function(response) {
              $scope.feedbackList = response;
              $scope.feedbackDefs = "";
              $scope.items=[];
              console.log("inside refresh mode = " + $scope.mode);

              switch($scope.mode)    {

                case "add":
                  $scope.feedbackDefs = "";
                  break;

                case "edit":
                  $scope.feedbackDefs = $http.get('/api/v1/secure/feedbackDefs/id/' + id).success(function(response){
                    var feedbackDefs = response;
                    $scope.items = feedbackDefs.item;       //list of item
                    $scope.feedbackDefs = feedbackDefs;     //whole form object
                    if ($scope.items.length == 0)
                    {
                      $scope.fbvalid= true;

                    }
                    else{
                      $scope.fbvalid= false;

                    }
                  });

              } // switch scope.mode ends
            }); // get feedback call back ends
      }; // refresh method ends

      refresh();

      $scope.save = function(){
        //$scope.feedbackDefs.createBy = $rootScope.user._id;
        switch($scope.mode)    {

          case "add":
            $scope.create();
            break;

          case "edit":
            $scope.update();
            break;
          } // end of switch scope.mode ends

          $location.path("/feedbackTmpl/list");
      } // end of save method


      $scope.create = function() {
            console.log("$scope.feedbackDefs" + $scope.feedbackDefs);
            console.log("$scope.items" + $scope.items);
            console.log(" $scope.feedbackList.length = " +  $scope.feedbackList.length);
            var inData = $scope.feedbackDefs;
            inData.item = $scope.items;
            inData.createdBy = $rootScope.user._id;
          
            /*console.log("inData.item = " + inData.item);
            console.log("inData.item.mode = " + inData.item.mode);
            console.log("inData.item.choices = " + inData.item.choices);
            console.log("inData.item.query = " + inData.item.query);
            console.log("inData.createdBy = " + inData.item.createdBy);*/
          
            $http.post('/api/v1/secure/feedbackDefs', inData).success(function(response) {
              refresh();
              growl.info(parse("Feedback Definition [%s]<br/>Added successfully", inData.title));
            })
            .error(function(data, status){
              growl.error("Error adding Feedback Definition");
            }); // http post feedback ends
      }; // create method ends

      $scope.delete = function(feedback) {
            var title = feedback.title;
            $http.delete('/api/v1/secure/feedbackDefs/' + feedback._id).success(function(response) {
              refresh();
             // growl.info(parse("Feedback [%s]<br/>Deleted successfully", title));
            })
            .error(function(data, status){
             // growl.error("Error deleting feedback");
            }); // http delete feedback ends
      }; // delete method ends

      $scope.copy = function(feedback) {
            delete feedback._id;
            var title = "Copy of " + feedback.title;
            feedback.title = title;
            $http.post('/api/v1/secure/feedbackDefs/',feedback).success(function(response) {
              refresh();
              //growl.info(parse("Template [%s]<br/>Copied successfully", title));
            })
            .error(function(data, status){
              //growl.error("Error Copying Template");
            });
      };

      $scope.update = function() {
          console.log ("Inside update function");
            $http.put('/api/v1/secure/feedbackDefs/' + $scope.feedbackDefs.id,  $scope.feedbackDefs).success(function(response) {
              refresh();
                toaster.pop({body:"Job Position Added successfully."});
              growl.info(parse("Feedback [%s]<br/>Edited successfully", $scope.feedbackDefs.title));
            })
            .error(function(data, status){
              //growl.error("Error updating feedback");
            }); // http put feedback ends
      }; // update method ends

      $scope.cancel = function() {
            $scope.feedbackDefs="";
            $location.path("feedbackTmpl/list");
      }

      // feedback item table
      $scope.addItem=function(item){

            $scope.items.push({
              query: item.query,
              mode: item.mode,
              choices: item.choices
            });

            if($scope.items.length == 0)
            {
              $scope.fbvalid = true;
            }

            else
            {
              $scope.fbvalid = false;
            }
            item.query='';
            item.mode='';
            item.choices='';
            $mdDialog.hide();
      };

      $scope.removeItem = function(index,items){
            $scope.items.splice(index, 1);
            if (items.length == 0)
            {
             $scope.fbvalid=true;

           }else{
             $scope.fbvalid=false;

           }
      };

      $scope.editItem = function(index,item,ev){
            $scope.item = item;
            console.log("item = " + item);
            console.log("item.mode = " + item.mode);
            console.log("item.choices = " + item.choices);
            console.log("item.query = " + item.query);
            $scope.items.splice(index, 1);
            $mdDialog.show({
              templateUrl: '/public/m/positions/itemViewDialog.html',
              scope: $scope.$new(),
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false
            })
      };

      $scope.addFeedbackItem = function(ev) {
          console.log("inside addFeedbackItmmmmmmmmmmmmmmmem");
          $mdDialog.show({
              templateUrl: '/public/m/positions/itemViewDialog.html',
              scope: $scope.$new(),
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false
        })
      };

      $scope.showFeedbackTemp = function(ev,id) {
            $mdDialog.show({
              controller: fbackDialog,
              templateUrl: '/public/m/positions/feedbackViewDialog.html',
              // scope: $scope.$new(),
              locals: { feedbackid: id },
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false
            })
      };

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.canceldialog = function(item) {
            // console.log(item.choices);
            if(item === undefined || item=== '')
            {
              console.log('Hi');
              $mdDialog.cancel();
            }

            if(item)
            {
              console.log(item);
              $scope.items.push({
               query: item.query,
               mode: item.mode,
               choices: item.choices
             });

              if(item.query==undefined || item.mode==undefined || (item.mode=="freetext" && item.choices == undefined) || (item.mode=="star-rating" && item.choices == undefined) || (item.mode=="single-choice" && item.choices == undefined) || (item.mode=="multi-choice" && item.choices == undefined))
              {
                $scope.items.splice($scope.items.length - 1, 1);
                $mdDialog.cancel();
              }
              item.query='';
              item.mode='';
              item.choices='';
              $mdDialog.cancel();
            };
      }
      
      $scope.attach = function(feedbackId){
          console.log("entered attachhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
          console.log("$routeParams.id = " + $routeParams.id);
          console.log("feedbackId = " + feedbackId);
          
          $http.get('/api/v1/secure/positions/'+$routeParams.id,{
                cache: true
            }).success(function(response) {
                console.log("susscceded in retrieval");
                $scope.position = response;
                response.feedbackTmpl = feedbackId;
                console.log("-id = " + response._id);
                console.log("response.feedbackTmpl = " + response.feedbackTmpl);
                $http.put('/api/v1/secure/positions/'+ response._id +'/' + feedbackId,{
                    cache: true
                    }).success(function(response) {
                        toaster.pop({body:"Job Position Added successfully."});
  			            $timeout(callSubmit,5000);
                        //$location.path("/positions");                   
                })                    
            })
      }
      
      function callSubmit() {
	    window.history.back();
	}
        
}])


'use strict';

var postions = angular.module('positions');


 //services and drirectives for ngFloatingLables//
    var messages = {
            required: "this field is required",
            minlength: "min length of @value@ characters",
            maxlength: "max length of @value@ characters",
            pattern: "don\'t match the pattern",
            "email": "mail address not valid",
            "number": "insert only numbers",
            "custom": "custom not valid type \"@value@\"",
            "async": "async not valid type \"@value@\""
    }

    postions.directive('customValidator', function () {
        return {
            require: 'ngModel',
            link: function (scope, element, attrs, ngModel) {
                ngModel.$validators.custom = function (value) {
                    return value === "foo";
                };
            }
        };
    })

    postions.service('$fakeValidationService', ['$q', function ($q) {
        return {
            "get": function (value) {
                var deferred = $q.defer();

                setTimeout(function () {
                    if (value === "bar") {
                        deferred.resolve({valid: true});
                    } else {
                        deferred.reject({valid: false});
                    }
                }, 3000);

                return deferred.promise;
            }
        }
    }])

    postions.directive('asyncValidator', ['$fakeValidationService', '$q', function ($fakeValidationService, $q) {
        return {
            require: 'ngModel',
            link: function ($scope, element, attrs, ngModel) {
                ngModel.$asyncValidators.async = function (modelValue, viewValue) {
                    var value = modelValue || viewValue;
                    if(value.length){
                        element.before('<i class="icon-spin icon-refresh"></i>').parent().addClass('spinner');

                        return $fakeValidationService.get(value).then(function(response) {
                            element.parent().removeClass('spinner').find('i').remove();
                            return true;
                        }, function(response) {
                            element.parent().removeClass('spinner').find('i').remove();
                            if (!response.valid) {
                                return $q.reject();
                            }
                        });
                    }
                };
            }
        }
    }])

    function fbackDialog($scope, $mdDialog,$http,feedbackid) {
          $scope.feedback_id = feedbackid;
          $scope.visit_id = "a01234567892345678900001";
          $scope.hide = function() {
            $mdDialog.hide();
          };
          $scope.cancel = function() {
            $mdDialog.cancel();
          };
          $scope.answer = function(answer) {
            $mdDialog.hide(answer);
          };
    }
/*.config(['growlProvider', function(growlProvider) {
    growlProvider.globalReversedOrder(true);
    growlProvider.globalTimeToLive({success: 1000, error: 2000, warning: 3000, info: 4000});
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalPosition('top-center');
}]);*/




