import MenuScene from "./scenes/MenuScene.js";
import OpcoesScene from "./scenes/OpcoesScene.js";
import InstrucoesScene from "./scenes/InstrucoesScene.js";
import GameScene from "./scenes/GameScene.js";
import HUDScene from "./scenes/HUDScene.js";
import TowerScene from "./scenes/TowerScene.js";
import UpgradeScene from "./scenes/UpgradeScene.js";

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
            debug: true
        }
    },

    scene: [
        MenuScene,
        OpcoesScene,
        InstrucoesScene,
        GameScene,
        HUDScene,
        TowerScene,
        UpgradeScene
    ]
};

const game = new Phaser.Game(config);
export default game;