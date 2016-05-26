//@victorvhpg
//Victor Hugo de Paiva Gonçales

var Ambiente = (function(util, Objeto, GridHash, _analise) {
    "use strict";

    var _tipoTecnicaColisao = {
        grid: 1,
        forcaBruta: 2
    };

    var Ambiente = function() {
        this.listObjetos = [];
        this.canvas = null;
        this.ctx = null;
        this.gridHash = new GridHash();
        this.containerCanvas = null;
        this.desenhaGrid = false;
        this.analise = _analise;
        this.timer = {
            fps: 1000 / 60, // 60  frames por  segundos
            fpsAtual: 0,
            fpsMin: 0,
            fpsMax: 0,
            fpsSoma: 0,
            contFrame: 0,
            tempoAgora: window.performance.now(),
            tempoUltimo: window.performance.now(),
            tempoUltimoLoop: window.performance.now(),
            tempoDiffLoop: 0,
            atualiza: function() {
                this.tempoAgora = window.performance.now();
                this.tempoDiffLoop = this.tempoAgora - this.tempoUltimoLoop;
                this.fpsAtual = 1000 / this.tempoDiffLoop;
                this.fpsSoma += this.fpsAtual;
                this.tempoUltimoLoop = this.tempoAgora;
                var tempoDiff = this.tempoAgora - this.tempoUltimo;
                _analise.fps.push(this.fpsAtual);
                if (this.fpsAtual > 0) {
                    if (this.fpsAtual > this.fpsMax) {
                        this.fpsMax = this.fpsAtual;
                    }
                    if (this.fpsAtual < this.fpsMin || this.fpsMin === 0) {
                        this.fpsMin = this.fpsAtual;
                    }
                }
                if (tempoDiff > 1000) {
                    //    console.log("c" + this.contFrame + "|" + this.fpsAtual + "|max: " + this.fpsMax + "|min:" + this.fpsMin);
                    //    console.log(this.fpsSoma / this.contFrame);
                    this.contFrame = 0;
                    this.fpsMin = 0;
                    this.fpsMax = 0;
                    this.fpsSoma = 0;
                    this.tempoUltimo = this.tempoAgora;
                }
                this.contFrame++;
            }
        };
    };

    Ambiente.tipoTecnicaColisao = _tipoTecnicaColisao;

    Ambiente.prototype = {
        constructor: Ambiente,

        setConfigObjetos: function(c) {
            this.totalObjetos = c.totalObjetos;
            this.tipoEnvoltorio = c.tipoEnvoltorio;
            this.objTamanho = c.objTamanho; //min max
            this.objVelocidade = c.objVelocidade; //min max
        },

        addObjetos: function(quantidade) {
            _analise.reset();
            for (var i = 0; i < quantidade; i++) {
                var tamanho = util.getRandomInt(this.objTamanho.min, this.objTamanho.max);
                var limites = 0;
                if (this.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                    limites = tamanho / 2;
                }
                this.listObjetos.push(new Objeto({
                    x: util.getRandomInt(limites, this.largura - tamanho),
                    y: util.getRandomInt(limites, this.altura - tamanho),
                    tamanho: tamanho,
                    velocidade: util.getRandomInt(this.objVelocidade.min, this.objVelocidade.max),
                    tipoEnvoltorio: this.tipoEnvoltorio,
                    direcao: Objeto.getDirRandom()
                }));
            }
            this.totalObjetos = this.listObjetos.length;
        },

        gerarTodosObjetos: function() {
            //console.log("gerarTodosObjetos");
            this.listObjetos = [];
            this.addObjetos(this.totalObjetos);
        },

        trocarEnvoltorio: function(tipo) {
            _analise.reset();
            this.tipoEnvoltorio = tipo;
            for (var i = 0; i < this.listObjetos.length; i++) {
                this.listObjetos[i].tipoEnvoltorio = tipo;
            }
        },

        colisoes: function(dt) {
            var total = this.listObjetos.length;
            if (this.tecnicaColisao === _tipoTecnicaColisao.grid) {
                this.gridHash.init({
                    tamanhoCelula: this.gridTamCelula,
                    largura: this.largura,
                    altura: this.altura
                });
            }

            for (var i = 0; i < total; i++) {
                var obj = this.listObjetos[i];

                //limites do  canvas
                var limites = obj.detectaColisaoLimitesCanvas(this.largura, this.altura);
                if (limites.cima) {
                    if (obj.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                        obj.y = this.altura - obj.raio;
                    } else { //AABB
                        obj.y = this.altura - obj.altura;
                    }
                }
                if (limites.baixo) {
                    if (obj.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                        obj.y = obj.raio;
                    } else { //AABB
                        obj.y = 0;
                    }
                }
                if (limites.esquerda) {
                    if (obj.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                        obj.x = this.largura - obj.raio;
                    } else { //AABB
                        obj.x = this.largura - obj.largura;
                    }
                }
                if (limites.direita) {
                    if (obj.tipoEnvoltorio === Objeto.envoltorioTipo.Esfera) {
                        obj.x = obj.raio;
                    } else { //AABB
                        obj.x = 0;
                    }
                }
                //verifica  colisao  de todos objetos no  Ambiente
                if (this.tecnicaColisao === _tipoTecnicaColisao.forcaBruta) {
                    for (var j = i + 1; j < total; j++) {
                        var obj2 = this.listObjetos[j];
                        _analise.contTestColisao++;
                        if (obj.verificaSeColide(obj2)) {
                            obj.emColisao = true;
                            obj2.emColisao = true;
                            //break; //pode  colidir com  mais de um ao mesmo tempo entao  nao  pode  ter este  break aqui
                        }
                    }
                } else {
                    //grid
                    this.gridHash.addObjetoNaTabelaHash(obj);
                }
            }

            if (this.tecnicaColisao === _tipoTecnicaColisao.grid) {
                //para  cada  objeto  pega  os vizinhos
                // de mesma celula e verifica  se colide
                var tabelaHash = this.gridHash.tabelaHash;
                for (var i = 0; i < tabelaHash.length; i++) {
                    //objetos  queestao  na  mesma  celula
                    var objetosNaCelula = tabelaHash[i];
                    //se  nao  possui nada  na celula  entao
                    //vai  para o proximo
                    if (!objetosNaCelula) {
                        continue;
                    }
                    //para cada  objeto  verifica  se colide   com
                    //algum vizinho de  mesma  celula, podendo  colidir
                    //com mais de um ao mesmo  tempo
                    for (var j = 0; j < objetosNaCelula.length; j++) {
                        var objA = objetosNaCelula[j];
                        for (var k = j + 1; k < objetosNaCelula.length; k++) {
                            var objB = objetosNaCelula[k];
                            _analise.contTestColisao++;
                            if (objA.verificaSeColide(objB)) {
                                objA.emColisao = true;
                                objB.emColisao = true;
                            }
                        }
                    }
                }
            }
            //var tempo2 = window.performance.now() - tempo1;
            //console.log(tempo2);
        },

        atualiza: function(dt) {
            for (var i = 0, total = this.listObjetos.length; i < total; i++) {
                this.listObjetos[i].atualiza(dt);
                //a cada frame tira a  colisao  para  depois verificar  se ta colidindo
                //no  frame  atual
                this.listObjetos[i].emColisao = false;
            }
        },

        desenhar: function(dt) {
            this.ctx.clearRect(0, 0, this.largura, this.altura);
            //console.log(this.largura, this.altura)
            for (var i = 0, total = this.listObjetos.length; i < total; i++) {
                this.listObjetos[i].desenhar(this.ctx);
            }
            if (this.tecnicaColisao === _tipoTecnicaColisao.grid &&
                this.desenhaGrid) {
                this.gridHash.desenhaGrid(this.ctx);
            }
        },

        loop: function() {
            var that = this;
            this.timer.atualiza();
            var tempoDiff = this.timer.tempoDiffLoop;
            this.atualiza(tempoDiff);
            var tempo1 = window.performance.now();
            this.colisoes();
            var tempo2 = window.performance.now();
            _analise.tempoColisao.push(tempo2 - tempo1);
            _analise.incrementar();
            this.desenhar(tempoDiff);
            this.idLoop = window.setTimeout(function() {
                that.loop();
            }, this.timer.fps);
        },

        start: function() {
            console.log("start");
            _analise.reset();
            window.clearTimeout(this.idLoop);
            this.loop();
        },

        init: function(c) {
            try {
                this.containerCanvas.removeChild(this.canvas);
            } catch (err) {}
            this.largura = c.largura;
            this.altura = c.altura;
            this.tecnicaColisao = c.tecnicaColisao;
            this.gridTamCelula = c.gridTamCelula;
            this.containerCanvas = c.containerCanvas;
            this.canvas = document.createElement("canvas");
            this.ctx = this.canvas.getContext("2d");
            this.canvas.width = this.largura;
            this.canvas.height = this.altura;
            this.containerCanvas.appendChild(this.canvas);
        }
    };

    return Ambiente;
})(window.util, window.Objeto, window.GridHash, window.analise);
