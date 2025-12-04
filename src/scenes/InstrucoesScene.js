// InstrucoesScene.js

export default class InstrucoesScene extends Phaser.Scene {
    
    constructor() {
        super('InstrucoesScene'); 
    }

    preload() {
        // Se a sua cena de instruções tiver um fundo ou imagens próprias, carregue-as aqui.
    }

    create() {
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;
        
        // 1. TÍTULO DA CENA
        this.add.text(centerX, 80, 'INSTRUÇÕES DE JOGO', { 
            fontSize: '48px', 
            fill: '#ffde3d', // Amarelo
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 2. TEXTO DE INSTRUÇÕES
        const instrucoesText = [
            'O objetivo é apanhar todos os cogumelos dourados.',
            'Use as setas (cima, baixo, esquerda, direita) para mover o jogador.',
            'Pressione ESPAÇO para saltar.',
            'Evite os inimigos vermelhos!',
            '',
            'Divirta-se!'
        ];

        this.add.text(centerX, 200, instrucoesText, { 
            fontSize: '24px', 
            fill: '#ffffff', // Branco
            align: 'center',
            lineSpacing: 10
        }).setOrigin(0.5);
        
        // 3. BOTÃO "VOLTAR"
        let yButton = height - 80;
        
        const backButton = this.add.text(centerX, yButton, '< VOLTAR AO MENU', { 
            fontSize: '32px', 
            fill: '#c3c3c3'
        })
        .setOrigin(0.5)
        .setPadding(10)
        .setInteractive({ useHandCursor: true }); 
        
        // --- Interação do Botão (Hover e Clique) ---
        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ffde3d' }); 
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#c3c3c3' }); 
        });

        backButton.on('pointerdown', () => {
            // Transição para a MenuScene, usando a chave 'MenuScene'
            this.scene.start('MenuScene'); 
        });
    }
}       