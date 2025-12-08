import StoryScene from "./scenes/StoryScene.js";
import MenuScene from "./scenes/MenuScene.js";
import OpcoesScene from "./scenes/OpcoesScene.js";
import InstrucoesScene from "./scenes/InstrucoesScene.js";
import GameScene from "./scenes/GameScene.js";
import HUDScene from "./scenes/HUDScene.js";
import TowerScene from "./scenes/TowerScene.js";
import UpgradeScene from "./scenes/UpgradeScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

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
        StoryScene,
        OpcoesScene,
        InstrucoesScene,
        GameScene,
        HUDScene,
        TowerScene,
        UpgradeScene,
        GameOverScene
    ]
};

const game = new Phaser.Game(config);
export default game;