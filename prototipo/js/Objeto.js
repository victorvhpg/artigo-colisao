//@victorvhpg
//Victor Hugo de Paiva Gonçales

var Objeto = (function(util) {
    "use strict";

    var Objeto = function(c) {
        this.x = c.x;
        this.y = c.y;
        this.direcao = c.direcao;
        this.velocidade = c.velocidade;
        this.tamanho = c.tamanho;
        this.largura = this.tamanho;
        this.altura = this.tamanho;
        this.raio = this.tamanho / 2;
        this.tipoEnvoltorio = c.tipoEnvoltorio;
        this.emColisao = false;
        this.cor = "green";
        this.corColisao = "red";
    };

    Objeto.envoltorioTipo = {
        "AABB": 1,
        "Esfera": 2
    };

    Objeto.direcao = {
        NORTE: "NORTE",
        NORDESTE: "NORDESTE",
        LESTE: "LESTE",
        SUDESTE: "SUDESTE",
        SUL: "SUL",
        SUDOESTE: "SUDOESTE",
        OESTE: "OESTE",
        NOROESTE: "NOROESTE"
    };

    Objeto.direcaoValores = {
        NORTE: [0, -1],
        NORDESTE: [1, -1],
        LESTE: [1, 0],
        SUDESTE: [1, 1],
        SUL: [0, 1],
        SUDOESTE: [-1, 1],
        OESTE: [-1, 0],
        NOROESTE: [-1, -1]
    };

    Objeto.getDirRandom = (function() {
        var _vetD = [];
        for (var d in Objeto.direcao) {
            _vetD.push(d);
        }
        return function() {
            var p = util.getRandomInt(0, _vetD.length - 1);
            return Objeto.direcao[_vetD[p]];
        };
    })();


    Objeto.prototype = {
        constructor: Objeto,

        verificaSeColide: function(obj) {
            if (this.tipoEnvoltorio !== obj.tipoEnvoltorio) {
                throw new Error("nao suportado");
            }

            if (this.tipoEnvoltorio === Objeto.envoltorioTipo.AABB) {
                return (this.x < obj.x + obj.largura &&
                    this.x + this.largura > obj.x &&
                    this.y < obj.y + obj.altura &&
                    this.altura + this.y > obj.y);
            } else if (this.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                var dx = this.x - obj.x;
                var dy = this.y - obj.y;
                var distanciaEntrePontos = Math.sqrt(dx * dx + dy * dy);
                return distanciaEntrePontos < this.raio + obj.raio;
            }
        },

        detectaColisaoLimitesCanvas: function(larguraCanvas, alturaCanvas) {
            if (this.tipoEnvoltorio === Objeto.envoltorioTipo.AABB) {
                return {
                    esquerda: (this.x + this.largura) < 0,
                    direita: this.x > larguraCanvas,
                    cima: (this.y + this.altura) < 0,
                    baixo: this.y > alturaCanvas
                };
            } else if (this.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                return {
                    esquerda: (this.x + this.raio) < 0,
                    direita: (this.x - this.raio) > larguraCanvas,
                    cima: (this.y + this.raio) < 0,
                    baixo: (this.y - this.raio) > alturaCanvas
                };

            }
        },

        atualiza: function(dt) {
            var dir = this.direcao;
            var posDir = Objeto.direcaoValores[dir];
            if (posDir[0] !== 0) {
                this.x = this.x + (((this.velocidade * dt) / 1000) * posDir[0]);
            }
            if (posDir[1] !== 0) {
                this.y = this.y + (((this.velocidade * dt) / 1000) * posDir[1]);
            }
        },

        desenhar: function(ctx) {
            ctx.save();
            if (!this.emColisao) {
                ctx.fillStyle = this.cor;
            } else {
                ctx.fillStyle = this.corColisao;
            }

            if (this.tipoEnvoltorio === Objeto.envoltorioTipo.AABB) {
                //    ctx.globalAlpha = 0.1;
                ctx.fillRect(
                    Math.floor(this.x),
                    Math.floor(this.y),
                    this.tamanho,
                    this.tamanho);

            } else if (this.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {

                ctx.beginPath();
                ctx.arc(
                    Math.floor(this.x),
                    Math.floor(this.y),
                    Math.floor(this.raio),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.closePath();


            }
            /*    if (this.listIndicesNaGrid) {
                    ctx.font = '11pt Calibri';

                    ctx.textAlign = 'center';

                    ctx.textBaseline = 'top';
                    ctx.fillStyle = 'yellow';
                    ctx.fillText(this.listIndicesNaGrid, this.x + this.largura/2, this.y + 3);
                }*/
            ctx.restore();
        }
    };

    return Objeto;
})(window.util);
