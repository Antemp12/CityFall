import MenuScene from "./scenes/MenuScene.js";
import OpcoesScene from "./scenes/OpcoesScene.js";
import InstrucoesScene from "./scenes/InstrucoesScene.js";
import GameScene from "./scenes/GameScene.js";
import Player from "./scenes/Player.js";

const config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    backgroundColor: "#000000",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },

    scene: [
        MenuScene,
        OpcoesScene,
        InstrucoesScene,
        GameScene
    ]
};

const game = new Phaser.Game(config);
export default game;