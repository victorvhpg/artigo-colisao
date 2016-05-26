//@victorvhpg
//Victor Hugo de Paiva Gonçales

var analise = (function() {
    "use strict";
    var analise = {
        loops: 0,
        totalTesteColisao: [],
        tempoColisao: [],
        fps: [],
        contTestColisao: 0,
        somaTestColisao: [],
        totalLoops: 500,
        reset: function() {
            console.log("reset analise");
            this.loops = 0;
            this.totalTesteColisao = [];
            this.tempoColisao = [];
            this.fps = [];
            this.contTestColisao = 0;
            this.somaTestColisao = [];
        },

        incrementar: function() {
            this.loops++;
            this.somaTestColisao.push(this.contTestColisao);
            //    console.log(this.contTestColisao);
            this.contTestColisao = 0;
            if (this.loops >= this.totalLoops) {
                this.getAnalise();
                this.reset();
            }
        },

        getAnalise: function() {
            var somaT = this.tempoColisao.reduce(function(a, b) {
                return a + b;
            });
            var somaFps = this.fps.reduce(function(a, b) {
                return a + b;
            });
            var somaContColisao = this.somaTestColisao.reduce(function(a, b) {
                return a + b;
            });
            //    console.log(" this.somaTestColisao.length = " +  this.somaTestColisao.length);
            //    console.log(" soma = " +  somaContColisao);
            //    console.log( this.somaTestColisao)

            var log = ["-Total de frames para análise: " + this.loops,
                "-Total de testes de colisão: " + (somaContColisao / this.somaTestColisao.length),
                "-Média fps " + (somaFps / this.fps.length),
                "-Média de tempo(ms)  nos  testes  de colisão: " + (somaT / this.tempoColisao.length)
            ];
            console.log(log.join("\n"));
            document.querySelector("#log").innerHTML = log.join("<br />");
        }
    };
    return analise;
})();
