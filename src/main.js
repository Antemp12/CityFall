// Importa todas as cenas do jogo.
import StoryScene from "./scenes/StoryScene.js";
import MenuScene from "./scenes/MenuScene.js";
import OpcoesScene from "./scenes/OpcoesScene.js";
import InstrucoesScene from "./scenes/InstrucoesScene.js";
import GameScene from "./scenes/GameScene.js";
import HUDScene from "./scenes/HUDScene.js";
import TowerScene from "./scenes/TowerScene.js";
import UpgradeScene from "./scenes/UpgradeScene.js";
import GameOverScene from "./scenes/GameOverScene.js";

// Configuração principal do jogo Phaser.
const config = {
    type: Phaser.AUTO, // Define o tipo de renderização (WebGL se disponível, caso contrário Canvas).
    width: 960,        // Largura da tela do jogo.
    height: 540,       // Altura da tela do jogo.
    backgroundColor: "#000000", // Cor de fundo do jogo.

    scale: {
        mode: Phaser.Scale.FIT,           // Modo de escala para ajustar o jogo à tela.
        autoCenter: Phaser.Scale.CENTER_BOTH, // Centraliza o jogo horizontal e verticalmente.
    },
    
    physics: {
        default: 'arcade', // Define o sistema de física padrão como Arcade Physics.
        arcade: {
            debug: false,    // Habilita a depuração visual das caixas de colisão.
        }
    },

    // Lista de todas as cenas do jogo, na ordem em que podem ser iniciadas.
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

// Cria uma nova instância do jogo Phaser com as configurações definidas.
const game = new Phaser.Game(config);
// Exporta a instância do jogo.
export default game;