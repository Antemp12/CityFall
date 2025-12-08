// GameOverScene.js

export default class GameOverScene extends Phaser.Scene {

    constructor() {
        super("GameOverScene");
    }

    create(data) {
        // Background rectangle for better visibility
        const bg = this.add.rectangle(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2,
            600,
            400,
            0x000000,
            0.8
        ).setOrigin(0.5);
        
        bg.setScrollFactor(0);


        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 150,
            "GAME OVER",
            {
                fontSize: "64px",
                fill: "#ff0000",
                fontStyle: "bold"
            }
        ).setOrigin(0.5).setScrollFactor(0);

        this.add.text(
            this.cameras.main.width / 2,
            this.cameras.main.height / 2 - 50,
            `Kills: ${data.kills}\nChips: ${data.chips}\nTime: ${data.time}s\nWave: ${data.wave}`,
            {
                fontSize: "24px",
                fill: "#ffffff",
                align: "center"
            }
        ).setOrigin(0.5).setScrollFactor(0);

        // Restart button
        const restartButton = this.add.text(
            this.cameras.main.width / 2 - 100,
            this.cameras.main.height / 2 + 100,
            "Restart",
            {
                fontSize: "32px",
                fill: "#00ff00",
                fontStyle: "bold"
            }
        ).setOrigin(0.5).setInteractive().setScrollFactor(0);

        restartButton.on('pointerdown', () => {
            this.scene.stop('GameOverScene');
            this.scene.stop('HUDScene');
            this.scene.start('GameScene');
        });

        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ffff00' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#00ff00' });
        });

        // Main Menu button
        const menuButton = this.add.text(
            this.cameras.main.width / 2 + 100,
            this.cameras.main.height / 2 + 100,
            "Main Menu",
            {
                fontSize: "32px",
                fill: "#00ff00",
                fontStyle: "bold"
            }
        ).setOrigin(0.5).setInteractive().setScrollFactor(0);

        menuButton.on('pointerdown', () => {
            window.location.reload();
        });

        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#ffff00' });
        });

        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#00ff00' });
        });
    }
}
