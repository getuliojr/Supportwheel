NG_DOCS={
  "sections": {
    "api": "API",
    "sourceCode": "Source Code",
    "tests": "Tests"
  },
  "pages": [
    {
      "section": "api",
      "id": "components.core",
      "shortName": "components.core",
      "type": "overview",
      "moduleName": "components.core",
      "shortDescription": "Core - Component",
      "keywords": "api application authenticatedmenu chooselanguage click component components core infra-instructure list login overview"
    },
    {
      "section": "api",
      "id": "components.core.auth",
      "shortName": "components.core.auth",
      "type": "overview",
      "moduleName": "components.core.auth",
      "shortDescription": "Auth - Component",
      "keywords": "api app authentication clear clicks component components core credentials enter form icon log modal module overview responsible user"
    },
    {
      "section": "api",
      "id": "components.core.auth.controller:AuthController",
      "shortName": "AuthController",
      "type": "controller",
      "moduleName": "components.core.auth",
      "shortDescription": "Responsable to show the interface for the user to login or logout",
      "keywords": "api app authenticated check clear components controller core credentials current currentuser false form function insert interface isauthenticated logged login logout method modal open responsable returns securityservice service services shared showlogin true user"
    },
    {
      "section": "api",
      "id": "components.core.auth.directive:auth",
      "shortName": "auth",
      "type": "directive",
      "moduleName": "components.core.auth",
      "shortDescription": "This directive render the icons in the screen so the user can interact with the site, login-in or login-out.",
      "keywords": "api components core directive icons interact login-in login-out render screen site user"
    },
    {
      "section": "api",
      "id": "components.core.authenticatedMenu",
      "shortName": "components.core.authenticatedMenu",
      "type": "overview",
      "moduleName": "components.core.authenticatedMenu",
      "shortDescription": "AuthenticatedMenu - Component",
      "keywords": "allowed api authenticated authenticatedmenu component components core itens menu module overview responsible user users"
    },
    {
      "section": "api",
      "id": "components.core.authenticatedMenu.controller:AuthenticatedMenuController",
      "shortName": "AuthenticatedMenuController",
      "type": "controller",
      "moduleName": "components.core.authenticatedMenu",
      "shortDescription": "This controller has just a method that checks if the user is or is not authenticated",
      "keywords": "api authenticated authenticatedmenu check checks components controller core false function internal isauthenticated method returns security securityservice service services shared true user"
    },
    {
      "section": "api",
      "id": "components.core.authenticatedMenu.directive:authenticatedMenu",
      "shortName": "authenticatedMenu",
      "type": "directive",
      "moduleName": "components.core.authenticatedMenu",
      "shortDescription": "This directive render the menu in the screen if the user is authenticated.",
      "keywords": "api authenticated authenticatedmenu components core directive menu render screen user"
    },
    {
      "section": "api",
      "id": "components.core.chooseLanguage",
      "shortName": "components.core.chooseLanguage",
      "type": "overview",
      "moduleName": "components.core.chooseLanguage",
      "shortDescription": "chooseLanguage - Component",
      "keywords": "api choose chooselanguage component components core force language menu modal module overview responsible selected site user"
    },
    {
      "section": "api",
      "id": "components.core.chooseLanguage.controller:ChooseLanguageController",
      "shortName": "ChooseLanguageController",
      "type": "controller",
      "moduleName": "components.core.chooseLanguage",
      "shortDescription": "This controller is responsible to mainly to allow the user to change the current language in the site",
      "keywords": "allow api application change changelanguage chooselanguage components controller core culture current currente expect format function getname language pt-br responsable responsible returns selected service services set shared site user"
    },
    {
      "section": "api",
      "id": "components.core.chooseLanguage.directive:chooseLanguage",
      "shortName": "chooseLanguage",
      "type": "directive",
      "moduleName": "components.core.chooseLanguage",
      "shortDescription": "This directive render the template for the menu for the user to choose a language for the application.",
      "keywords": "api application choose chooselanguage components core directive language menu render template user"
    },
    {
      "section": "api",
      "id": "components.core.login",
      "shortName": "components.core.login",
      "type": "overview",
      "moduleName": "components.core.login",
      "shortDescription": "Login - Component",
      "keywords": "api component components core description details directive form login module overview responsible user"
    },
    {
      "section": "api",
      "id": "components.core.login.controller:LoginController",
      "shortName": "LoginController",
      "type": "controller",
      "moduleName": "components.core.login",
      "shortDescription": "Responsable to make the login, getLoginReason and getLastAuthError available from the securityService",
      "keywords": "api application attempt authentication components controller core error function getlastautherror getloginreason internal login loginerror loginreason method reason required responsable securityservice send sends server service services shared user"
    },
    {
      "section": "api",
      "id": "components.core.login.directive:login",
      "shortName": "login",
      "type": "directive",
      "moduleName": "components.core.login",
      "shortDescription": "This directive render a login form for the user to login with e-mail and password.",
      "keywords": "api components core directive e-mail form login password render user valid validades"
    },
    {
      "section": "api",
      "id": "components.instituicao",
      "shortName": "components.instituicao",
      "type": "overview",
      "moduleName": "components.instituicao",
      "shortDescription": "Instituicao - Component",
      "keywords": "api click component componentes components compose functionalities hold instituicao instituicaolist instituitions list maintain overview registers screen"
    },
    {
      "section": "api",
      "id": "components.instituicao.instituicaoList",
      "shortName": "components.instituicao.instituicaoList",
      "type": "overview",
      "moduleName": "components.instituicao.instituicaoList",
      "shortDescription": "InstituicaoList - Component",
      "keywords": "api component components instituicao instituicaolist instituicoes institutions list module overview responsible"
    },
    {
      "section": "api",
      "id": "components.instituicao.instituicaoList.controller:InstituicaoListController",
      "shortName": "InstituicaoListController",
      "type": "controller",
      "moduleName": "components.instituicao.instituicaoList",
      "shortDescription": "This controller just exists to get bindToController working",
      "keywords": "api bindtocontroller components controller exists instituicao instituicaolist working"
    },
    {
      "section": "api",
      "id": "components.instituicao.instituicaoList.directive:instituicaoList",
      "shortName": "instituicaoList",
      "type": "directive",
      "moduleName": "components.instituicao.instituicaoList",
      "shortDescription": "This directive expects to receive a collection of institutions to to render it as a list",
      "keywords": "api collection components country directive expect expects instituicao instituicaolist instituicoes institution institutions list objects properties receive render"
    },
    {
      "section": "api",
      "id": "shared.services.service.service:culture",
      "shortName": "culture",
      "type": "service",
      "moduleName": "shared.services.service",
      "shortDescription": "This service is responsable to get and set current culture for the application",
      "keywords": "$localstorage $mddialog $translate angular-material angular-translate api application browser canceled choose closed culture current expect format function getculture https init inits language loading localstorage modal ngstorage object properties pt-br reads responsable result returns saves selected service services set setculture shared source user"
    },
    {
      "section": "api",
      "id": "shared.services.service.service:security",
      "shortName": "security",
      "type": "service",
      "moduleName": "shared.services.service",
      "shortDescription": "This service is responsible for the authentication features in the site.",
      "keywords": "api authentication client credentials expect features filled function interface login object password promise properties required resolved response responsible returns send server service services shared site user username"
    },
    {
      "section": "sourceCode",
      "id": "files",
      "shortName": "files",
      "type": "overview",
      "moduleName": "files",
      "shortDescription": "Source Code",
      "keywords": "access code easily files follow generated grunt-docco-dir html https link map overview parsed read site sitemap source sourcecode"
    },
    {
      "section": "tests",
      "id": "Coverage Tests",
      "shortName": "Coverage Tests",
      "type": "overview",
      "moduleName": "Coverage Tests",
      "shortDescription": "Coverage Tests for the Front-end",
      "keywords": "check coverage created docs documentation follow format front-end generated global html install installed karma karma-cli link npm overview recommended report runner solution system test tests type unit version"
    },
    {
      "section": "tests",
      "id": "Unit Tests",
      "shortName": "Unit Tests",
      "type": "overview",
      "moduleName": "Unit Tests",
      "shortDescription": "Unit Tests for the Front-end",
      "keywords": "check created docs documentation follow format front-end generated global html install installed karma karma-cli link npm overview recommended report runner running single solution start system tests time type unit version"
    }
  ],
  "apis": {
    "api": true,
    "sourceCode": false,
    "tests": false
  },
  "html5Mode": false,
  "editExample": true,
  "startPage": "/api",
  "scripts": [
    "angular.js",
    "angular-touch.js",
    "angular-animate.js"
  ]
};