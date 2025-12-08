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

        // 2. TEXTO DE INSTRUÇÕES (Scrollable)
        const instrucoesContent = [
            '--- BEM-VINDO A CITY FALL ---',
            '',
            'Obrigado por defender Neo-VilaMou!',
            '',
            '=== OBJETIVO PRINCIPAL ===',
            'Proteja a Torre de Energia central dos ataques implacáveis dos robôs.',
            'Sobreviva ao máximo de ondas de inimigos que conseguir!',
            '',
            '=== CONTROLES DO GUARDIÃO ===',
            '- Movimento: Teclas W, A, S, D (Cima, Esquerda, Baixo, Direita)',
            '- Ataque: Barra de Espaço (SPACE)',
            '',
            '=== MECÂNICAS DE JOGO ===',
            '- CHIPS: Derrote robôs para coletar CHIPS. Estes são a moeda para melhorar o seu Guardião e a sua Torre.',
            '- A TORRE: Clique na Torre de Energia para aceder a um menu de melhorias e reparos. Invista os seus CHIPS sabiamente!',
            '- INIMIGOS: Os robôs inimigos tentarão destruir a sua Torre e atacarão o Guardião.',
            '- ONDAS: Os robôs atacarão em ondas. A cada nova onda, os inimigos tornam-se mais fortes e numerosos.',
            '',
            '=== DICAS E ESTRATÉGIAS ===',
            '- Priorize melhorias que complementem o seu estilo de jogo (mais dano, mais vida, defesa da torre).',
            '- Mantenha a Torre reparada! É a sua linha de vida.',
            '- Movimente-se constantemente para evitar ataques inimigos e recolher CHIPS.',
            '',
            '=== FIM DE JOGO ===',
            'O jogo termina quando a sua Torre de Energia for destruída.',
            'Quão longe consegue ir?',
            '',
            'Boa sorte, Guardião!',
            '',
            '--- Desfrute da batalha! ---'
        ];

        // Define scrollable area
        const scrollAreaX = centerX;
        const scrollAreaY = 200;
        const scrollAreaWidth = width - 100;
        const scrollAreaHeight = height - 350; // Adjusted height to leave space for title and button

        // Create the text object with all instructions content
        const instructionsText = this.add.text(0, 0, instrucoesContent, {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: scrollAreaWidth },
            lineSpacing: 10
        });

        // Create a container to hold the text
        const textContainer = this.add.container(scrollAreaX, scrollAreaY, [instructionsText]);
        textContainer.setSize(scrollAreaWidth, scrollAreaHeight);
        textContainer.setScrollFactor(0);

        // Set origin for the text within the container
        instructionsText.setOrigin(0.5, 0);
        instructionsText.y = 0; // Initial position at the top of the container

        // Create a graphics object to use as a mask
        const graphics = this.make.graphics();
        graphics.fillRect(scrollAreaX - scrollAreaWidth / 2, scrollAreaY, scrollAreaWidth, scrollAreaHeight);
        const mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
        textContainer.setMask(mask);

        // Make the container interactive to capture scroll events
        const scrollZone = this.add.zone(scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight)
            .setOrigin(0.5, 0)
            .setInteractive();

        let isDragging = false;
        let lastPointerY = 0;

        scrollZone.on('pointerdown', (pointer) => {
            isDragging = true;
            lastPointerY = pointer.y;
        });

        scrollZone.on('pointerup', () => {
            isDragging = false;
        });

        scrollZone.on('pointermove', (pointer) => {
            if (isDragging) {
                const dy = pointer.y - lastPointerY;
                instructionsText.y += dy;
                lastPointerY = pointer.y;
                
                // Clamp text position
                instructionsText.y = Phaser.Math.Clamp(instructionsText.y, textContainer.height - instructionsText.height, 0);
            }
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            instructionsText.y -= deltaY * 0.5; // Adjust scroll speed
            
            // Clamp text position
            instructionsText.y = Phaser.Math.Clamp(instructionsText.y, textContainer.height - instructionsText.height, 0);
        });
        
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