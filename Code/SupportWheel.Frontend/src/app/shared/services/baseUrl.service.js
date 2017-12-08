import angular from 'angular';

BaseUrlService.$inject = ['$location'];

class BaseUrlService {

    constructor($location) {
        this.$location = $location;
    }

    getBaseUrl() {
        if (this.$location.absUrl().indexOf("http://localhost") != -1)
            return "http://localhost:9000/app/";
        else
            return "/app/";
    }
}

export default angular
    .module('app.shared.services.baseUrl', [])
    .service('baseUrlService', BaseUrlService)
    .name;