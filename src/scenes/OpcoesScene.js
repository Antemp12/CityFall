// OpcoesScene.js

// Certifique-se de que importa o Phaser se necessário
// import Phaser from 'phaser'; 

export default class OpcoesScene extends Phaser.Scene {
// ^^^^^^^^^^^^^^^ ESTE É O EXPORT DEFAULT QUE ESTÁ A FALTAR

    constructor() {
        // Altere 'OpcoesScene' para o nome exato da chave (key) que usa
        super('OpcoesScene'); 
    }

    preload() {
        // Carregamento de recursos aqui
    }

    create() {
        // Lógica de criação da cena (título, botões, etc.) aqui
        
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;
        
        // Exemplo de Conteúdo Mínimo
        this.add.text(centerX, 150, 'Página de Opções', { 
            fontSize: '40px', 
            fill: '#ffffff'
        }).setOrigin(0.5);

        // BOTÃO DE VOLTAR: essencial para sair da cena
        const backButton = this.add.text(centerX, height - 80, '< VOLTAR AO MENU', { 
            fontSize: '32px', 
            fill: '#c3c3c3'
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('MenuScene'); 
        });
    }
}