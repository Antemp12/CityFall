import MenuScene from "./scenes/MenuScene.js";
import OpcoesScene from "./scenes/OpcoesScene.js";
import InstrucoesScene from "./scenes/InstrucoesScene.js";
import GameScene from "./scenes/GameScene.js";
import HUDScene from "./scenes/HUDScene.js"; // NOVO: HUDScene

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: "#000000",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    
    // ATIVAÇÃO DO SISTEMA DE FÍSICA
    physics: {
        default: 'arcade',
        arcade: {
            debug: false // Mude para true para ver as caixas de colisão
        }
    },

    scene: [
        MenuScene,
        OpcoesScene,
        InstrucoesScene,
        GameScene, // Cena do Jogo
        HUDScene   // HUD por cima
    ]
};

const game = new Phaser.Game(config);
export default game;