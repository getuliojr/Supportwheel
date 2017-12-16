//This function has the objective to confirm an action from the user.
//It runs ng-click only if the user confirm before.

//********************************************************************
//   Confirmation Modal in Material Desing
//********************************************************************
// It will accept the following configuration:
// - title: title : Defaults to "Confirm ? "
// - textContent: Message to ask confirmation for
// - ok: Message to button ok: Defaults to "Yes"
// - cancel: Message to button Cancel: Defaults to "No"
// - ariaLabel: Message for aria label
//********************************************************************

(function () {

    'use strict';

    angular.module('shared.directives.msgConfirm', [

    ])

    .directive('msgConfirm', msgConfirm);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    msgConfirm.$inject = ['$mdDialog', '$filter'];

    function msgConfirm($mdDialog, $filter) {
        return {
            restrict: 'A',
            priority: 100,
            link: {
                //It is inside pre so it can happens before ng-click
                pre: function (scope, element, attrs) {
                    //Get options
                    if (scope.$eval(attrs.msgConfirm) != undefined) {
                        var options = {};
                        if (attrs.msgConfirm) {
                            options = angular.extend({}, scope.$eval("(" + attrs.msgConfirm + ")"));
                        }

                        var title = options.title ? options.title : "MSGCONFIRM.TITLE";
                        var textContent = options.textContent ? options.textContent : "MSGCONFIRM.CONTENT";
                        var ariaLabel = options.ariaLabel ? options.ariaLabel : "MSGCONFIRM.ARIALABEL";
                        var ok = options.ok ? options.ok : "MSGCONFIRM.OK";
                        var cancel = options.cancel ? options.cancel : "MSGCONFIRM.CANCEL";

                        var openConfirm = function (event, title, textContent, ok, cancel, ariaLabel) {

                            //Translate values everytime it will show the modal
                            title = $filter('translate')(title);
                            textContent = $filter('translate')(textContent);
                            ariaLabel = $filter('translate')(ariaLabel);
                            ok = $filter('translate')(ok);
                            cancel = $filter('translate')(cancel);

                            //Generate confirmation dialogin
                            var confirm = $mdDialog.confirm()
                              .targetEvent(event)
                              .title(title)
                              .textContent(textContent)
                              .ok(ok)
                              .cancel(cancel);
                            // .ariaLabel(ariaLabel);

                            //Show dialog
                            $mdDialog.show(confirm).then(modalConfirm, modalCancel);

                            //Confirmation Function
                            function modalConfirm() {
                                //Executes ng-click
                                scope.$eval("(" + attrs.ngClick + ")");
                            }

                            //Cancelation Function
                            function modalCancel() {
                                //Nothing to do
                            }
                        }

                        //Here creates the event for the click
                        element.bind('click touchstart', function (e) {
                            e.stopImmediatePropagation();
                            e.preventDefault();
                            openConfirm(e, title, textContent, ok, cancel, ariaLabel);
                        });
                    }
                }
            }
        }
    }

})();