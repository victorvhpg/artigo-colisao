var artigo = (function(Ambiente) {

    "use strict";
 

    var _ambiente = new Ambiente();

    var artigo = {

        ambiente: _ambiente,

        getConfigObjeto: function() {
            return {
                totalObjetos: +document.querySelector("#totalObjetos").value,
                tipoEnvoltorio: +document.querySelector("#objEnvoltorioTipo").value,
                objTamanho: {
                    min: +document.querySelector("#objTamMin").value,
                    max: +document.querySelector("#objTamMax").value
                },
                objVelocidade: {
                    min: +document.querySelector("#objVelocMin").value,
                    max: +document.querySelector("#objVelocMax").value
                }
            };
        },

        initAmbiente: function() {
            var tecnicaColisao = +document.querySelector("#objTipoColisao").value;
            var gridTamCelula = +document.querySelector("#gridTamCelula").value;
            _ambiente.init({
                containerCanvas: document.querySelector("#containerCanvas"),
                largura: +document.querySelector("#ambLargura").value,
                altura: +document.querySelector("#ambAltura").value,
                tecnicaColisao: tecnicaColisao,
                gridTamCelula: gridTamCelula
            });
        },

        iniciar: function() {
            //artigo.onGerarObjetos();
            if (_ambiente.listObjetos.length === 0) {
                //alert("nenhum  objeto,por favor crie objetos");
                //return;
                artigo.onGerarObjetos();
            } else {
                this.initAmbiente();
            }
            if (_ambiente.tecnicaColisao === Ambiente.tipoTecnicaColisao.grid) {
                if (_ambiente.objTamanho.max > _ambiente.gridTamCelula) {
                    alert("tamanho da  celula deve ser  maior que  o tamanho maximo do objeto");
                    return;
                }
            }
            _ambiente.start();
        },

        onGerarObjetos: function() {
            artigo.initAmbiente();
            _ambiente.setConfigObjetos(artigo.getConfigObjeto());
            _ambiente.gerarTodosObjetos();
        },

        init: function() {
            //btnGerarObjetos
            document.querySelector("#btnGerarObjetos").addEventListener("click", function() {
                artigo.onGerarObjetos();
            });

           //btnAddObj
            document.querySelector("#btnAddObj").addEventListener("click", function() {
                _ambiente.addObjetos(+document.querySelector("#totalObjetos").value);
                document.querySelector("#totalObjetos").value = _ambiente.listObjetos.length;
            });

            //btnIniciar
            document.querySelector("#btnIniciar").addEventListener("click", function() {
                artigo.iniciar();
            });

            //btnSetarTecnica
            document.querySelector("#btnSetarTecnica").addEventListener("click", function() {
                var tecnicaColisao = +document.querySelector("#objTipoColisao").value;
                var gridTamCelula = +document.querySelector("#gridTamCelula").value;
                if (tecnicaColisao === Ambiente.tipoTecnicaColisao.grid) {
                    var tMax = +document.querySelector("#objTamMax").value;
                    if (tMax > gridTamCelula) {
                        alert("tamanho da  celula deve ser  maior que  o tamanho maximo do objeto");
                        return;
                    }
                }
                _ambiente.tecnicaColisao = tecnicaColisao;
                _ambiente.analise.reset();
            });

            //btnSetarEnvoltorio
            document.querySelector("#btnSetarEnvoltorio").addEventListener("click", function() {
                _ambiente.trocarEnvoltorio(+document.querySelector("#objEnvoltorioTipo").value);
            });

            //ckDesenhaGrid
            document.querySelector("#ckDesenhaGrid").addEventListener("change", function() {
                _ambiente.desenhaGrid = this.checked;
            });

            _ambiente.desenhaGrid = true;
            artigo.iniciar();
        }
    };

    //==============================================================================
    document.addEventListener("DOMContentLoaded", function() {
        artigo.init();
    });
    //==============================================================================

    return artigo;
})(window.Ambiente);
