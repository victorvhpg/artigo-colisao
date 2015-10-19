//@victorvhpg
//Victor Hugo de Paiva Gonçales

var GridHash = (function(Objeto) {
    "use strict";

    var GridHash = function() {
        this.tamanhoCelula = 0;
        this.largura = 0;
        this.altura = 0;
        this.tabelaHash = [];
        this.qtdCelulasNaHorizontal = 0;
    };

    GridHash.prototype = {
        constructor: GridHash,

        init: function(c) {
            this.tamanhoCelula = c.tamanhoCelula;
            this.largura = c.largura;
            this.altura = c.altura;
            this.resetTabelaHash();
            this.qtdCelulasNaHorizontal = Math.ceil(this.largura / this.tamanhoCelula);
        },

        //limpa  a tabela hash
        resetTabelaHash: function() {
            var colunas = Math.ceil(this.largura / this.tamanhoCelula);
            var linhas = Math.ceil(this.altura / this.tamanhoCelula);
            this.tabelaHash = new Array(colunas * linhas); //ja define  o tamanho
        },

        desenhaGrid: function(ctx) {
            ctx.save();
            ctx.strokeStyle = "blue";
            for (var linha = this.tamanhoCelula; linha < this.altura; linha += this.tamanhoCelula) {
                ctx.beginPath();
                ctx.moveTo(0, linha);
                ctx.lineTo(this.largura, linha);
                ctx.stroke();
                ctx.closePath();
            }

            for (var coluna = this.tamanhoCelula; coluna < this.largura; coluna += this.tamanhoCelula) {
                ctx.beginPath();
                ctx.moveTo(coluna, 0);
                ctx.lineTo(coluna, this.altura);
                ctx.stroke();
                ctx.closePath();
            }
            ctx.restore();

        },
        //adiciona o obj  na tabelaHash
        //um  obj pode ocupar  mais de um indice na tabelaHash
        addObjetoNaTabelaHash: function(obj) {
            var indicesNaGrid = this.getListIndicesNaGrid(obj);
            for (var i = 0; i < indicesNaGrid.length; i++) {
                if (!this.tabelaHash[indicesNaGrid[i]]) {
                    this.tabelaHash[indicesNaGrid[i]] = [];
                }
                this.tabelaHash[indicesNaGrid[i]].push(obj);
            }
        },

        //retorna o indice que o  ponto  ocupa na  grid
        getIndiceNaGrid: function(ponto) {
            if (ponto.x < 0) {
                ponto.x = 0;
            }
            if (ponto.y < 0) {
                ponto.y = 0;
            }
            if (ponto.x > this.largura) {
                ponto.x = this.largura;
            }
            if (ponto.y > this.altura) {
                ponto.y = this.altura;
            }
            return (
                Math.floor(ponto.x / this.tamanhoCelula) +
                (Math.floor(ponto.y / this.tamanhoCelula) * this.qtdCelulasNaHorizontal)
            );
        },

        //retorna os indices  da grid  que um objeto
        //ocupa
        getListIndicesNaGrid: function(obj) {
            var pontos;

            if (obj.tipoEnvoltorio === Objeto.envoltorioTipo.AABB) {

                pontos = [
                    //esquerda cima
                    {
                        x: obj.x,
                        y: obj.y
                    },
                    //direita cima
                    {
                        x: obj.x + obj.largura,
                        y: obj.y
                    },
                    //esquerda baixo
                    {
                        x: obj.x,
                        y: obj.y + obj.altura
                    },
                    //direita  baixo
                    {
                        x: obj.x + obj.largura,
                        y: obj.y + obj.altura
                    }
                ];

            } else if (obj.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {

                pontos = [
                    //  cima
                    {
                        x: obj.x,
                        y: obj.y - obj.raio
                    },
                    //direita
                    {
                        x: obj.x + obj.raio,
                        y: obj.y
                    },
                    //esquerda
                    {
                        x: obj.x - obj.raio,
                        y: obj.y
                    },
                    //   baixo
                    {
                        x: obj.x,
                        y: obj.y + obj.raio
                    }
                ];

            } else {
                throw new Error("  tipoEnvoltorio invalido");
            }

            var listIndices = [];
            for (var i = 0; i < pontos.length; i++) {
                var indice = this.getIndiceNaGrid(pontos[i]);
                if (listIndices.indexOf(indice) === -1) {
                    listIndices.push(indice);
                }
            }
             //   obj.listIndicesNaGrid = listIndices.join("|");
            return listIndices;
        },

        //retorna todos os  objetos que ocupam alguma
        //celula  que o obj ocupa
        getObjetosVizinhosDeMesmaCelulas: function(obj) {
            var listObjetos = [];
            var indicesNaGrid = this.getListIndicesNaGrid(obj);
            for (var i = 0; i < indicesNaGrid.length; i++) {
                var vizinhos = this.tabelaHash[indicesNaGrid[i]];
                for (var j = 0; j < vizinhos.length; j++) {
                    listObjetos.push(vizinhos[j]);
                }
            }
            return listObjetos;
        }

    };

    return GridHash;
})(window.Objeto);
