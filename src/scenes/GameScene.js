// GameScene.js
// Esta cena principal do jogo gere toda a lógica de jogo, incluindo o jogador, inimigos, torre, colisões e a interface de utilizador.

import Player from "./Player.js";
import HUDScene from "./HUDScene.js";
import Enemy from "./Enemy.js";
import SpiderRobot from "./SpiderRobot.js";
import FlyRobot from "./FlyRobot.js";
import WaveManager from "./WaveManager.js";

export default class GameScene extends Phaser.Scene {

    /**
     * Construtor para a GameScene.
     * Define o nome da cena como "GameScene".
     */
    constructor(){
        super("GameScene");
    }

    // Current health of the tower, starting at 1000 HP.
    towerHealth = 1000;
    // Number of chips collected by the player, used for upgrades.
    playerChips = 0;
    // Number of enemies killed by the player.
    kills = 0;
    // Timestamp when the game started, used for calculating game duration.
    startTime = 0;
    // Flag to prevent multiple game over triggers.
    isGameOver = false;

    preload() {

        // Load the tilemap in JSON format
        this.load.tilemapTiledJSON("map", "assets/images/mapa/MapaInicial.json");

        // Load map images
        this.load.image("torre", "assets/images/mapa/TorreFinal1.png");
        this.load.image("arvore", "assets/images/mapa/Tree2.png");
        this.load.image("rocha", "assets/images/mapa/Rock2.png");
        this.load.image("grama", "assets/images/mapa/Tilemap_color3.png");
        this.load.image("arbusto", "assets/images/mapa/Bushe3.png");
        this.load.image("chao", "assets/images/mapa/solo.png");

        // Define player sprite frame dimensions
        const playerFrame = { frameWidth:48, frameHeight:64 };

        // Load player animation spritesheets
        this.load.spritesheet("Idle", "assets/images/character/personagem/Idle/Idle.png", playerFrame);
        this.load.spritesheet("walk", "assets/images/character/personagem/Walk/walk.png", playerFrame);

        // Load player attack animation spritesheet (2 frames)
        this.load.spritesheet("attack_anim",
            "assets/images/character/personagem/ataque.png",
            { frameWidth:256/4, frameHeight:171 }
        );

        // Define enemy sprite frame dimensions
        const enemyFrame = { frameWidth:32, frameHeight:32 };

        // Load enemy animation spritesheets
        this.load.spritesheet("robot_idle", "assets/images/character/robos/3-Robot-Idle.png", enemyFrame);
        this.load.spritesheet("robot_walk", "assets/images/character/robos/3-Robot-Walk.png", enemyFrame);
        this.load.spritesheet("robot_attack", "assets/images/character/robos/3-Robot-Atack.png", enemyFrame);

        // Load specific enemy spritesheets
        this.load.spritesheet("enemy_spider","assets/images/character/robos/2-SpiderRobot.png", enemyFrame);
        this.load.spritesheet("enemy_fly","assets/images/character/robos/1-FlyRobot.png", enemyFrame);

        // Load chip image
        this.load.image("chip", "assets/images/interface/Chip.png");

        // Load game background music
        this.load.audio("gameSong", "assets/Sons/GameSong.mp3");
    }



    create() {

        // Reset game over flag and player/tower stats on scene restart
        this.isGameOver = false;
        this.playerChips = 0;
        this.kills = 0;
        this.towerHealth = 1000;

        // Launch the HUD (Heads-Up Display) scene to show player and tower status
        this.scene.launch("HUDScene");

        // Create the tilemap from the loaded JSON data
        this.map = this.make.tilemap({ key:"map" });

        // Define tilesets used in the map, linking Tiled names to loaded Phaser images
        const tilesets = [
            this.map.addTilesetImage("TorreFinal1","torre"),
            this.map.addTilesetImage("Tree2","arvore"),
            this.map.addTilesetImage("Rock2","rocha"),
            this.map.addTilesetImage("Tilemap_color3","grama"),
            this.map.addTilesetImage("Bushe3","arbusto"),
            this.map.addTilesetImage("solo","chao"),
        ];

        // Create map layers, specifying tilesets to use
        const chao = this.map.createLayer("Chao", tilesets,0,0); // Ground layer
        const objetos = this.map.createLayer("Objetos", tilesets,0,0); // Objects layer (e.g., trees, rocks)
        const torreLayer = this.map.createLayer("Torre", tilesets[0],0,0); // Tower specific layer

        // Set the physics world boundaries to match the map dimensions
        this.physics.world.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);

        // Initialize the player character at a specific position
        this.player = new Player(this,480,270,"Idle");
        // Set initial depth for the player for correct rendering order (Y-sorting)
        this.player.setDepth(this.player.y);

        // Create the tower object in the center of the map
        this.towerObject = this.physics.add.sprite(
            this.map.widthInPixels/2,
            this.map.heightInPixels/2,
            "torre"
        );
        // Set depth for the tower for correct rendering order (Y-sorting)
        this.towerObject.setDepth(this.towerObject.y);

        // Make the tower immovable so it doesn't react to physics collisions
        this.towerObject.body.immovable = true;
        // Assign initial health to the tower
        this.towerObject.health = this.towerHealth;

        // Enable interactivity for the tower (e.g., clicking to open upgrade menu)
        this.towerObject.setInteractive({ useHandCursor: true });
        this.towerObject.on('pointerdown', () => {
            console.log("GameScene: Tower clicked. Pausing GameScene and HUDScene, launching TowerScene.");
            // Pause current scenes and launch the TowerScene for upgrades/info
            this.scene.pause('GameScene');
            this.scene.pause('HUDScene');
            this.scene.launch('TowerScene', { health: this.player.health, chips: this.playerChips, damage: this.player.damage, tower: this.towerObject });
        });

        // Set initial tower HP in registry, accessible by other scenes (e.g., HUD)
        this.registry.set("towerHP", this.towerHealth);

        // Set initial player HP in registry
        this.registry.set("playerHP", this.player.health);

        // Set initial chips count in registry
        this.registry.set("chips", 0);

        // Record the game start time for duration tracking
        this.startTime = this.time.now;

        // Define primary and secondary targets for enemies
        const targets = {
            primary: this.towerObject, // Tower is the main target
            secondary: this.player     // Player is the secondary target
        };

        // Initialize the wave manager with this scene and the targets
        this.waveManager = new WaveManager(this, targets);
        // Start the enemy waves
        this.waveManager.start();

        // Initialize physics groups for different enemy types
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate:true }); // Generic ground enemies
        this.spiderRobots = this.physics.add.group({ classType: SpiderRobot, runChildUpdate:true }); // Spider robots
        this.flyRobots = this.physics.add.group({ classType: FlyRobot, runChildUpdate:true }); // Flying robots

        // Add initial enemies for testing or starting the game
        this.enemies.add(new Enemy(this, 800, 100, "robot_idle", targets));
        this.spiderRobots.add(new SpiderRobot(this, 100, 500, "enemy_spider", targets));
        this.flyRobots.add(new FlyRobot(this, 500, 100, "enemy_fly", targets));

        // Ensure only one listener for "robot_killed" event to collect chips and track kills
        this.events.off("robot_killed", this.collectChips, this);
        this.events.on("robot_killed", this.collectChips, this);

        // Ensure only one listener for "gameover" event to handle game over logic
        this.events.off("gameover", this.handleGameOver, this);
        this.events.on("gameover", this.handleGameOver, this);



        // Configure keyboard inputs for player movement
        this.cursors = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D
        });

        // Set up spacebar for player attack action
        this.input.keyboard.on("keydown-SPACE", this.player.handleAttack, this.player);

        // Enable collision for specific tile properties on map layers
        objetos.setCollisionByProperty({ collides:true }); // Objects layer (e.g., trees)
        torreLayer.setCollisionByProperty({ collides:true }); // Tower layer

        // Set up collision between player and map layers
        this.physics.add.collider(this.player, objetos);
        this.physics.add.add.collider(this.player, torreLayer);

        // Set up collision between all enemy types and map layers
        this.physics.add.collider([this.enemies,this.spiderRobots,this.flyRobots], objetos);
        this.physics.add.collider([this.enemies,this.spiderRobots,this.flyRobots], torreLayer);



        // Create a combined array of all enemy groups for easier overlap checking
        const allEnemies = [
            this.enemies,
            this.spiderRobots,
            this.flyRobots
        ];

        // Set up overlap for player taking damage from enemies
        this.physics.add.overlap(
            this.player,
            allEnemies,
            this.handlePlayerEnemyOverlap, // Callback function when player and enemy overlap
            null, // Process callback regardless of specific conditions
            this
        );

        // Set up overlap for player's attack hitbox damaging enemies
        this.physics.add.overlap(
            this.player.attackHitbox,
            allEnemies,
            this.handleAttackEnemy, // Callback function when attack hitbox and enemy overlap
            null, // Process callback regardless of specific conditions
            this
        );

        // Set up overlap for enemies damaging the tower
        this.physics.add.overlap(
            this.towerObject,
            allEnemies,
            this.handleTowerEnemyOverlap, // Callback function when tower and enemy overlap
            null, // Process callback regardless of specific conditions
            this
        );



        // Set camera bounds to the map dimensions
        this.cameras.main.setBounds(0,0,this.map.widthInPixels,this.map.heightInPixels);
        // Make the camera follow the player
        this.cameras.main.startFollow(this.player);

        // Unlock audio context for web audio playback
        this.sound.unlock();

        // Add and play the game background music
        this.gameSong = this.sound.add("gameSong");
        if (this.gameSong) {
            this.gameSong.setVolume(1); // Set volume
            this.gameSong.play({ loop: true }); // Play in a loop
            console.log("Game song is playing");
        } else {
            console.log("Game song not loaded");
        }

        // Set rendering depths for tilemap layers for correct visual order
        chao.setDepth(0); // Ground layer at the bottom
        objetos.setDepth(1); // Objects layer above ground
        torreLayer.setDepth(2); // Tower layer on top
    }



    // =========================
    // COMBATE
    // =========================

    // Callback for when the player's attack hitbox overlaps with an enemy
    handleAttackEnemy(hitbox, enemy){
        // Ensure the enemy can take damage
        if (!enemy.damage) return;

        // Apply damage to the enemy based on player's damage stat
        enemy.damage(this.player.damage);

        // Flash the camera briefly to indicate a hit
        this.cameras.main.flash(50,255,255,255);
    }



    // Callback for when an enemy overlaps with the player
    handlePlayerEnemyOverlap(player, enemy){
        // Prevent damage if enemy has no damage value or if player was recently damaged
        if (!enemy.damageValue || (player.lastDamageTime && this.time.now - player.lastDamageTime < 1000)) return; // 1-second invulnerability

        // Record the time of this damage event
        player.lastDamageTime = this.time.now;
        // Player takes damage from the enemy
        player.takeDamage(enemy.damageValue);
    }

    // Callback for when an enemy overlaps with the tower
    handleTowerEnemyOverlap(tower, enemy){
        // Prevent damage if enemy has no damage value or if enemy recently attacked the tower
        if (!enemy.damageValue || (enemy.lastTowerAttackTime && this.time.now - enemy.lastTowerAttackTime < 1000)) return; // 1-second attack cooldown

        // Record the time of this tower attack event
        enemy.lastTowerAttackTime = this.time.now;
        // Tower takes damage from the enemy
        tower.health -= enemy.damageValue;

        // Check if tower health has dropped to zero or below
        if (tower.health <= 0) {
            tower.health = 0; // Cap health at 0
            this.handleGameOver(); // Trigger game over
        }

        // Update tower HP in the registry for HUD display
        this.registry.set("towerHP", tower.health);
    }



    // Function to handle collecting chips and incrementing kill count when an enemy is defeated
    collectChips(value){
        this.playerChips += value; // Add chips dropped by the enemy
        this.kills++; // Increment total kills
        this.registry.set("chips", this.playerChips); // Update chips in registry for HUD
    }



    // Handles the game over condition, stopping game processes and launching the game over scene
    handleGameOver(){
        // Prevent multiple calls to game over if already triggered
        if (this.isGameOver) return;

        this.isGameOver = true; // Set game over flag
        this.physics.pause(); // Pause all physics operations

        // Stop the game song if it's playing
        if (this.gameSong) {
            this.gameSong.stop();
        }

        // Calculate time passed and the wave reached
        const timePassed = Math.floor((this.time.now - this.startTime) / 1000);
        const waveEnded = this.waveManager ? this.waveManager.wave - 1 : 0;

        // Pause the current game and HUD scenes
        this.scene.pause('HUDScene');
        this.scene.pause('GameScene');
        // Launch the GameOverScene, passing relevant game statistics
        this.scene.launch('GameOverScene', {
            kills: this.kills,
            chips: this.playerChips,
            time: timePassed,
            wave: waveEnded
        });
    }



    // The main game loop, called once per frame
    update(){
        // Stop updating if the game is over
        if (this.isGameOver) return;

        // Update player state and animations based on input
        this.player.update(this.cursors);
        // Apply Y-sorting to the player, so objects higher on the screen (lower Y-value) render behind
        this.player.setDepth(this.player.y);

        // Apply Y-sorting to all active enemies in their respective groups
        this.enemies.children.each(enemy => {
            enemy.setDepth(enemy.y);
        });
        this.spiderRobots.children.each(enemy => {
            enemy.setDepth(enemy.y);
        });
        this.flyRobots.children.each(enemy => {
            enemy.setDepth(enemy.y);
        });

        // Update the wave manager to progress waves and spawn enemies
        this.waveManager.update();
    }

}
