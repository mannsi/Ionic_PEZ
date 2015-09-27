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

    controllers.controller('TreatmentCtrl', function($scope , $stateParams , $state, $ionicScrollDelegate, Camera, customerService, treatmentService, photoService) {
        var customerId = $stateParams.customerId;
        var treatmentId = $stateParams.treatmentId;
        $scope.customer = customerService.GetCustomer(customerId);
        $scope.treatment = treatmentService.GetTreatment(customerId, treatmentId);

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
        
        // =============================================================================
        
        // Drawing stuff
        // =============================================================================
        $scope.saveCanvas = function(){
            var dataURL = canvas.toDataURL();
            treatmentService.SaveTreatmentOverlay($scope.treatment.id, dataURL);
            console.log(dataURL);
        };

        $scope.drawMode = function() {
            context.globalCompositeOperation = defaultGlobalCompositeOperation;
            context.strokeStyle = "black";
            context.lineWidth = 1;
        };

        $scope.eraseMode = function() {
            context.globalCompositeOperation = "destination-out";
            context.strokeStyle = "rgba(0,0,0,1)";
            context.lineWidth = 10;
        };

        var context = document.getElementById('sheet').getContext("2d");
        var canvas = document.getElementById('sheet');
        context = canvas.getContext("2d");
        context.lineJoin = "round";

        var imageNativeWidth = 468;
        var imageNativeHeight = 593;
        canvas.width = Math.min(window.innerWidth, imageNativeWidth);
        canvas.height = Math.min(window.innerHeight, imageNativeHeight);
        $scope.drawMode();

        var defaultGlobalCompositeOperation = context.globalCompositeOperation;
        var clickX = [];
        var clickY = [];
        var clickDrag = [];
        var paint;

        /**
         * Add information where the user clicked at.
         * @param {number} x
         * @param {number} y
         * @return {boolean} dragging
         */
        function addClick(x, y, dragging) {
            clickX.push(x);
            clickY.push(y);
            clickDrag.push(dragging);
        }

        /**
         * Redraw the complete canvas.
         */
        $scope.redraw = function() {
            // Clears the canvas
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

            for (var i = 0; i < clickX.length; i += 1) {
                if (!clickDrag[i] && i == 0) {
                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i]);
                    context.stroke();
                } else if (!clickDrag[i] && i > 0) {
                    context.closePath();

                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i]);
                    context.stroke();
                } else {
                    context.lineTo(clickX[i], clickY[i]);
                    context.stroke();
                }
            }
        };



        /**
         * Draw the newly added point.
         * @return {void}
         */
        function drawNew() {
            $ionicScrollDelegate.freezeAllScrolls(true);
            var i = clickX.length - 1;
            if (!clickDrag[i]) {
                if (clickX.length == 0) {
                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i] + 0.5);
                    context.stroke();
                } else {
                    context.closePath();

                    context.beginPath();
                    context.moveTo(clickX[i], clickY[i] + 0.5);
                    context.stroke();
                }
            } else {
                context.lineTo(clickX[i], clickY[i] + 0.5);
                context.stroke();
            }
            $ionicScrollDelegate.freezeAllScrolls(true);
        }

        function getMouseCoordinates(event, canvas){
            var totalOffsetX = 0;
            var totalOffsetY = 0;
            var canvasX = 0;
            var canvasY = 0;
            var currentElement = canvas;

            do {
                totalOffsetX += currentElement.offsetLeft;
                totalOffsetY += currentElement.offsetTop;
            }
            while (currentElement = currentElement.offsetParent);

            canvasX = event.pageX - totalOffsetX;
            canvasY = event.pageY - totalOffsetY;

            // Fix for variable canvas width
            canvasX = Math.round( canvasX * (canvas.width / canvas.offsetWidth) );
            canvasY = Math.round( canvasY * (canvas.height / canvas.offsetHeight) );

            return {'x':canvasX, 'y':canvasY}
        }

        function mouseDownEventHandler(e) {
            paint = true;
            //var x = e.x - canvas.offsetLeft;
            //var y = e.y - canvas.offsetTop;
            //
            //var x = e.layerX;
            //var y = e.layerY;
            //var x = e.pageX - getOffSetLeft(canvas);
            //var y = e.pageY - getOffSetTop(canvas);

            if (paint) {
                var coords = getMouseCoordinates(e, canvas);
                addClick(coords['x'], coords['y'], false);
                drawNew();
            }
        }

        function touchstartEventHandler(e) {
            paint = true;
            if (paint) {
                var coords = getMouseCoordinates(e.touches[0], canvas);
                addClick(coords['x'], coords['y'], false);
                //addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
                drawNew();
            }
        }

        function mouseUpEventHandler(e) {
            context.closePath();
            paint = false;
        }

        function mouseMoveEventHandler(e) {
            //var x = e.x - getOffSetLeft(canvas);
            //var y = e.y - getOffSetTop(canvas);

            //var x = e.x - canvas.offsetLeft;
            //var y = e.y - canvas.offsetTop;

            //var x = e.layerX;
            //var y = e.layerY;
            if (paint) {
                var coords = getMouseCoordinates(e, canvas);
                addClick(coords['x'], coords['y'], true);
                drawNew();
            }
        }

        function touchMoveEventHandler(e) {
            if (paint) {
                var coords = getMouseCoordinates(e.touches[0], canvas);
                addClick(coords['x'], coords['y'], true);
                //addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
                //addClick(e.touches[0].layerX, e.touches[0].layerY, true);
                drawNew();
            }
        }

        function setUpHandler(isMouseandNotTouch, detectEvent) {
            removeRaceHandlers();
            if (isMouseandNotTouch) {
                canvas.addEventListener('mouseup', mouseUpEventHandler);
                canvas.addEventListener('mousemove', mouseMoveEventHandler);
                canvas.addEventListener('mousedown', mouseDownEventHandler);
                mouseDownEventHandler(detectEvent);
            } else {
                canvas.addEventListener('touchstart', touchstartEventHandler);
                canvas.addEventListener('touchmove', touchMoveEventHandler);
                canvas.addEventListener('touchend', mouseUpEventHandler);
                touchstartEventHandler(detectEvent);
            }
        }

        function mouseWins(e) {
            setUpHandler(true, e);
        }

        function touchWins(e) {
            setUpHandler(false, e);
        }

        function removeRaceHandlers() {
            canvas.removeEventListener('mousedown', mouseWins);
            canvas.removeEventListener('touchstart', touchWins);
        }

        canvas.addEventListener('mousedown', mouseWins);
        canvas.addEventListener('touchstart', touchWins);    
    });

    controllers.controller('TreatmentAddCtrl', function($scope , $stateParams) {
        $scope.treatment = {id: $stateParams.treatmentId};
    });
    
   