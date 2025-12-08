// HUDScene.js

export default class HUDScene extends Phaser.Scene {

    constructor() {
        super('HUDScene');
    }

    towerText;
    playerText;
    chipsImage;
    chipsCountText;
    waveText;
    towerHealthBar;

    create() {

        // Center x position for tower health
        const centerX = this.cameras.main.width / 2;

        this.towerText = this.add.text(centerX, 20, "Tower Health", {
            fontSize: "20px",
            fill: "#ffffff"
        }).setOrigin(0.5, 0);

        this.towerHealthBar = this.add.graphics();
        this.drawTowerHealthBar(1000, centerX); // Initial full health

        this.playerText = this.add.text(20,70, "Player: 100", {
            fontSize: "20px",
            fill: "#ffffff"
        });

        this.chipsImage = this.add.image(20, 110, "chip").setOrigin(0, 0.5).setScale(0.05);
        this.chipsCountText = this.add.text(70, 110, "0", {
            fontSize: "20px",
            fill: "#ffff00"
        }).setOrigin(0, 0.5);

        this.waveText = this.add.text(20,130, "Wave: 1", {
            fontSize: "20px",
            fill: "#00ff00"
        });


        // eventos
        this.registry.events.on("changedata", this.updateHUD, this);
    }


    updateHUD(parent, key, value) {
        if (!this.cameras.main) return;

        if (key === "towerHP") {
            this.drawTowerHealthBar(value);
        }
        if (key === "playerHP") this.playerText.setText("Player: " + value);
        if (key === "chips")    this.chipsCountText.setText(value);
        if (key === "wave")     this.waveText.setText("Wave: " + value);
    }

    drawTowerHealthBar(health, centerX = this.cameras.main.width / 2) {
        this.towerHealthBar.clear();

        const barWidth = 200;
        const barX = centerX - barWidth / 2;

        // Background bar
        this.towerHealthBar.fillStyle(0x000000);
        this.towerHealthBar.fillRect(barX, 45, barWidth, 20);

        // Health bar
        let healthPercent = health / 1000;
        let color = healthPercent > 0.5 ? 0x00ff00 : 0xff0000; // Green if >50%, red otherwise
        this.towerHealthBar.fillStyle(color);
        this.towerHealthBar.fillRect(barX, 45, barWidth * healthPercent, 20);
    }
}

