
// GameScene.js

import Player from "./Player.js";
import HUDScene from "./HUDScene.js";

import Enemy from "./Enemy.js";
import SpiderRobot from "./SpiderRobot.js";
import FlyRobot from "./FlyRobot.js";

export default class GameScene extends Phaser.Scene {

    constructor(){
        super("GameScene");
    }

    // --- VARIAVEIS DE JOGO ---
    player;
    tower;
    nucleus;

    enemies;

    wave = 1;
    waveTimer = 0;

    waveInterval = 30000;      // 30 segundos
    lastWaveTime = 0;

    scaleEvery = 3;          // aumenta a cada 3 waves
    baseEnemyCount = 3;

    // ===========================================================
    preload(){

        this.load.tilemapTiledJSON("map","assets/images/mapa/MapaInicial.json");

        this.load.image("torre","assets/images/mapa/TorreFinal1.png");

        // PLAYER
        this.load.spritesheet("Idle","assets/images/character/personagem/Idle/Idle.png",
        { frameWidth:48, frameHeight:64 });

        this.load.spritesheet("walk","assets/images/character/personagem/Walk/walk.png",
        { frameWidth:48, frameHeight:64 });

        this.load.spritesheet("attack","assets/images/character/personagem/ataque.png",
        { frameWidth:128, frameHeight:171 });

        // INIMIGOS
        this.load.spritesheet("robot_idle","assets/images/character/robos/3-Robot-Idle.png",
        { frameWidth:32, frameHeight:32 });

        this.load.spritesheet("robot_walk","assets/images/character/robos/3-Robot-Walk.png",
        { frameWidth:32, frameHeight:32 });

        this.load.spritesheet("robot_attack","assets/images/character/robos/3-Robot-Atack.png",
        { frameWidth:32, frameHeight:32 });

        this.load.spritesheet("enemy_spider","assets/images/character/robos/2-SpiderRobot.png",
        { frameWidth:32, frameHeight:32 });

        this.load.spritesheet("enemy_fly","assets/images/character/robos/1-FlyRobot.png",
        { frameWidth:32, frameHeight:32 });

        this.load.image("nucleus","assets/images/mapa/nucleus.png");

    }

    // ===========================================================
    create(){

        this.scene.launch("HUDScene");

        // MAPA
        const map = this.make.tilemap({ key:"map" });

        const tileset = map.addTilesetImage("TorreFinal1","torre");

        map.createLayer("Chao",[tileset],0,0);

        // PLAYER
        this.player = new Player(this,400,300,"Idle");

        // TORRE
        this.tower = this.physics.add.sprite(600,300,"torre");
        this.tower.health = 200;

        // NUCLEO
        this.nucleus = this.physics.add.sprite(650,300,"nucleus");
        this.nucleus.setImmovable(true);

        // INIMIGOS
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate:true
        });

        // INPUT
        this.cursors = this.input.keyboard.addKeys("W,S,A,D");

        // COLISÕES
        this.physics.add.overlap(this.player,this.nucleus,
            this.openUpgradeScene,null,this);

        this.physics.add.overlap(this.player,this.enemies,
            this.playerHit,null,this);

        this.time.addEvent({
            delay:100,
            loop:true,
            callback: () => this.updateWaves()
        });

        // SPAWN INICIAL
        this.spawnWave();

    }

    // ===========================================================
    // WAVES
    updateWaves(){

        if (this.time.now - this.lastWaveTime < this.waveInterval)
            return;

        this.wave++;
        this.spawnWave();
        this.lastWaveTime = this.time.now;

    }

    // aumentar força
    getScaler(){
        return 1 + Math.floor(this.wave / this.scaleEvery) * 0.5;
    }

    spawnWave(){

        const scaler = this.getScaler();
        const qty = this.baseEnemyCount + this.wave;

        for (let i=0;i<qty;i++){
            let e = this.enemies.get(
                Phaser.Math.Between(50,750),
                Phaser.Math.Between(50,550),
                "robot_idle"
            );

            e.health *= scaler;
            e.damage *= scaler;
        }
    }

    // ===========================================================
    // COMBATE
    playerHit(player,enemy){
        player.takeDamage(1);
    }

    // ===========================================================
    // UPGRADE SCENE
    openUpgradeScene(){
        this.scene.pause();

        this.scene.launch("UpgradeScene", {
            player:this.player,
            tower:this.tower
        });
    }

    // ===========================================================
    update(){
        this.player.update(this.cursors);
    }
}
