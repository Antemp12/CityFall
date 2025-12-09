import Player from "./Player.js";

export default class TowerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TowerScene' });
    }

    isUpgradeMenuOpen = false;

    init(data) {
        this.playerHealth = data.health;
        this.playerChips = data.chips;
        this.playerDamage = data.damage;
        this.tower = data.tower;
    }

    toggleUpgradeScene(player, tower, callingScene) {
        this.isUpgradeMenuOpen = true;

        const data = { player: player, tower: tower, callingScene: callingScene };
        const upgradeScene = this.scene.get('UpgradeScene');

        if (upgradeScene) {
            const status = upgradeScene.scene.settings.status;
            console.log("TowerScene: UpgradeScene status:", status);

            if (status === Phaser.Scenes.SceneManager.PAUSED) {
                console.log("TowerScene: Resuming UpgradeScene from PAUSED state.");
                this.scene.resume('UpgradeScene', data);
            } else if (status === Phaser.Scenes.SceneManager.RUNNING) {
                console.log("TowerScene: Attempting to resume UpgradeScene from RUNNING state (unexpected).");
                this.scene.resume('UpgradeScene', data);
            } else { // SHUTDOWN, PENDING, or other initial states
                console.log("TowerScene: Launching UpgradeScene for the first time or after shutdown.");
                this.scene.launch('UpgradeScene', data);
            }
        } else { // Scene does not exist yet (first time)
            this.scene.launch('UpgradeScene', data);
        }
    }

    preload() {
        // Carregar o mapa em formato JSON
        this.load.tilemapTiledJSON('mapa-torre', 'assets/images/mapa2/Mapa2.json?v=' + Date.now());

        // Carregar os tilesets (as imagens usadas no mapa)
        this.load.image('Interior', 'assets/images/mapa2/pixel-cyberpunk-interior.png');
        this.load.image('nucleo', 'assets/images/mapa2/nucleo.png');
        this.load.image('nucleoUp', 'assets/images/mapa2/nucleuoUp.png');

        // PLAYER
        const playerFrame = { frameWidth:48, frameHeight:64 };
        this.load.spritesheet("Idle", "assets/images/character/personagem/Idle/Idle.png", playerFrame);
        this.load.spritesheet("walk", "assets/images/character/personagem/Walk/walk.png", playerFrame);
        this.load.spritesheet("attack_anim", "assets/images/character/personagem/ataque.png", { frameWidth:256/4, frameHeight:171 });
    }

    create() {
        console.log("TowerScene: create() called.");
        this.cameras.main.setBackgroundColor('#000000'); // Ensure background is black
        // Mapa
        const map = this.make.tilemap({ key: 'mapa-torre' });
        const tilesetInterior = map.addTilesetImage('pixel-cyberpunk-interior', 'Interior');
        const tilesetNucleo = map.addTilesetImage('nucleo', 'nucleo');
        const tilesetNucleoUp = map.addTilesetImage('nucleoUp', 'nucleoUp');

        const chaoLayer = map.createLayer('Chao', tilesetInterior, 0, 0);
        const objetos2Layer = map.createLayer('Objetos2', tilesetInterior, 0, 0);
        const nucleoLayer = map.createLayer('Nucleo', [tilesetNucleo, tilesetNucleoUp], 0, 0);

        // Player
        this.player = new Player(this, map.widthInPixels / 2, map.heightInPixels - 100, "Idle");
        this.player.health = this.playerHealth;
        this.player.damage = this.playerDamage;
        this.registry.set("chips", this.playerChips);
        console.log("TowerScene: Player created and camera set to follow.");

        // Colisões
        objetos2Layer.setCollisionByProperty({ collides: true });
        nucleoLayer.setCollisionByProperty({ collides: true });

        this.physics.add.collider(this.player, objetos2Layer);
        
        // Colisão com o núcleo para abrir o menu de upgrades
        this.physics.add.collider(this.player, nucleoLayer, (player, tile) => {
            // nucleoUp firstgid is 401
                        if (tile.index >= 401 && !this.isUpgradeMenuOpen) {
                            this.toggleUpgradeScene(this.player, this.tower, 'TowerScene');
                        }        }, null, this);
        
        // UI e Porta de Saída
        this.add.text(10, 10, 'Carrega na tecla U para upgrades.\nPressione Left Click Mouse para sair', { font: '16px Arial', fill: '#ffffff' }).setScrollFactor(0);

        this.input.on('pointerdown', (pointer) => {
            if (pointer.leftButtonDown()) {
                console.log("TowerScene: Left click detected, exiting TowerScene.");
                const gameScene = this.scene.get('GameScene');
                gameScene.player.health = this.player.health;
                gameScene.player.damage = this.player.damage;
                gameScene.playerChips = this.registry.get('chips');
                this.scene.stop('TowerScene');
                this.scene.resume('GameScene');
                this.scene.resume('HUDScene');
            }
        });

        // Inputs
        this.cursors = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D
        });
        this.input.keyboard.on("keydown-SPACE", this.player.handleAttack, this.player);
        this.input.keyboard.on('keydown-U', () => {
            if (!this.isUpgradeMenuOpen) {
                this.toggleUpgradeScene(this.player, this.tower, 'TowerScene');
            }
        });

        // Câmera
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.cameras.main.startFollow(this.player);

        // Resetar flag quando a cena for resumida
        this.events.on('resume', () => {
            console.log("TowerScene: Resumed. isUpgradeMenuOpen was:", this.isUpgradeMenuOpen);
            this.isUpgradeMenuOpen = false;
            console.log("TowerScene: isUpgradeMenuOpen set to false after resume.");
            this.scene.setVisible(true);
        });

        this.scene.setVisible(true); // Explicitly ensure TowerScene is visible
    }

    update() {
        console.log("TowerScene: update()");
        if (this.player && !this.isUpgradeMenuOpen) {
            this.player.update(this.cursors);
        }
    }

    shutdown() {
        console.log("TowerScene: shutdown() called. Cleaning up input listeners.");
        this.input.keyboard.off("keydown-SPACE", this.player.handleAttack, this.player);
        this.input.keyboard.off("keydown-U");
        this.input.off("pointerdown");
        this.events.off('resume'); // Also remove the resume listener
        // It's good practice to also nullify references if they could cause memory leaks
        this.player = null;
        this.tower = null;
        this.cursors = null;
    }
}