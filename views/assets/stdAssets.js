module.exports = {

	assets : {
		"bootstrap": {
			"cdn": [
			"//netdna.bootstrapcdn.com/bootstrap/3.0.2/css/bootstrap.css"
			],
			"dev":[
			"/public/libs/bootstrap/dist/css/bootstrap.css",
			"/public/libs/bootstrap/dist/js/bootstrap.js"
			],
			"prod":[
			"/public/libs/bootstrap/dist/css/bootstrap.min.css",
			"/public/libs/bootstrap/dist/js/bootstrap.min.js"
			]
		},

		"font-awesome": {
			"cdn": [
			"//netdna.bootstrapcdn.com/font-awesome/4.0.3/css/font-awesome.css"
			],
			"dev":[
			"/public/libs/font-awesome/css/font-awesome.css"
			],
			"prod":[
			"/public/libs/font-awesome/css/font-awesome.min.css"
			]
		},

		"jquery": {
			"cdn": [
			],
			"dev":[
			"/public/libs/jquery/dist/jquery.js",
			"/public/libs/jquery-ui/jquery-ui.js",
			"/public/libs/jquery-ui/themes/smoothness/jquery-ui.css"
			],
			"prod":[
			"/public/libs/jquery/dist/jquery.min.js",
			"/public/libs/jquery-ui/jquery-ui.min.js",
			"/public/libs/jquery-ui/themes/smoothness/jquery-ui.min.css"
			]
		},

		"jquery-ui": {
			"cdn": [
			],
			"dev":[
			"/public/libs/jquery-ui/jquery-ui.js",
			"/public/libs/jquery-ui/themes/smoothness/jquery-ui.css"
			],
			"prod":[
			"/public/libs/jquery-ui/jquery-ui.min.js",
			"/public/libs/jquery-ui/themes/smoothness/jquery-ui.min.css"
			]
		},

		"angular-core": {
			"cdn": [
			],
			"dev":[
			"/public/libs/angular/angular.js",
			"/public/libs/angular-route/angular-route.js",
			"/public/libs/angular-cookies/angular-cookies.js"
			],
			"prod":[
			"/public/libs/angular/angular.min.js",
			"/public/libs/angular-route/angular-route.min.js",
			"/public/libs/angular-cookies/angular-cookies.min.js"
			]
		},

		"angular-forms":{
			"cdn":[],
			"dev":[
			"/public/libs/angular-messages/angular-messages.min.js"
			],
			"prod":[
			"/public/libs/angular-messages/angular-messages.min.js"
			]
		},

		"angular-bootstrap":{
			"cdn":[],
			"dev":[
			"/public/libs/angular-bootstrap/ui-bootstrap-tpls.js"
			],
			"prod":[
			"/public/libs/angular-bootstrap/ui-bootstrap-tpls.min.js"
			]
		},

		"angular-animate": {
			"cdn": [
			],
			"dev":[
			"/public/libs/angular-animate/angular-animate.js"
			],
			"prod":[
			"/public/libs/angular-animate/angular-animate.min.js"
			]
		},

		"angular-material": {
			"cdn": [
			],
			"dev":[
			"/public/libs/angular-animate/angular-animate.js",
			"/public/libs/angular-aria/angular-aria.js",
			"/public/libs/angular-material/angular-material.js",
			"/public/libs/angular-material/angular-material.css"
			],
			"prod":[
			"/public/libs/angular-animate/angular-animate.min.js",
			"/public/libs/angular-aria/angular-aria.min.js",
			"/public/libs/angular-material/angular-material.min.js",
			"/public/libs/angular-material/angular-material.min.css"
			]
		},

		"angular-text": {
			"cdn": [
			],
			"dev":[
			"/public/assets/w/js/textAngular.js"
			],
			"prod":[
			"/public/assets/w/js/textAngular.js"
			]
		},

		"angular-growl": {
			"cdn": [
			],
			"dev":[
			"/public/libs/angular-growl-v2/build/angular-growl.css",
			"/public/libs/angular-growl-v2/build/angular-growl.js"
			],
			"prod":[
			"/public/libs/angular-growl-v2/build/angular-growl.min.css",
			"/public/libs/angular-growl-v2/build/angular-growl.min.js"
			]
		},
        
        "angularMultipleSelect":{
            "cdn":[],
            "dev":[
            "/public/libs/angular-multiple-select/build/multiple-select.min.js",
            "/public/libs/angular-multiple-select/build/multiple-select.min.css"
            ],
        },
        
        "angular-filter": {
            "cdn": [
            ],
            "dev":[
            "/public/libs/angular-filter/dist/angular-filter.min.js",
            "/public/libs/angular-filter/dist/angular-filter.js"
            ],
            "prod":[
            ]
        },
        
		"angular-fileupload":{
			"cdn":[],
			"dev":[
			"/public/libs/ng-file-upload/ng-file-upload.js",
			"/public/libs/ng-file-upload/ng-file-upload-shim.js"
			],
		},
        
        "angular-pdf":{
			"cdn":[],
			"dev":[
			"/public/libs/pdfjs-dist/build/pdf.combined.js",
			"/public/assets/js/angular-pdf-viewer.min.js"
			],
		}, 
        
        "angular-dialog":{
			"cdn":[],
			"dev":[
			"/public/assets/styles/ngDialog-theme-default.css",
			"/public/assets/styles/ngDialog.css",
			"/public/assets/js/ngDialog.min.js"
			],
		}, 

		"angular-image":{
			"cdn":[],
			"dev":[
			"/public/libs/ngImgCropFullExtended/compile/unminified/ng-img-crop.js",
			"/public/libs/ngImgCropFullExtended/compile/unminified/ng-img-crop.css"
			],
			"prod":[
			"/public/libs/ngImgCropFullExtended/compile/unminified/ng-img-crop.min.js",
			"/public/libs/ngImgCropFullExtended/compile/unminified/ng-img-crop.min.css"
			]
		},

		"angular-dropzone":{
			"cdn":[],
			"dev":[
			"/public/assets/g/css/dropzone.css",
			"/public/assets/g/js/dropzone.js"
			],
			"prod":[
			"/public/assets/g/css/dropzone.min.css",
			"/public/assets/g/js/dropzone.js"
			]
		},

		"angular-confirmDialog":{
			"cdn":[],
			"dev":[
			"/public/assets/g/css/confirmDialog.css"
			],
			"prod":[
			"/public/assets/g/css/confirmDialog.min.css"
			]
		},
        
        "angular-forms":{
            "cdn":[],
            "dev":[
            "/public/libs/angular-messages/angular-messages.min.js"
            ],
            "prod":[]
        },

		"utils":{
			"cdn":[],
			"dev":[
			"/public/libs/moment/moment.js",
			"/public/libs/moment-range/dist/moment-range.js"
			],
			"prod":[
			"/public/libs/moment/moment.min.js",
			"/public/libs/moment-range/dist/moment-range.min.js"
			]
		},

		"angular-calendar": {
			"cdn": [
			],
			"dev":[
			"/public/libs/angularjs-datepicker/src/css/angular-datepicker.css",
			"/public/libs/angularjs-datepicker/src/js/angular-datepicker.js"
			],
			"prod":[
			]
		},
        
        "angular-chart": {
			"cdn": [
			],
			"dev":[
			 "/public/libs/chart.js/dist/Chart.min.js"               
			],
			"prod":[
             "/public/libs/chart.js/dist/Chart.min.js"
			]
		},

		"angular-draggable":{
			"cdn":[],
			"dev":[
			"/public/libs/ngDraggable/ngDraggable.js"
			]
		}

	}

};
