import angular from 'angular';
import uiRouter from '@uirouter/angularjs';
import 'angular-messages';
import 'angular-animate';
import 'jquery';
import 'font-awesome/css/font-awesome.min.css';
import '../style/app.css';

import Shared from './shared/';
import Components from './components/';
import AppComponent from './app.component';
import AppRun from './app.run';
import AppConstants from './app.constants';
import AppConfig from './app.config';


const requires = [
    'ngMessages',
    'ngAnimate',
    uiRouter,
    Shared,
    Components
];

angular.module('app', requires)
    .component('app', AppComponent)
    .constant('AppConstants', AppConstants)
    .config(AppConfig)
    .run(AppRun);