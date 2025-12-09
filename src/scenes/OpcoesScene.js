// OpcoesScene.js
// This scene serves as an options menu where players can potentially adjust game settings.

// Ensures Phaser is available if needed, though it's typically globally available in a Phaser project.
// import Phaser from 'phaser'; 

export default class OpcoesScene extends Phaser.Scene {

    // Constructor for the Options Scene.
    constructor() {
        // Assigns a unique key to this scene, used for starting and stopping it.
        super('OpcoesScene'); 
    }

    preload() {
        // No specific assets are preloaded for this scene at the moment.
        // If there were background images, UI elements, or sounds, they would be loaded here.
    }

    create() {
        // Retrieve the game's width and height from the configuration.
        const { width, height } = this.sys.game.config;
        // Calculate the horizontal center of the screen.
        const centerX = width / 2;
        
        // Display the scene title "Página de Opções" (Options Page).
        this.add.text(centerX, 150, 'Página de Opções', { 
            fontSize: '40px', 
            fill: '#ffffff' // White color
        }).setOrigin(0.5); // Set the origin to the center for proper positioning.

        // Create the "Back to Menu" button.
        const backButton = this.add.text(centerX, height - 80, '< VOLTAR AO MENU', { 
            fontSize: '32px', 
            fill: '#c3c3c3' // Gray color for the button text
        })
        .setOrigin(0.5) // Center the button text.
        .setInteractive({ useHandCursor: true }) // Make the text interactive and show a hand cursor on hover.
        .on('pointerdown', () => {
            // When clicked, start the 'MenuScene' to return to the main menu.
            this.scene.start('MenuScene'); 
        });

        // (Optional: Add hover effects for the backButton here if desired)
        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ffde3d' }); // Change to yellow on hover
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#c3c3c3' }); // Revert to gray
        });
    }
}