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

    angular.module('directives.msgConfirm', [

    ])

    .directive('msgConfirm', msgConfirm);

    //************************************
    //  Diretiva
    //************************************

    //Injeta dependencias da diretiva
    msgConfirm.$inject = ['$mdDialog'];

    function msgConfirm($mdDialog) {
        return {
            restrict: 'A',
            priority: 100,
            link: {
                //It is inside pre so it can happens before ng-click
                pre: function (scope, element, attrs) {
                    var options = angular.extend({}, scope.$eval("(" + attrs.msgConfirm + ")")); //Get options

                    var title = options.title ? options.title : "Confirm ?";
                    var textContent = options.textContent ? options.textContent : "Are you sure you want to proceed with this action ?";
                    var ariaLabel = options.ariaLabel ? options.ariaLabel : "Do you confirm this action ?";
                    var ok = options.ok ? options.ok : "Yes";
                    var cancel = options.cancel ? options.cancel : "No";
                    //var event = options.event ? options.event : undefined;
                    
                    var openConfirm = function (event, title, textContent, ok, cancel, ariaLabel) {
                        //Generate confirmation dialogin
                        var confirm = $mdDialog.confirm()
                          .targetEvent(event)
                          .title(title)
                          .content(textContent) //Will get deprecated for .textContent in future releases
                          .ok(ok)
                          .cancel(cancel);
                         // .ariaLabel(ariaLabel);
                          
                        //Show dialog
                        $mdDialog.show(confirm).then(modalConfirm, modalCancel);

                        //Confirmation Function
                        function modalConfirm(){
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

})();