var controllers = angular.module('starter.controllers', []);

    controllers.controller('PezCtrl', function($scope, $ionicModal, $timeout) {
    });

    controllers.controller('CustomerListCtrl', function($scope, $state, customerService) {
        $scope.customers = customerService.GetCustomerList();
        $scope.deleteData = function(){
            customerService.DeleteData();
            $state.go($state.current, {}, {reload: true});
        }
    });

    controllers.controller('CustomerDetailsCtrl', function($scope, $stateParams, $ionicHistory, Camera, customerService) {
        if ($stateParams.customerId) {
            var customerId = $stateParams.customerId;
            var customerObject = customerService.GetCustomer(customerId);
            $scope.customer = customerObject;            
        }
        else{
            $scope.customer = customerService.NewCustomer();
        }
        $scope.imageURI = $scope.customer.imageURI;

        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                $scope.imageURI = imageURI;
            }, function(err) {
                console.err(err);
            });
        };

        $scope.saveCustomer = function(customer) {
            if (customer) {
                customer.imageURI = $scope.imageURI;
                customerService.SaveCustomer(customer);
            }

            $ionicHistory.goBack();
        };

        $scope.adstandandi = {show:false};
        $scope.sjukdomar = {show:false};
        $scope.puls = {show:false};
        $scope.annad = {show:false};

        $scope.toggleGroup = function(group) {
            group.show = !group.show;
        };
        $scope.isGroupShown = function(group) {
            return group.show;
        };
    });

    controllers.controller('TreatmentListCtrl', function($scope , $stateParams, customerService, treatmentService) {
        var customerId = $stateParams.customerId;
        $scope.customer = customerService.GetCustomer(customerId);
        $scope.treatments = treatmentService.GetTreatmentList(customerId);
    });

    controllers.controller('TreatmentCtrl', function($scope , $stateParams , Camera, customerService, treatmentService, photoService) {
        var customerId = $stateParams.customerId;
        var treatmentId = $stateParams.treatmentId;
        $scope.customer = customerService.GetCustomer(customerId);
        if(treatmentId) {
            $scope.treatment = treatmentService.GetTreatment(customerId, treatmentId);
        }
        else{
            $scope.treatment = treatmentService.NewTreatment();
        }

        // Picture stuff
        // =============================================================================
        $scope.getPhoto = function() {
            Camera.getPicture().then(function(imageURI) {
                photoService.SaveTreatmentPhoto(imageURI, customerId, treatmentId);
                $scope.treatment = treatmentService.GetTreatment(customerId, treatmentId);
            }, function(err) {
                console.err(err);
            });
        };

        $scope.deleteImage = function(imageUri){
            photoService.DeleteTreatmentPhoto(imageUri, customerId, treatmentId);
        };
        
        // =============================================================================

    });

    controllers.controller('TreatmentImagesCtrl', function($scope , $stateParams , $ionicHistory, treatmentService) {
        var customerId = $stateParams.customerId;
        var treatmentId = $stateParams.treatmentId;
        var treatment = treatmentService.GetTreatment(customerId, treatmentId);

        $scope.saveCanvas = function(){
            saveCanvasImage();
            treatmentService.SaveTreatment(treatment);
            $ionicHistory.goBack();
        };

        function saveCanvasImage()
        {
            var imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
            var imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
            cordova.exec(
                function(imagePath){
                    treatment.feetImagePath = imagePath;
                },
                function(errorMsg){
                    console.log(errorMsg);
                },
                'Canvas2ImagePlugin',
                'saveImageDataToLibrary',
                [imageData]
            );
        }

        // Drawing stuff
        // TODO allow erasing somehow
        // =======================================================================================
        var lastPt=null;
        var canvas = document.getElementById("footCanvas");
        var ctx = canvas.getContext("2d");
        var saveButton = document.getElementById('saveButton').clientHeight;
        ctx.canvas.width = window.innerWidth;
        ctx.canvas.height = window.innerHeight - saveButton - 20;
        var defaultGlobalCompositeOperation = ctx.globalCompositeOperation;
        var mode = "";

        restoreCanvas();
        drawMode();

        ionic.DomUtil.ready(function() {
            canvas.addEventListener("touchmove", drawtouchmove, false);
            canvas.addEventListener("touchend", endtouchmove, false);

            canvas.addEventListener("mousedown", function() {
                    canvas.addEventListener("mousemove", drawmousemove, false);
                }
                , false);
            canvas.addEventListener("mouseup", endmousemove, false);

        });

        function drawMode(){
            mode = "draw";
            ctx.globalCompositeOperation = defaultGlobalCompositeOperation;
            ctx.strokeStyle = 'purple';
            ctx.lineWidth = 2;
        }

        function eraseMode(){
            mode = "erase";
            ctx.globalCompositeOperation = "destination-out";
            ctx.strokeStyle = "rgba(0,0,0,1)";
            ctx.lineWidth = 10;
        }

        function restoreCanvas(){
            drawMode();
            for(var i= 0; i<treatment.drawingPoints; i++)
            {
                var point = treatment.drawingPoints[i];
                drawPoint(point.x, point.y);
            }
            lastPt = null;

            eraseMode();
            for(var i= 0; i<treatment.erasingPoints; i++)
            {
                var point = treatment.erasingPoints[i];
                drawPoint(point.x, point.y);
            }
            lastPt = null;
        }

        function drawtouchmove(e) {
            e.preventDefault();
            var point = {x: e.touches[0].pageX, y: e.touches[0].pageY};
            drawPoint(point);
            addPointToTreatment(point);
        }

        function drawmousemove(e) {
            e.preventDefault();
            var point = {x: e.pageX, y: e.pageY};
            drawPoint(point);
            addPointToTreatment(point);
        }

        function addPointToTreatment(point){
            if (mode == "draw"){
                treatment.drawingPoints.push({x:point.x, y:point.y});
            }else{
                treatment.erasingPoints.push({x:point.x, y:point.y});
            }
        }

        function drawPoint(point){
            if(lastPt!=null) {
                ctx.beginPath();
                ctx.moveTo(lastPt.x, lastPt.y);
                ctx.lineTo(point.x, point.y);
                ctx.stroke();
            }
            lastPt = {x:point.x, y:point.y};
        }

        function endtouchmove(e) {
            e.preventDefault();
            lastPt = null;
        }

        function endmousemove(e) {
            e.preventDefault();
            canvas.removeEventListener("mousemove", drawmousemove, false);
            lastPt = null;
        }
    });

    controllers.controller('TreatmentAddCtrl', function($scope , $stateParams) {
        $scope.treatment = {id: $stateParams.treatmentId};
    });
    
   