// scenes/Menu.js

export default class Menu extends Phaser.Scene { 
    
    constructor() {
        super('Menu'); // O nome da Scene no sistema Phaser
    }

    // --- PRELOAD ---
    preload() {
        // Carrega o vídeo cityFall.mp4 (Assumido: assets/videos/cityFall.mp4)
        this.load.video('fundo_video', 'assets/videos/cityFall.mp4', 'canplaythrough', false, true); 
    }

    // --- CREATE ---
    create() {
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;

        // 1. Fundo de VÍDEO MP4
        let fundoVideo = this.add.video(centerX, height / 2, 'fundo_video');
        fundoVideo.setDisplaySize(width, height); 
        fundoVideo.play(true); 
        
        fundoVideo.setAlpha(0); 
        fundoVideo.on('complete', () => {
            fundoVideo.setAlpha(1);
        });

        // 2. Título "CITY FALL" (Simulação Neon)
        this.add.text(centerX, height * 0.25, 'CITY FALL', {
            fontSize: '80px', 
            fill: '#00FFFF', 
            stroke: '#0000FF',
            strokeThickness: 10,
            shadow: { color: '#00FFFF', blur: 20, stroke: true, fill: true }
        }).setOrigin(0.5).setDepth(1); 
        
        // 3. Estilo Comum dos Botões
        const buttonTextStyle = { 
            fontSize: '28px', fill: '#FFFFFF', stroke: '#000000', strokeThickness: 5
        };

        const buttonY1 = height * 0.5;
        const buttonY2 = buttonY1 + 70;
        const buttonY3 = buttonY2 + 70;

        // --- Botões (Chamam a função createButtonText) ---
        this.createButtonText(centerX, buttonY1, 'INICIAR JOGO', buttonTextStyle,
            () => { 
                // Iniciar a Scene de Jogo
                this.scene.start('NivelJogoScene'); 
            }
        );
        this.createButtonText(centerX, buttonY2, 'OPÇÕES', buttonTextStyle, () => { console.log('A abrir Opções'); });
        this.createButtonText(centerX, buttonY3, 'INSTRUÇÕES', buttonTextStyle, () => { console.log('A abrir Instruções'); });
        
        // 4. Ícones de Ajuda ('?')
        const iconStyle = { fontSize: '30px', fill: '#00FFFF' };
        
        this.add.circle(width - 40, 40, 15, 0x000000, 0.5).setDepth(1);
        this.add.text(width - 40, 40, '?', iconStyle).setOrigin(0.5).setInteractive().setDepth(1);

        this.add.circle(width - 40, 100, 15, 0x000000, 0.5).setDepth(1);
        this.add.text(width - 40, 100, '?', iconStyle).setOrigin(0.5).setInteractive().setDepth(1);
    }
    
    // --- Função Auxiliar para Criar Botões de Texto/Retângulo ---
    createButtonText(x, y, text, style, callback) {
        let buttonBackground = this.add.rectangle(x, y, 300, 50, 0x222222, 0.8) 
            .setStrokeStyle(3, 0x00FFFF, 1) 
            .setInteractive()
            .setDepth(1);
            
        this.add.text(x, y, text, style).setOrigin(0.5).setDepth(1);

        buttonBackground.on('pointerdown', callback);
        buttonBackground.on('pointerover', () => buttonBackground.setFillStyle(0x444444, 0.8));
        buttonBackground.on('pointerout', () => buttonBackground.setFillStyle(0x222222, 0.8));
        
        return buttonBackground;
    }
}