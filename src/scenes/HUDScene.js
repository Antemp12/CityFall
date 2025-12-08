// HUDScene.js

export default class HUDScene extends Phaser.Scene {

    constructor() {
        super('HUDScene');
    }

    towerText;
    playerText;
    chipsText;
    waveText;

    create() {

        this.towerText = this.add.text(20,20, "Tower: 100", {
            fontSize: "20px",
            fill: "#ffffff"
        });

        this.playerText = this.add.text(20,50, "Player: 100", {
            fontSize: "20px",
            fill: "#ffffff"
        });

        this.chipsText = this.add.text(20,80, "Chips: 0", {
            fontSize: "20px",
            fill: "#ffff00"
        });

        this.waveText = this.add.text(20,110, "Wave: 1", {
            fontSize: "20px",
            fill: "#00ff00"
        });


        // eventos
        this.registry.events.on("changedata", this.updateHUD, this);
    }


    updateHUD(parent, key, value) {
        if (key === "towerHP") this.towerText.setText("Tower: " + value);
        if (key === "playerHP") this.playerText.setText("Player: " + value);
        if (key === "chips")    this.chipsText.setText("Chips: " + value);
        if (key === "wave")     this.waveText.setText("Wave: " + value);
    }
}
