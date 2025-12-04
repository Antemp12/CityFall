// MenuScene.js

export default class MenuScene extends Phaser.Scene {
    
    constructor() {
        super('MenuScene'); 
    }

    // --- 1. PRELOAD: Carregamento do Vídeo ---
    preload() {
        // Altere este caminho e nome de ficheiro se o seu vídeo estiver noutro local!
        this.load.video('menuVideo', 'assets/images/menu/cityFall.mp4'); 
    }

    // --- 2. CREATE: Criação de Objetos (Vídeo e Botões) ---
    create() {
        // 1. Declaração de Variáveis de Dimensão e Posição
        const { width, height } = this.sys.game.config; // 960x540
        const centerX = width / 2;
        const centerY = height / 2;
        
        // =================================================================
        // 2. FUNDO DE VÍDEO (Com correção de Proporção)
        // =================================================================
        
        const video = this.add.video(centerX, centerY, 'menuVideo');
        
        // Usa o evento 'readyforplay' para garantir que o vídeo está pronto para ser dimensionado e reproduzido.
        video.on('readyforplay', () => {
            
            // Lógica de dimensionamento (Cover method): Mantém a proporção e preenche a tela.
            const scaleX = width / video.videoWidth;
            const scaleY = height / video.videoHeight;
            const scale = Math.max(scaleX, scaleY); // Usa o maior fator para cobrir
            
            video.setScale(scale);
            video.setOrigin(0.5); 
            
            // Inicia a reprodução (loop, mute)
            video.play(true, true); 
        });

        // =================================================================
        // 3. TÍTULO e ESTRUTURA DOS BOTÕES
        // =================================================================

        // Título
        this.add.text(centerX, 100, 'O MEU JOGO', { 
            fontSize: '56px', 
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        let yOffset = 200;
        const spacing = 50; 
        
        // --- Função Auxiliar para Criar Botões ---
        const createButton = (text, targetScene) => {
            const button = this.add.text(centerX, yOffset, text, { 
                fontSize: '32px', 
                fill: '#c3c3c3' // Cor padrão
            })
            .setOrigin(0.5)
            .setPadding(10)
            .setInteractive({ useHandCursor: true }); 
            
            yOffset += spacing;
            
            // Interação do Botão (Hover e Clique)
            button.on('pointerover', () => {
                button.setStyle({ fill: '#ffde3d' }); // Amarelo ao passar o rato
            });

            button.on('pointerout', () => {
                button.setStyle({ fill: '#c3c3c3' }); // Volta à cor padrão
            });

            button.on('pointerdown', () => {
                // Inicia a cena correspondente
                this.scene.start(targetScene); 
            });
            
            return button;
        };
        
        // =================================================================
        // 4. CRIAÇÃO DOS BOTÕES
        // =================================================================
        
        createButton('COMEÇAR JOGO', 'GameScene'); 
        createButton('INSTRUÇÕES', 'InstrucoesScene'); 
        createButton('OPÇÕES', 'OpcoesScene'); 
    }
}