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

.directive('exportToCsv',function(){
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var el = element[0];
            element.bind('click', function(e){
                var table = e.target.nextElementSibling;
                var csvString = '';
                for(var i=0; i<table.rows.length;i++){
                    var rowData = table.rows[i].cells;
                    for(var j=0; j<rowData.length;j++){
                        csvString = csvString + rowData[j].innerHTML + ",";
                    }
                    csvString = csvString.substring(0,csvString.length - 1);
                    csvString = csvString + "\n";
                }
                csvString = csvString.substring(0, csvString.length - 1);
                var a = $('<a/>', {
                    style:'display:none',
                    href:'data:application/octet-stream;base64,'+btoa(csvString),
                    download:'JobReport.csv'
                }).appendTo('body')
                a[0].click()
                a.remove();
            });
        }
    }
}) 

.controller('positionsCtrl', ['$scope', '$routeParams', '$http', '$location', 'Upload', '$timeout', 'toaster', '$rootScope', function($scope, $routeParams, $http, $location, Upload, $timeout, toaster, $rootScope ){

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

    $scope.saveColor = function() {
        $("html, body, #sb-wrapper, .sidebar-item").css("background", $scope.user.bodyBGColor);
        if($scope.user.bodyBGColor != '#ffffff'){
            $("div#profile-details").css({"border":"1px solid #286090", "background":"none"});
            $(".profile-overview h1, .fa-cog").css("color","#000");
            $("#menu-toggle .fa-bars").css("color", "#000");
        }else{
            $("div#profile-details").css({"border":"none", "background":"#4d4dff"});
            $(".profile-overview h1, .fa-cog").css("color","#fff");
            $("#menu-toggle .fa-bars").css("color", "#fff");
        }
        $scope.user.theme= $scope.user.bodyBGColor;
        $http.put('/api/v1/secure/admin/users/' + $rootScope.user._id, $scope.user).success(function(response) {
          console.log('updaing save color');
        });       
    }

    $scope.saveBgImage = function() {
        $("html, body, #sb-wrapper, .sidebar-item").css("background-image", "url("+$scope.user.bodyBGImg+")");
        /*$("div#profile-details").css({"border":"1px solid #286090", "background":"none"});
        $(".profile-overview h1").css("color","#000");
        $("#menu-toggle .fa-bars").css("color", "#000");*/

        if($scope.user.bodyBGImg != '#ffffff'){
            $("div#profile-details").css({"border":"1px solid #286090", "background":"none"});
            $(".profile-overview h1, .fa-cog").css("color","#000");
            $("#menu-toggle .fa-bars").css("color", "#000");
        }else{
            $("div#profile-details").css({"border":"none", "background":"#4d4dff"});
            $(".profile-overview h1").css("color","#fff");
            $("#menu-toggle .fa-bars").css("color", "#fff");
        }

        $scope.user.theme= $scope.user.bodyBGImg;
        $http.put('/api/v1/secure/admin/users/' + $rootScope.user._id, $scope.user).success(function(response) {
          console.log('updaing save color');
        });       
    }

    $scope.exportToExcel=function(tableId){ 
        var exportHref=Excel.tableToExcel(tableId,'sheet name');
        //$timeout(function(){location.href=$scope.fileData.exportHref;},100); // trigger download
        console.log('exportHref '+exportHref);
        $timeout(function(){location.href=exportHref;},100); // trigger download
    } 
    
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
        console.log('create');
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
          //if("/api/v1/upload/"+$scope.jobPos.positionId+"".pdf"")
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

.controller('positionCtrl', ['$scope', '$routeParams', '$http', '$location', '$timeout', '$route', function($scope, $routeParams, $http, $location, $timeout, $route) {
    console.log('routeParams '+$routeParams.id);
    $scope.droppedObjects1 = [];
    var refreshPosByCandi = function() {
        $http.get('/api/v1/secure/positions/'+$routeParams.id+'/candidates',{
           cache: false
        }).success(function(response) {
            console.log('response '+response);
            $scope.candidateList = response;
            $scope.droppedObjects1 = response;
            $scope.positionId=$routeParams.id;
        });
    }
    refreshPosByCandi();

    $http.get('/api/v1/secure/candidates',{
        cache: true
    }).success(function(response) {
        console.log('candidates '+response);
        $scope.usersList = response;        
    });

    $scope.centerAnchor = true;
    $scope.toggleCenterAnchor = function () {
        $scope.centerAnchor = !$scope.centerAnchor
    };


    $scope.inArrayOfObjects=function(myArray,myValue,objElement){
        var inArray = false;
        myArray.map(function(arrayObj){
            if (arrayObj['_id'] === myValue || arrayObj['id'] === myValue) {
                console.log("eneterd");
                inArray=true;
            }
        });
        return inArray;
    };
    
    $scope.removeObjectFromObjectArray=function(myArray,myValue){
         for (var n = 0 ; n < myArray.length ; n++) {
            if (myArray[n].id == myValue || myArray[n]._id == myValue) {
              var removedObject = myArray.splice(n,1);
              removedObject = null;
              break;
            }
         }
        return  myArray;
    }

    $scope.onDropComplete1=function(data,evt){
        var exists = false;
        
        exists = $scope.inArrayOfObjects($scope.droppedObjects1, data._id, '_id');
        //{$push: {"candidate": {candid: data._id}}}).success(function(response) {
        if (!exists){
            $scope.droppedObjects1.push(data);
            $http.get('/api/v1/secure/positions/'+$routeParams.id).success(function(response) {
                var pos_id = response._id;  
                console.log('data......._iddddd = ' + data._id);
                $http.put('/api/v1/secure/positions/'+pos_id,                      
                       {$push: {candidate:{$each: [{ candid: data._id }]}}}).success(function(response) {
                    console.log('candidates added successfully '+response);                     
                })
                .error(function(data, status){
                    console.log('error '+data+' status '+status);
                });
            });
        }//index loop end
        console.log('droppedObjects1 AFTER '+JSON.stringify($scope.droppedObjects1));
    };

    $scope.deleteAppCandidate = function(candidateId) {
        console.log('m in delete funct '+candidateId);
        $http.get('/api/v1/secure/positions/'+$routeParams.id).success(function(response) {
            var pos_id = response._id;
            $http.put('/api/v1/secure/positions/'+pos_id,
                { $pull: { "candidate" : { candid: candidateId } } }).success(function(response) {
                    console.log('candidates removed successfully '+response);
                    $scope.droppedObjects1 =  $scope.removeObjectFromObjectArray( $scope.droppedObjects1, candidateId);               
            })
            .error(function(data, status){
                console.log('error '+data+' status '+status);
            });
        });
    }; // delete method ends

    $scope.onDragSuccess1=function(data,evt){
        var index = $scope.droppedObjects1.indexOf(data);
        if (index > -1) {
            $scope.droppedObjects1.splice(index, 1);
        }
    };

    /*$scope.array = [];
    var result = "";
    $scope.addCandidates = function(droppedObjects1){
        console.log('add candi'+JSON.stringify(droppedObjects1));
        var dropCandId = '';
        for(var i=0; i< droppedObjects1.length; i++){
            console.log('add candi'+ droppedObjects1[i]._id);
            var dropCandId = droppedObjects1[i]._id;
            if(i>0){
               result += ','; 
            }
            result += dropCandId;
            $scope.array.push({
                'candid':dropCandId,
            });

        }
        //var jsonData = angular.toJson($scope.array);
        console.log('jsonData '+jsonData);
        
        var jsonData = {"location":"Hyderabad"};
        $http.put('/api/v1/secure/positions/'+$routeParams.id+'/set/', jsonData).success(function(response) {    
            console.log('candidates added successfully');
        })
        .error(function(data, status){
            console.log('error '+data+' status '+status);
        });
    };*/

    var inArray = function(array, obj) {
        var index = array.indexOf(obj);
    };     
 }])

.controller('positionFeedbackCtrlssss', function($scope, $routeParams, $http) { 
    console.log($routeParams.id);
	$http.get('/api/v1/secure/positions/'+$routeParams.id+'/feedback',{
		cache: true
	}).success(function(response) {
		console.log("hreeeeeeeee" + response);
		$scope.feedbackList = response;
	})
    
})

 .controller('chatCtrl', ['$rootScope', '$scope', '$filter', function($rootScope, $scope, $filter){
        var socket = io.connect();
        var messages=[];
        var date = new Date();
         
        $scope.HHmmss = 
         
        $scope.loggedinuser = $rootScope.user.name.first;
        
        socket.on("new message", function(newtext){            
            $scope.$apply(function(){
                console.log("received message");
                messages.push(newtext);
                $scope.messages = messages;
            });
        });

        $scope.sendMessage = function(msg){ 
             var newMessage = {
                username:$rootScope.user.name.first,
                message:msg,
                textedTime:$filter('date')(new Date(), 'hh:mm a')
            };
            socket.emit("send message", newMessage);  
            $scope.textMessage ="";            
        };

       $scope.$watch(function(){
            return messages;
        }, function(){
            if(messages){
                console.log("This is the value for username", messages);
            }
        })   

    }])

    
.controller('positionFeedbackCtrl', ['$scope', '$timeout', '$interval' ,'$filter','$location','$routeParams','$http','$rootScope', 
                             function($scope, $timeout, $interval, $filter, $location, $routeParams, $http, $rootScope) {
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
                $scope.feedbackModel = response;
                $scope.feedbackId = response.feedbackTmpl;
                $scope.positionId = $routeParams.id;
                $scope.candidateId = $routeParams.candidateId;
                $scope.fbid = response.feedbackTmpl;
                $scope.feedbackList = "";
                $scope.groupMember = $rootScope.user.groups;
             console.log("user groups" + $rootScope.user.groups);
             

                //if user belong to Interviwers group & not to admin group, user will be able to see the feedback belonging to interviewers category only
                if ($rootScope.user.groups.indexOf("emp") > -1 && $rootScope.user.groups.indexOf("admin") == -1) {
                    console.log("Entered filter criteria");
                    $scope.userrole ="interviewer";
                 }
                 else 
                 {
                     $scope.userrole ="admin";
                 }
             
                $http.get('/api/v1/secure/feedbackDefs/id/'+ response.feedbackTmpl).success(function(response) {
                    $scope.items = response.item;
                    $scope.length = response.item.length - 1;                    
                    $scope.feedbackModel = response;
                    $scope.feedbackId = response.feedbackTmpl;
                    $scope.positionId = $routeParams.id;
                    $scope.candidateId = $routeParams.candidateId;
                    $scope.fbid = response.feedbackTmpl;
                    $scope.max = $scope.length + 1;        
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

    }])


.controller('feedbackController', ['$scope', '$http', '$routeParams','$location','growl','$rootScope','$mdDialog','$timeout','toaster',
    function($scope, $http, $routeParams, $location, growl, $rootScope, $mdDialog, $timeout, toaster) {
          $scope.items=[];
          var id = $routeParams.id;
          var filter = {};
        
          // AUtomatically swap between the edit and new mode to reuse the same frontend form
          $scope.mode=(id==null? 'add': 'edit');
          $scope.nameonly= "nameonly";
          $scope.hideFilter = true;
          $scope.fbvalid= true;
          $scope.isSaving=false;
            
         
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

      $scope.save = function(category){
        //$scope.feedbackDefs.createBy = $rootScope.user._id;
        switch($scope.mode)    {

          case "add":
            $scope.create(category);
            break;

          case "edit":
            $scope.update();
            break;
          } // end of switch scope.mode ends

          $location.path("/feedbackTmpl/list");
      } // end of save method


      $scope.create = function(category) {
            console.log("$scope.feedbackDefs" + $scope.feedbackDefs);
            console.log("$scope.items" + $scope.items);
            console.log(" $scope.feedbackList.length = " +  $scope.feedbackList.length);
            var inData = $scope.feedbackDefs;
            inData.item = $scope.items;
            inData.createdBy = $rootScope.user._id;
            inData.category = $scope.category;
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
              choices: item.choices,
              category: $scope.category
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
          console.log("item.category = " + item.category);
          $scope.category = item.category;
          $scope.items.splice(index, 1);
          $mdDialog.show({
              templateUrl: '/public/m/positions/itemViewDialog.html',
              scope: $scope.$new(),
              parent: angular.element(document.body),
              targetEvent: ev,
              clickOutsideToClose:false
            })
      };

      $scope.addFeedbackItem = function(ev, category) {
          console.log("inside addFeedbackItmmmmmmmmmmmmmmmem");
          console.log("category = " + category);
          $scope.category = category;
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




