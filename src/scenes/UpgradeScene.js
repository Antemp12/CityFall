class Upgrade {
    constructor(scene, name, config) {
        this.scene = scene;
        this.name = name;
        this.level = config.level || 0;
        this.maxLevel = config.maxLevel || 10;
        this.baseCost = config.baseCost || 10;
        this.costIncrement = config.costIncrement || 5;
        this.effect = config.effect;
        this.icon = config.icon;
        this.description = config.description;
    }

    get cost() {
        return this.baseCost + (this.level * this.costIncrement);
    }

    canAfford() {
        return this.scene.chips >= this.cost;
    }

    isMaxLevel() {
        return this.level >= this.maxLevel;
    }

    purchase() {
        if (!this.canAfford() || this.isMaxLevel()) {
            return false;
        }

        this.scene.chips -= this.cost;
        this.level++;
        this.effect(this.level);

        this.scene.registry.set(`upgrade_level_${this.name}`, this.level);
        this.scene.registry.set("chips", this.scene.chips);
        return true;
    }
}


export default class UpgradeScene extends Phaser.Scene {

    constructor() {
        super("UpgradeScene");
    }

    player;
    tower;
    chips;
    callingScene;

    upgrades = [];
    upgradeTexts = [];


    init(data) {
        this.player = data.player;
        this.tower = data.tower;
        this.callingScene = data.callingScene || 'GameScene';
        this.events.on('resume', this.onResume, this);
    }

    preload() {
        this.load.image('heart_icon', 'https://cdn.iconscout.com/icon/free/png-256/free-heart-icon-svg-download-png-1502416.png');
        this.load.image('boot_icon', 'https://cdn.iconscout.com/icon/free/png-256/free-boot-icon-svg-download-png-10665072.png');
    }

    create() {
        // This scene can be created once and then woken/slept.
        // If this is the first time create is called, set up the UI.
        if (!this.uiCreated) {
            const cam = this.cameras.main;
            const centerX = cam.width / 2;
            const centerY = cam.height / 2;

            this.add.rectangle(centerX, centerY, 600, 500, 0x000000, 0.8).setStrokeStyle(2, 0xffffff);

            this.add.text(centerX, centerY - 200, "UPGRADES", {
                fontSize: "40px",
                fill: "#ffffff"
            }).setOrigin(0.5);

            this.chipsText = this.add.text(centerX, centerY - 150, `Chips: ${this.chips}`, {
                fontSize: "24px",
                fill: "#ffff00"
            }).setOrigin(0.5);

            // --- UPGRADES ---
            let upgradeConfigs = [
                {
                    name: "PlayerHP",
                    baseCost: 20,
                    costIncrement: 10,
                    effect: () => this.player.maxHealth += 20,
                    icon: 'heart_icon',
                    description: "+20 HP"
                },
                {
                    name: "PlayerSpeed",
                    baseCost: 25,
                    costIncrement: 15,
                    effect: () => this.player.speed += 10,
                    icon: 'boot_icon',
                    description: "+10 Speed"
                },
            ];

            if (this.tower) {
                upgradeConfigs.push({
                    name: "TowerHP",
                    baseCost: 40,
                    costIncrement: 20,
                    effect: () => this.tower.health += 100,
                    icon: 'heart_icon',
                    description: "+100 tower HP"
                });
            }

            this.upgrades = upgradeConfigs.map(config => {
                const level = this.registry.get(`upgrade_level_${config.name}`) || 0;
                return new Upgrade(this, config.name, { ...config, level });
            });

            let x = centerX - (this.upgrades.length - 1) * 150 / 2;
            let y = centerY;

            this.upgrades.forEach((upgrade, i) => {
                const icon = this.add.image(x, y, upgrade.icon).setScale(0.5).setInteractive();
                icon.on("pointerdown", () => this.buy(upgrade, i));

                const text = this.add.text(x, y + 100, "", {
                    fontSize: "16px",
                    align: "center",
                    fill: "#ffffff"
                }).setOrigin(0.5);
                this.upgradeTexts.push(text);

                this.updateUpgradeText(upgrade, i);

                x += 150;
            });

            this.add.text(centerX, centerY + 200, "PRESS U TO EXIT", {
                fontSize: "22px",
                fill: "#ffff00"
            }).setOrigin(0.5);
            this.uiCreated = true;
        }

        // Always update text and enable input when scene is activated (launched or woken)
        this.input.keyboard.on("keydown-U", this.exit, this);
        this.scene.setVisible(true);
        this.updateAllUpgradeTexts();
        this.chips = this.registry.get("chips") || 0;

    }

    onResume(sys, data) {
        console.log("UpgradeScene: Resuming. Data received:", data);
        this.player = data.player;
        this.tower = data.tower;
        this.callingScene = data.callingScene;

        console.log("UpgradeScene: Player object on resume:", this.player);
        console.log("UpgradeScene: Tower object on resume:", this.tower);

        // Re-initialize upgrades to get latest registry values if necessary
        this.upgrades.forEach(upgrade => {
            upgrade.level = this.registry.get(`upgrade_level_${upgrade.name}`) || 0;
        });

        this.input.keyboard.on("keydown-U", this.exit, this);
        this.scene.setVisible(true);
        this.updateAllUpgradeTexts();
        this.chips = this.registry.get("chips") || 0;
        this.chipsText.setText(`Chips: ${this.chips}`);
    }

    updateAllUpgradeTexts() {
        this.upgrades.forEach((upgrade, i) => {
            this.updateUpgradeText(upgrade, i);
        });
    }

    updateUpgradeText(upgrade, index) {
        const text = this.upgradeTexts[index];
        if (upgrade.isMaxLevel()) {
            text.setText(`${upgrade.name}\nLevel: MAX\n${upgrade.description}`);
        } else {
            text.setText(`${upgrade.name}\nLevel: ${upgrade.level}\nCost: ${upgrade.cost}\n${upgrade.description}`);
        }
    }

    buy(upgrade, index) {
        if (upgrade.purchase()) {
            this.chipsText.setText(`Chips: ${this.chips}`);
            this.updateUpgradeText(upgrade, index);

            // Visual feedback
            const icon = this.upgrades.map(u => u.icon)[index];
        }
    }

    exit() {
        console.log("UpgradeScene: Exiting. Resuming", this.callingScene, "and pausing UpgradeScene.");
        this.input.keyboard.off("keydown-U", this.exit, this);
        this.scene.setVisible(false);
        this.scene.resume(this.callingScene);
        this.scene.pause();
        console.log("UpgradeScene: Exit method finished.");
    }
}