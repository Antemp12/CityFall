// GameScene.js

import Player from "./Player.js";
import HUDScene from "./HUDScene.js";
import Enemy from "./Enemy.js";
import SpiderRobot from "./SpiderRobot.js";
import FlyRobot from "./FlyRobot.js";
import WaveManager from "./WaveManager.js";

export default class GameScene extends Phaser.Scene {

    constructor(){
        super("GameScene");
    }

    towerHealth = 1000;
    playerChips = 0;
    kills = 0;
    startTime = 0;
    isGameOver = false;

    preload() {

        // MAPA
        this.load.tilemapTiledJSON("map", "assets/images/mapa/MapaInicial.json");

        this.load.image("torre", "assets/images/mapa/TorreFinal1.png");
        this.load.image("arvore", "assets/images/mapa/Tree2.png");
        this.load.image("rocha", "assets/images/mapa/Rock2.png");
        this.load.image("grama", "assets/images/mapa/Tilemap_color3.png");
        this.load.image("arbusto", "assets/images/mapa/Bushe3.png");
        this.load.image("chao", "assets/images/mapa/solo.png");

        // PLAYER
        const playerFrame = { frameWidth:48, frameHeight:64 };

        this.load.spritesheet("Idle", "assets/images/character/personagem/Idle/Idle.png", playerFrame);
        this.load.spritesheet("walk", "assets/images/character/personagem/Walk/walk.png", playerFrame);

        // ATAQUE (2 frames)
        this.load.spritesheet("attack_anim",
            "assets/images/character/personagem/ataque.png",
            { frameWidth:256/4, frameHeight:171 }
        );

        // INIMIGOS
        const enemyFrame = { frameWidth:32, frameHeight:32 };

        this.load.spritesheet("robot_idle", "assets/images/character/robos/3-Robot-Idle.png", enemyFrame);
        this.load.spritesheet("robot_walk", "assets/images/character/robos/3-Robot-Walk.png", enemyFrame);
        this.load.spritesheet("robot_attack", "assets/images/character/robos/3-Robot-Atack.png", enemyFrame);

        this.load.spritesheet("enemy_spider","assets/images/character/robos/2-SpiderRobot.png", enemyFrame);
        this.load.spritesheet("enemy_fly","assets/images/character/robos/1-FlyRobot.png", enemyFrame);

        // CHIP
        this.load.image("chip", "assets/images/interface/Chip.png");
    }



    create() {

        // Reset game over flag on scene restart
        this.isGameOver = false;
        this.playerChips = 0;
        this.kills = 0;
        this.towerHealth = 1000;

        // LIGA HUD
        this.scene.launch("HUDScene");

        // MAPA
        this.map = this.make.tilemap({ key:"map" });

        const tilesets = [
            this.map.addTilesetImage("TorreFinal1","torre"),
            this.map.addTilesetImage("Tree2","arvore"),
            this.map.addTilesetImage("Rock2","rocha"),
            this.map.addTilesetImage("Tilemap_color3","grama"),
            this.map.addTilesetImage("Bushe3","arbusto"),
            this.map.addTilesetImage("solo","chao"),
        ];

        const chao = this.map.createLayer("Chao", tilesets,0,0);
        const objetos = this.map.createLayer("Objetos", tilesets,0,0);
        const torreLayer = this.map.createLayer("Torre", tilesets[0],0,0);

        this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);



        // PLAYER
        this.player = new Player(this,480,270,"Idle");



        // TORRE
        this.towerObject = this.physics.add.sprite(
            this.map.widthInPixels/2,
            this.map.heightInPixels/2,
            "torre"
        );

        this.towerObject.body.immovable = true;
        this.towerObject.health = this.towerHealth;

        // Set initial tower HP in registry
        this.registry.set("towerHP", this.towerHealth);

        // Set initial player HP in registry
        this.registry.set("playerHP", this.player.health);

        // Set initial chips in registry
        this.registry.set("chips", 0);

        // Set start time
        this.startTime = this.time.now;

        // TARGETS
        const targets = {
            primary: this.towerObject,
            secondary: this.player
        };

        // Initialize wave manager
        this.waveManager = new WaveManager(this, targets);
        this.waveManager.start();



        // GRUPOS
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate:true });
        this.spiderRobots = this.physics.add.group({ classType: SpiderRobot, runChildUpdate:true });
        this.flyRobots = this.physics.add.group({ classType: FlyRobot, runChildUpdate:true });

        
        this.enemies.get(800,100,"robot_idle",targets);
        this.spiderRobots.get(100,500,"enemy_spider",targets);
        this.flyRobots.get(500,100,"enemy_fly",targets);

        // Listen for robot killed event
        this.events.off("robot_killed", this.collectChips, this);
        this.events.on("robot_killed", this.collectChips, this);

        // Listen for game over event
        this.events.off("gameover", this.handleGameOver, this);
        this.events.on("gameover", this.handleGameOver, this);



        // INPUTS
        this.cursors = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D
        });

        this.input.keyboard.on("keydown-SPACE", this.player.handleAttack, this.player);



        // COLISÕES
        objetos.setCollisionByProperty({ collides:true });
        torreLayer.setCollisionByProperty({ collides:true });

        this.physics.add.collider(this.player, objetos);
        this.physics.add.collider(this.player, torreLayer);

        this.physics.add.collider([this.enemies,this.spiderRobots,this.flyRobots], objetos);
        this.physics.add.collider([this.enemies,this.spiderRobots,this.flyRobots], torreLayer);



        // OVERLAPS DE COMBATE

        const allEnemies = [
            this.enemies,
            this.spiderRobots,
            this.flyRobots
        ];

        // dano ao jogador
        this.physics.add.overlap(
            this.player,
            allEnemies,
            this.handlePlayerEnemyOverlap,
            null,
            this
        );

        // dano ao atacar
        this.physics.add.overlap(
            this.player.attackHitbox,
            allEnemies,
            this.handleAttackEnemy,
            null,
            this
        );

        // dano à torre
        this.physics.add.overlap(
            this.towerObject,
            allEnemies,
            this.handleTowerEnemyOverlap,
            null,
            this
        );



        // CAMARA
        this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        this.cameras.main.startFollow(this.player);

    }



    // =========================
    // COMBATE
    // =========================

    handleAttackEnemy(hitbox, enemy){

        if (!enemy.damage) return;

        enemy.damage(5);

        this.cameras.main.flash(50,255,255,255);
    }



    handlePlayerEnemyOverlap(player, enemy){
        if (!enemy.damageValue || player.lastDamageTime && this.time.now - player.lastDamageTime < 1000) return;

        player.lastDamageTime = this.time.now;
        player.takeDamage(enemy.damageValue);
    }

    handleTowerEnemyOverlap(tower, enemy){
        if (!enemy.damageValue || (enemy.lastTowerAttackTime && this.time.now - enemy.lastTowerAttackTime < 1000)) return;

        enemy.lastTowerAttackTime = this.time.now;
        tower.health -= enemy.damageValue;

        if (tower.health <= 0) {
            tower.health = 0;
            this.handleGameOver();
        }

        this.registry.set("towerHP", tower.health);
    }



    collectChips(value){
        this.playerChips += value;
        this.kills++;
        this.registry.set("chips", this.playerChips);
    }



    handleGameOver(){
        this.physics.pause();
       this.scene.stop("HUDScene");
        this.isGameOver = true;

        const timePassed = Math.floor((this.time.now - this.startTime) / 1000);
        const waveEnded = this.waveManager ? this.waveManager.wave - 1 : 0;

        // Background rectangle for better visibility
        const bg = this.add.rectangle(
            this.cameras.main.midPoint.x,
            this.cameras.main.midPoint.y,
            600,
            400,
            0x000000,
            0.8
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.midPoint.x,
            this.cameras.main.midPoint.y - 150,
            "GAME OVER",
            {
                fontSize:"64px",
                fill:"#ff0000",
                fontStyle:"bold"
            }
        ).setOrigin(0.5);

        this.add.text(
            this.cameras.main.midPoint.x,
            this.cameras.main.midPoint.y - 50,
            `Kills: ${this.kills}\nChips: ${this.playerChips}\nTime: ${timePassed}s\nWave: ${waveEnded}`,
            {
                fontSize:"24px",
                fill:"#ffffff",
                align:"center"
            }
        ).setOrigin(0.5);

        // Restart button
        const restartButton = this.add.text(
            this.cameras.main.midPoint.x - 100,
            this.cameras.main.midPoint.y + 100,
            "Restart",
            {
                fontSize:"32px",
                fill:"#00ff00",
                fontStyle:"bold"
            }
        ).setOrigin(0.5).setInteractive();

        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });

        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ffff00' });
        });

        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#00ff00' });
        });

        // Main Menu button
        const menuButton = this.add.text(
            this.cameras.main.midPoint.x + 100,
            this.cameras.main.midPoint.y + 100,
            "Main Menu",
            {
                fontSize:"32px",
                fill:"#00ff00",
                fontStyle:"bold"
            }
        ).setOrigin(0.5).setInteractive();

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



    update(){
        if (this.isGameOver) return;

        this.player.update(this.cursors);
        this.waveManager.update();
    }

}
