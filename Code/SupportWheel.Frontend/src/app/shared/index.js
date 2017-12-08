import angular from 'angular';

import SharedServiceModule from './services';


let sharedModule = angular.module('app.shared', [
    SharedServiceModule
  
])
.name;

export default sharedModule;