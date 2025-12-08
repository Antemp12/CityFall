// UpgradeScene.js

export default class UpgradeScene extends Phaser.Scene {

    constructor() {
        super("UpgradeScene");
    }

    player;
    tower;
    chips;

    icons = [];
    texts = [];

    create(data) {

        this.player = data.player;
        this.tower = data.tower;

        this.chips = this.registry.get("chips");

        this.add.text(400,40,"UPGRADES", {
            fontSize: "40px",
            fill: "#ffffff"
        }).setOrigin(0.5);

        // --- ICONES E OPCOES ---
        const list = [
            { name:"Player HP", cost:20, action: () => this.player.maxHealth += 10 },
            { name:"Player Damage", cost:30, action: () => this.player.damage += 2 },
            { name:"Player Speed", cost:25, action: () => this.player.speed += 10 },
            { name:"Tower HP", cost:40, action: () => this.tower.health += 20 },
        ];

        let x = 200;
        let y = 150;

        list.forEach((item, i) => {

            const rect = this.add.rectangle(x,y,150,150,0x222222)
                .setStrokeStyle(2,0xffffff)
                .setInteractive();

            const text = this.add.text(x,y, `${item.name}\nCost:${item.cost}`, {
                fontSize:"18px",
                align:"center"
            }).setOrigin(0.5);

            rect.on("pointerdown", () => {
                this.buy(item);
            });

            this.icons.push(rect);
            this.texts.push(text);

            x += 220;

            if ((i+1) % 3 === 0) {
                x = 200;
                y += 220;
            }
        });


        // botão sair
        this.add.text(400,550,"PRESS ENTER TO EXIT", {
            fontSize:"22px",
            fill:"#ffff00"
        }).setOrigin(0.5);

        this.input.keyboard.on("keydown-ENTER", this.exit, this);

        // pausar jogo
        this.scene.pause("GameScene");
    }



    buy(item) {
        if (this.chips < item.cost) return;

        this.chips -= item.cost;

        item.action();

        this.registry.set("chips", this.chips);

        this.updateTexts();
    }



    updateTexts() {
        this.texts.forEach((t,i) => {
            t.setText(
                `${t.text.split("\n")[0]}\nCost:${this.icons[i].cost}`
            );
        });
    }



    exit() {
        this.scene.resume("GameScene");
        this.scene.stop();
    }
}
