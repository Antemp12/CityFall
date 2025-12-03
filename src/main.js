// main.js

import Menu from './scenes/Menu.js'; 
import NivelJogoScene from './scenes/NivelJogoScene.js'; // Adicione a Scene de Jogo

// Definição das configurações do jogo
const config = {
    type: Phaser.AUTO,
    width: 1280, 
    height: 720, 
    scene: [
        Menu, 
        NivelJogoScene // Scene de Jogo
    ],
    physics: {
        default: 'arcade', // Usando Arcade Physics
        arcade: {
            debug: false 
        }
    }
};

// Criação da instância do jogo
const game = new Phaser.Game(config);