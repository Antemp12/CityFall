// InstrucoesScene.js

export default class InstrucoesScene extends Phaser.Scene {
    
    constructor() {
        super('InstrucoesScene'); 
    }

    preload() {
        // Preload any assets specific to the instructions scene here, like background images or UI elements.
        // Currently, no specific assets are preloaded for this scene, as it primarily uses text and generated graphics.
    }

    create() {
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;
        
        // 1. SCENE TITLE
        this.add.text(centerX, 80, 'INSTRUÇÕES DE JOGO', { 
            fontSize: '48px', 
            fill: '#ffde3d', // Yellow
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // 2. INSTRUCTIONS TEXT (Scrollable)
        // Content of the instructions, stored as an array of strings.
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

        // Define the dimensions and position for the scrollable area.
        const scrollAreaX = centerX;
        const scrollAreaY = 200;
        const scrollAreaWidth = width - 100; // Leave 50px padding on each side
        const scrollAreaHeight = height - 350; // Adjusted height to leave space for title and button

        // Create the text object with all instructions content,
        // it will be placed inside a container and masked.
        const instructionsText = this.add.text(0, 0, instrucoesContent, {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: scrollAreaWidth }, // Wrap text within the scroll area width
            lineSpacing: 10 // Spacing between lines
        });

        // Create a container to hold the text. This container will be masked and will manage the text's position.
        const textContainer = this.add.container(scrollAreaX, scrollAreaY, [instructionsText]);
        textContainer.setSize(scrollAreaWidth, scrollAreaHeight); // Set the visible size of the container
        textContainer.setScrollFactor(0); // Ensure the container does not scroll with the camera

        // Set origin for the text within the container to be centered horizontally at the top.
        instructionsText.setOrigin(0.5, 0);
        instructionsText.y = 0; // Initial vertical position at the top of the container

        // Create a graphics object to define the mask shape.
        const graphics = this.make.graphics();
        graphics.fillRect(scrollAreaX - scrollAreaWidth / 2, scrollAreaY, scrollAreaWidth, scrollAreaHeight);
        // Create a geometry mask from the graphics object and apply it to the text container.
        const mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
        textContainer.setMask(mask);

        // Create an interactive zone over the scrollable area to capture pointer events for scrolling.
        const scrollZone = this.add.zone(scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight)
            .setOrigin(0.5, 0) // Center horizontally, top-aligned vertically
            .setInteractive(); // Make the zone interactive

        let isDragging = false; // Flag to track if the pointer is currently dragging
        let lastPointerY = 0;   // Stores the last known Y position of the pointer during a drag

        // Event listener for when the pointer starts pressing down on the scroll zone.
        scrollZone.on('pointerdown', (pointer) => {
            isDragging = true;    // Set dragging flag to true
            lastPointerY = pointer.y; // Record initial Y position
        });

        // Event listener for when the pointer is released from the scroll zone.
        scrollZone.on('pointerup', () => {
            isDragging = false; // Set dragging flag to false
        });

        // Event listener for when the pointer moves over the scroll zone.
        scrollZone.on('pointermove', (pointer) => {
            if (isDragging) {
                const dy = pointer.y - lastPointerY; // Calculate vertical difference
                instructionsText.y += dy;             // Move the text vertically
                lastPointerY = pointer.y;             // Update last Y position
                
                // Clamp text position to keep it within the scrollable area.
                // The text's top edge (y=0) should not go below the container's top,
                // and its bottom edge should not go above the container's bottom.
                instructionsText.y = Phaser.Math.Clamp(instructionsText.y, textContainer.height - instructionsText.height, 0);
            }
        });

        // Event listener for mouse wheel scrolling.
        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            // Adjust text position based on wheel delta (scroll speed scaled by 0.5).
            instructionsText.y -= deltaY * 0.5;
            
            // Clamp text position, similar to drag clamping.
            instructionsText.y = Phaser.Math.Clamp(instructionsText.y, textContainer.height - instructionsText.height, 0);
        });
        
                // Calculate the Y position for the button.
                let yButton = height - 80;
                
                // Create the "Back to Menu" button text.
                const backButton = this.add.text(centerX, yButton, '< VOLTAR AO MENU', {
                    fontSize: '32px',
                    fill: '#c3c3c3' // Default text color (gray)
                })
                .setOrigin(0.5) // Center the origin
                .setPadding(10) // Add padding around the text for better hit area
                .setInteractive({ useHandCursor: true }); // Make the text interactive and show a hand cursor on hover
                
                // --- Button Interaction (Hover and Click) ---
                // Event listener for when the pointer hovers over the button.
                backButton.on('pointerover', () => {
                    backButton.setStyle({ fill: '#ffde3d' }); // Change text color to yellow on hover
                });
        
                // Event listener for when the pointer leaves the button.
                backButton.on('pointerout', () => {
                    backButton.setStyle({ fill: '#c3c3c3' }); // Revert text color to gray
                });
        
                // Event listener for when the button is clicked.
                backButton.on('pointerdown', () => {
                    // Transition to the MenuScene.
                    this.scene.start('MenuScene'); 
                });    }
}       