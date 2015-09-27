﻿var app = angular.module('starter.services', []);
    app.factory('utilitiesService', function(){
        return {
            GenerateUuid: function(){
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = (d + Math.random()*16)%16 | 0;
                        d = Math.floor(d/16);
                        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                    });
                    return uuid;
                }
        }
    });

    app.factory('photoService', function(){
        var photosPrefix = "photos-";

        function saveCustomerPhotos(customerId, customerPhotosObject){
            window.localStorage[photosPrefix + customerId] = JSON.stringify(customerPhotosObject);
        }

        function getPhotosForTreatment(customerId, treatmentId){
            var customerPhotosObject = getCustomerPhotoObject(customerId);
            if (customerPhotosObject[treatmentId]){
                return customerPhotosObject[treatmentId];
            }
            return [];
        }

        function getCustomerPhotoObject(customerId){
            var customerPhotos = {};
            if (window.localStorage[photosPrefix + customerId]){
                customerPhotos = JSON.parse(window.localStorage[photosPrefix + customerId]);
            }
            return customerPhotos;
        }

        return {
            GetPhotosForTreatment: function(customerId, treatmentId){
                return getPhotosForTreatment(customerId, treatmentId);
            },
            GetPhotosForCustomer: function(customerId){
                var customerPhotosObject = getCustomerPhotoObject(customerId);
                var photoList = [];

                for (var treatmentId in customerPhotosObject){
                    photoList = photoList.concat(customerPhotosObject[treatmentId]);
                }

                return photoList;
            },
            SaveTreatmentPhoto: function(photoUri, customerId, treatmentId){
                var customerPhotosObject = getCustomerPhotoObject(customerId);

                if (!customerPhotosObject[treatmentId])
                {
                    customerPhotosObject[treatmentId] = [];
                }

                customerPhotosObject[treatmentId].push(photoUri);
                saveCustomerPhotos(customerId, customerPhotosObject);
            },
            DeleteTreatmentPhoto: function(photoUri, customerId, treatmentId){
                var customerPhotosObject = getCustomerPhotoObject(customerId);
                if (!customerPhotosObject[treatmentId]) {
                    return;
                }

                var photoTreatmentList = customerPhotosObject[treatmentId];
                var deletePhotoIndex = photoTreatmentList.indexOf(photoUri);
                if (deletePhotoIndex == -1){
                    return;
                }

                photoTreatmentList.splice(deletePhotoIndex, 1);
                saveCustomerPhotos(customerId, customerPhotosObject);
            }
        }
    });

    app.factory('treatmentService', [ 'utilitiesService', 'photoService', function(utilitiesService, photoService){
        function Treatment(id, shortDescription, date){
             this.id = id;
             this.shortDescription = shortDescription;
             this.date = date;
             this.images = [];
             this.overlayCoordinates = {'x': [], 'y': []};
        }

        var PublicFunctions = {
            GetTreatmentList: function(customerId){
                return JSON.parse(window.localStorage['treatments-' + customerId]);
            },
            GetTreatment: function(customerId, treatmentId){
                var treatment = JSON.parse(window.localStorage['treatments-' + customerId])[treatmentId];
                treatment.images = photoService.GetPhotosForTreatment(customerId, treatmentId);
                return treatment;
            },
            SaveTreatment: function(treatmentObject){

            },
            SaveTreatmentOverlay: function(treatmentId, overlayUrl){
                window.localStorage[treatmentId + "-overlay"] = overlayUrl;
            },
            GetTreatmentOverlay: function(treatmentId){
                return window.localStorage[treatmentId + "-overlay"];
            },
            CreateDemoTreatments: function(customerId)
            {
                var treatments = {
                    1: new Treatment(1, "Upphafsskoðun", "01.01.2015"),
                    2: new Treatment(2, "Sveppir í vinstri", "16.02.2015"),
                    3: new Treatment(3, "Sveppir á hægri", "05.04.2015"),
                    4: new Treatment(4, "Sigg undir hæl", "12.05.2015"),
                    5: new Treatment(5, "Mæla fyrir innleggi", "01.07.2015"),
                };
                window.localStorage['treatments-' + customerId] = JSON.stringify(treatments);
            }
        }
        return PublicFunctions;
    }]);

    app.factory('customerService', ['utilitiesService', 'treatmentService', 'photoService',
    function(utilitiesService, treatmentService, photoService){
        function Diseases(){
            this.dorsalisPuls = 2;
            this.tibialisPuls = 2;
            this.aedakolkun = false;
            this.aedahnutar = false;
            this.bjugur = false;
            this.blodthinnandiLyf = '';
            this.onnurLyf = '';
            this.sykursyki = 0;
            this.slitGigt = false;
            this.lidaGigt = false;
            this.thvagsyruGigt = false;
            this.gigtAnnad = '';
            this.adrirSjukdomar = '';
        };

        function Customer(customerId) {
            this.id = customerId;
            this.name = "";
            this.imageUri = "";
            this.ssn = "";
            this.phone = "";
            this.email = "";
            this.nextOfKinName = "";
            this.nextOfKinPhone = "";
            this.extraInfo = "";
            this.summary = [];
            this.images = [];
            this.diseases = new Diseases();
        }

        var addSummaryToCustomer = function(customerObject)
        {
            var summary = [];

            if (customerObject.diseases.sykursyki != 0){
                summary.push("Sykursýki");
            }

            if (customerObject.diseases.blodthinnandiLyf != ''){
                summary.push("Blóðþynnandi lyf: " + customerObject.diseases.blodthinnandiLyf);
            }

            if (customerObject.diseases.aedakolkun){
                summary.push("Æðarkölkun");
            }

            if (customerObject.diseases.aedahnutar){
                summary.push("Æðarhnútar");
            }

            if (customerObject.diseases.bjugur){
                summary.push("Bjúgur");
            }

            if (customerObject.diseases.onnurLyf != ""){
                summary.push("Önnur lyf: " + customerObject.diseases.onnurLyf);
            }

            if (customerObject.diseases.slitGigt){
                summary.push("Slitgigt");
            }

            if (customerObject.diseases.lidaGigt){
                summary.push("Liðagigt");
            }

            if (customerObject.diseases.thvagsyruGigt){
                summary.push("Þvagsýrugigt");
            }

            if (customerObject.diseases.gigtAnnad != ""){
                summary.push("Gigt: " + customerObject.diseases.gigtAnnad);
            }

            if (customerObject.diseases.adrirSjukdomar != ""){
                summary.push("Aðrir sjúkdómar: " + customerObject.diseases.adrirSjukdomar);
            }

            customerObject.summary = summary;
        }

        var createDemoCustomers = function(){
            var customerListObjects = {};

            var customerId = utilitiesService.GenerateUuid();
            var customerName = 'Hamstur Þorsteinssons';
            customerListObjects[customerId] = {id:customerId, name: customerName};

            window.localStorage['customerList'] = JSON.stringify(customerListObjects);

            var customer1 = new Customer(customerId);
            customer1.name = customerName;
            customer1.imageURI = "";
            customer1.ssn = "1234567899";
            customer1.phone = "5555555";
            customer1.email = "some@email.com";
            customer1.nextOfKinName = "Hamstur Meistari";
            customer1.nextOfKinPhone = "6666666";
            customer1.annad = "Slæmur í hnjánum";

            var diseases = new Diseases();
            diseases.dorsalisPuls = 1;
            diseases.tibialisPuls = 2;
            diseases.aedakolkun = true;
            diseases.aedahnutar = false;
            diseases.bjugur = true;
            diseases.blodthinnandiLyf = 'Eitthvað gott nafn';
            diseases.onnurLyf = '';
            diseases.sykursyki = 0;
            diseases.slitGigt = true;
            diseases.lidaGigt = false;
            diseases.thvagsyruGigt = false;
            diseases.gigtAnnad = 'Vefjagigt';
            diseases.adrirSjukdomar = '';
            customer1.diseases = diseases;

            addSummaryToCustomer(customer1);

            window.localStorage['customer-' + customerId] = JSON.stringify(customer1);

            treatmentService.CreateDemoTreatments(customerId);
        }

        var PublicFunctions = {
            GetCustomerList: function(){
                if (!window.localStorage['customerList']) {
                    createDemoCustomers();
                }

                return JSON.parse(window.localStorage['customerList']);
            },
            GetCustomer: function(customerId){
                var customer = JSON.parse(window.localStorage['customer-' + customerId]);
                customer.images = photoService.GetPhotosForCustomer(customerId);
                return customer;
            },
            SaveCustomer: function(customerObject){
                if (!customerObject.id)
                {
                    // New customer
                    customerObject.id = utilitiesService.GenerateUuid();
                    window.localStorage['treatments-' + customerObject.id] = JSON.stringify({});
                }

                var customerList = JSON.parse(window.localStorage['customerList']);
                var customerListObject = {id: customerObject.id, name: customerObject.name};
                customerList[customerObject.id] = customerListObject;
                window.localStorage['customerList'] = JSON.stringify(customerList);

                addSummaryToCustomer(customerObject);
                window.localStorage['customer-' + customerObject.id] = JSON.stringify(customerObject);
            },
            NewCustomer: function(){
                return new Customer(utilitiesService.GenerateUuid());
            },
            DeleteData: function(){
                window.localStorage.clear()
            }
        }
        return PublicFunctions;

    }]);

    app.factory('Camera', ['$q', function($q) {
        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    // Do any magic you need
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }
    }]);

