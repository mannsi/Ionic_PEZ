angular.module('starter.services', [])

    .factory('dataService', function(){
        return{

            GetCustomerList: function(){

                function generateUUID(){
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = (d + Math.random()*16)%16 | 0;
                        d = Math.floor(d/16);
                        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                    });
                    return uuid;
                };

                if (!window.localStorage['customerList']) {
                    var customers = {};
                    var customerListObjects = {};

                    var id1 = generateUUID();
                    var id2 = generateUUID();
                    var id3 = generateUUID();
                    var id4 = generateUUID();

                    customerListObjects[id1] = {id:id1, name: 'Einar B. Sigurbergsson'};
                    customerListObjects[id2] = {id:id2, name: 'Ari Arason'};
                    customerListObjects[id3] = {id:id3, name: 'Sigga Ragga'};
                    customerListObjects[id4] = {id:id4, name: 'Hamstur Þorsteinssons'};

                    window.localStorage['customerList'] = JSON.stringify(customerListObjects);

                    customers[id1] = {id:id1, name: 'Einar B. Sigurbergsson', imageURI:'', ssn:'1234567899', phone:'5555555', email:'some@email.com', nextOfKinName:'Hamstur Meistari', nextOfKinPhone:'6666666', annad:'Slæmur í hnjánum', dorsalisPuls:1, tibialisPuls:2};
                    customers[id2] = {id:id2, name: 'Ari Arason', imageURI:'', ssn:'1234567899', phone:'5555555', email:'some@email.com', nextOfKinName:'Hamstur Meistari', nextOfKinPhone:'6666666', annad:'Slæmur í hnjánum', dorsalisPuls:1, tibialisPuls:2};
                    customers[id3] = {id:id3, name: 'Sigga Ragga', imageURI:'', ssn:'1234567899', phone:'5555555', email:'some@email.com', nextOfKinName:'Hamstur Meistari', nextOfKinPhone:'6666666', annad:'Slæmur í hnjánum' , dorsalisPuls:1, tibialisPuls:2};
                    customers[id4] = {id:id4, name: 'Hamstur Þorsteinssons', imageURI:'', ssn:'1234567899', phone:'5555555', email:'some@email.com', nextOfKinName:'Hamstur Meistari', nextOfKinPhone:'6666666', annad:'Slæmur í hnjánum' , dorsalisPuls:1, tibialisPuls:2};

                    var diseases = {aedakolkun:true, aedahnutar:false, bjugur:true, blodthinnandiLyf:'Eitthvað gott nafn', onnurLyf:'',
                        sykursyki:0,slitGigt:true, lidaGigt:false, thvagsyruGigt:false, gigtAnnad:'Einhver gigt', adrirSjukdomar:''};

                    customers[id1].diseases = diseases;
                    customers[id2].diseases = diseases;
                    customers[id3].diseases = diseases;
                    customers[id4].diseases = diseases;

                    window.localStorage['customer-' + id1] = JSON.stringify(customers[id1]);
                    window.localStorage['customer-' + id2] = JSON.stringify(customers[id2]);
                    window.localStorage['customer-' + id3] = JSON.stringify(customers[id3]);
                    window.localStorage['customer-' + id4] = JSON.stringify(customers[id4]);

                    var treatments = {
                        1: { id: 1, shortDescription: "Upphafsskoðun", date: "01.01.2015"},
                        2: { id: 2, shortDescription: "Sveppir í vinstri", date: "16.02.2015"},
                        3: { id: 3, shortDescription: "Sveppir á hægri", date: "05.04.2015"},
                        4: { id: 4, shortDescription: "Sigg undir hæl", date: "12.05.2015"},
                        5: { id: 5, shortDescription: "Mæla fyrir innleggi", date: "01.07.2015"}
                    };

                    window.localStorage['treatments-' + id1] = JSON.stringify(treatments);
                    window.localStorage['treatments-' + id2] = JSON.stringify(treatments);
                    window.localStorage['treatments-' + id3] = JSON.stringify(treatments);
                    window.localStorage['treatments-' + id4] = JSON.stringify(treatments);
                }

                return JSON.parse(window.localStorage['customerList']);
            },
            GetCustomer: function(customerId){
                return JSON.parse(window.localStorage['customer-' + customerId]);
            },
            GetDefaultCustomer: function(){
                var defaultCustomer = {id:'', name: '', imageURI:'', ssn:'', phone:'', email:'', nextOfKinName:' ', nextOfKinPhone:'', annad:'', dorsalisPuls:1, tibialisPuls:1};
                defaultCustomer.diseases = {aedakolkun:false, aedahnutar:false, bjugur:false, blodthinnandiLyf:'', onnurLyf:'',
                    sykursyki:0,slitGigt:false, lidaGigt:false, thvagsyruGigt:false, gigtAnnad:'', adrirSjukdomar:''};
                return defaultCustomer;
            },
            SaveCustomer: function(customerObject){
                function generateUUID(){
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = (d + Math.random()*16)%16 | 0;
                        d = Math.floor(d/16);
                        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                    });
                    return uuid;
                };

                if (!customerObject.id)
                {
                    // New customer
                    var newId = generateUUID();
                    customerObject.id = newId;
                    window.localStorage['treatments-' + customerObject.id] = JSON.stringify({});
                }

                var customerList = JSON.parse(window.localStorage['customerList']);
                var customerListObject = {id: customerObject.id, name: customerObject.name};
                customerList[customerObject.id] = customerListObject;
                window.localStorage['customerList'] = JSON.stringify(customerList);
                window.localStorage['customer-' + customerObject.id] = JSON.stringify(customerObject);
            },
            GetTreatmentList: function(customerId){
                return JSON.parse(window.localStorage['treatments-' + customerId]);
            },
            GetTreatment: function(customerId, treatmentId){
                return JSON.parse(window.localStorage['treatments-' + customerId])[treatmentId];
            },
            SaveTreatment: function(treatmentObject){
                // TODO
                function generateUUID(){
                    var d = new Date().getTime();
                    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                        var r = (d + Math.random()*16)%16 | 0;
                        d = Math.floor(d/16);
                        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
                    });
                    return uuid;
                };
            }
        }

    })

    .factory('Camera', ['$q', function($q) {
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