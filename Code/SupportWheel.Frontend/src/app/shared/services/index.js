import angular from 'angular';

import BaseUrlService from './baseUrl.service.js';
import HubService from './hub.service.js';
import MediatorService from './mediator.service.js';
import NotificationService from './notification.service.js';
import RetryQueueService from './retryQueue.service.js';
import SecurityService from './security.service.js';
import UsuarioService from './usuario.service.js';
import WebApiService from './webApi.service.js';
import ViewstateService from './viewstate.service.js';
import ExceptionService from './exception.service.js';
import InterceptorService from './interceptor.service.js';
import AuthorizationProvider from './authorization.provider.js';

let sharedServiceModule = angular.module('app.shared.services', [

    BaseUrlService,
    HubService,
    MediatorService,
    NotificationService,
    RetryQueueService,
    SecurityService,
    UsuarioService,
    WebApiService,
    ExceptionService,
    InterceptorService,
    AuthorizationProvider

])
    .name;

export default sharedServiceModule;