(function() {

    'use strict';

    //Define o módulo
    angular
        .module('modules.sample.controllers.sample', [
            'modules.common.services.service.security',
            'modules.common.services.factory.appResource',
        ])
        .controller('SampleController', SampleController);

    //Injeta dependencias
    SampleController.$inject = ['newSampleService', 'viewstateService', 'notificacaoService', 'excecaoService', '$location', '$stateParams', '$state', 'securityService', 'appResourceFactory'];

    //Cria o módulo
    function SampleController(newSampleService, viewstateService, notificacaoService, excecaoService, $location, $stateParams, $state, securityService, appResourceFactory) {
        var vm = this;

        //Referencia os metodos disponíveis
        vm.salvarSample = salvarSample;
        vm.removerSample = removerSample;
        vm.editarSample = editarSample;
        vm.novo = novoSample;

        //Instancia variáveis que irão receber os dados
        vm.dados = viewstateService.getView('sample');
        vm.dados.samplesList = vm.dados.samplesList || [];
        vm.dados.sample = vm.dados.sample || {};

        //Exemplo de uma chamada para buscar os dados do usuário e jogar na tela, apenas para mostrar que se uma API
        //estiver protegida para usuario autenticado, mesmo que a página não esteja ele irá interromper para solicitar login
        securityService.requestCurrentUser().then(function (dados) {
            vm.dados.currentUser = dados;
        });

        
        //Carrega dados iniciais
       // getSamples();

        //Se passar um ID, carrega os dados da viagem
        if ($stateParams.id) {
            //Carrega o registro
            var success = function (result) {
                if (result.sample_id) {
                    //Carrega dados no scope
                    if (result.data) {
                        result.data = new Date(result.data);
                    }
                    vm.dados.sample = result;
                } else {
                    notificacaoService.notificar('error', "O sample selecionado não existe na base de dados ou foi excluído.");
                }
           }

           if (isNaN(parseInt($stateParams.id))) {
                notificacaoService.notificar('error', "Não foi informado um número válido de sample para ser carregado.");
           } else {
               newSampleService.carregar({ sample_id: $stateParams.id })
                    .then(success, excecaoService.tratarErro);
            }
        }


        //******************************
        //Abaixo métodos do controle
        //******************************
        function novoSample() {
            viewstateService.newView('sample');
            //$state.go('sample', null);
            $state.go('sample', null, { reload: true });
            
           // $location.path('/sample/new');
        };
        function getSamples() {
            newSampleService.carregar()
                .then(function(result) {
                    vm.dados.samplesList = result;
                });

        };
        function editarSample(sample) {
            $state.go('sampleEdit', { id: sample.sample_id });
        }
        function salvarSample(sample) {
            var params = angular.copy(sample);

            function success (result) {
                notificacaoService.notificar('success', "O sample foi salvo com sucesso.");
                $location.path("/sample/" + result.sample_id);
                //Se atualizou um registro, então o redirect não irá funcionar, apenas recarrega a lista de registros
                if (vm.dados.sample.sample_id == result.sample_id) {
                    getSamples();
                }
            }

            //Salva registro
             newSampleService.salvar(params)
                 .then(success, excecaoService.tratarErro);

        }
        function removerSample(sample_id) {
            if (sample_id) {
                var success = function (result) {
                    notificacaoService.notificar('success', "O sample foi apagado com sucesso.");
                    getSamples();
                }

                //Salva registro
                newSampleService.remover({ sample_id: sample_id })
                    .then(success, excecaoService.tratarErro);
            } else {
                notificacaoService.notificar('warning', "Não foi informado o ID do sample a ser excluído.");
            }
            
        }
    }
})();