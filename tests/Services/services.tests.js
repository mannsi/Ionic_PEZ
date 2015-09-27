describe('filePersistTest', function(){
    beforeEach(module('starter.services'));

    it('can get an instance of my factory', inject(function(photosService) {
        expect(photosService).toBeDefined();
    }));

    it('photos persistance test', inject(function(photosService, utilitiesService) {
        var photoUri1 = utilitiesService.GenerateUuid();
        var photoUri2 = utilitiesService.GenerateUuid();
        var photoUri3 = utilitiesService.GenerateUuid();
        var customerId = utilitiesService.GenerateUuid();
        var treatmentId1 = utilitiesService.GenerateUuid();
        var treatmentId2 = utilitiesService.GenerateUuid();

        photosService.SaveTreatmentPhoto(photoUri1, customerId, treatmentId1);
        photosService.SaveTreatmentPhoto(photoUri2, customerId, treatmentId1);
        photosService.SaveTreatmentPhoto(photoUri3, customerId, treatmentId2);

        var customerPhotos = photosService.GetPhotosForCustomer(customerId);
        var treatment1Photos = photosService.GetPhotosForTreatment(customerId, treatmentId1);
        var treatment2Photos = photosService.GetPhotosForTreatment(customerId, treatmentId2);

        expect(customerPhotos.length).toEqual(3);
        expect(customerPhotos.indexOf(photoUri1)).toBeGreaterThan(-1);
        expect(customerPhotos.indexOf(photoUri2)).toBeGreaterThan(-1);
        expect(customerPhotos.indexOf(photoUri3)).toBeGreaterThan(-1);

        expect(treatment1Photos.length).toEqual(2);
        expect(treatment1Photos.indexOf(photoUri1)).toBeGreaterThan(-1);
        expect(treatment1Photos.indexOf(photoUri2)).toBeGreaterThan(-1);

        expect(treatment2Photos.length).toEqual(1);
        expect(treatment2Photos.indexOf(photoUri3)).toBeGreaterThan(-1);

        photosService.DeleteTreatmentPhoto(photoUri2, customerId, treatmentId1);
        customerPhotos = photosService.GetPhotosForCustomer(customerId);
        treatment1Photos = photosService.GetPhotosForTreatment(customerId, treatmentId1);
        expect(customerPhotos.length).toEqual(2);
        expect(customerPhotos.indexOf(photoUri2)).toEqual(-1);
        expect(treatment1Photos.length).toEqual(1);
        expect(treatment1Photos.indexOf(photoUri2)).toEqual(-1);
    }));


    //it('can get an instance of my factory', inject(function(Friends) {
    //    expect(Friends).toBeDefined();
    //}));

    //it('has 5 chats', inject(function(Friends) {
    //    expect(Friends.all().length).toEqual(5);
    //}));
    //
    //it('has Max as friend with id 1', inject(function(Friends) {
    //    var oneFriend = {
    //        id: 1,
    //        name: 'Max Lynx',
    //        notes: 'Odd obsession with everything',
    //        face: 'https://avatars3.githubusercontent.com/u/11214?v=3&amp;s=460'
    //    };
    //
    //    expect(Friends.get(1).name).toEqual(oneFriend.name);
    //}));
});