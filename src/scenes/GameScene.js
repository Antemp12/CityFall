// GameScene.js

import Player from './Player.js'; 
import HUDScene from './HUDScene.js'; 
import Enemy from './Enemy.js'; 
import SpiderRobot from './SpiderRobot.js'; 
import FlyRobot from './FlyRobot.js'; 

export default class GameScene extends Phaser.Scene {
    
    player; cursors; spaceKey; 
    towerHealth = 100; playerChips = 0; 
    towerObject; enemies; spiderRobots; flyRobots; 
    
    constructor() { super('GameScene'); }

    preload() {
        // MAPA
        this.load.tilemapTiledJSON('map', 'assets/images/mapa/MapaInicial.json'); 
        this.load.image('torre', 'assets/images/mapa/TorreFinal1.png'); 
        this.load.image('arvore', 'assets/images/mapa/Tree2.png');
        this.load.image('rocha', 'assets/images/mapa/Rock2.png');
        this.load.image('grama', 'assets/images/mapa/Tilemap_color3.png'); 
        this.load.image('arbusto', 'assets/images/mapa/Bushe3.png');
        this.load.image('chao', 'assets/images/mapa/solo.png');

        // PLAYER
        const playerFrameConfig = { frameWidth: 48, frameHeight: 64 }; 
        
        this.load.spritesheet('Idle', 'assets/images/character/personagem/Idle/Idle.png', playerFrameConfig); 
        this.load.spritesheet('walk', 'assets/images/character/personagem/Walk/walk.png', playerFrameConfig);

        // ATAQUE
        this.load.spritesheet('attack_anim',
            'assets/images/character/personagem/ataque.png',
            {
                frameWidth: 256/4,
                frameHeight: 171
            }
        );

        // ENEMIGOS
        const enemyFrame = { frameWidth: 32, frameHeight: 32 };

        this.load.spritesheet('robot_idle', 'assets/images/character/robos/3-Robot-Idle.png', enemyFrame);
        this.load.spritesheet('robot_walk', 'assets/images/character/robos/3-Robot-Walk.png', enemyFrame);
        this.load.spritesheet('robot_attack', 'assets/images/character/robos/3-Robot-Atack.png', enemyFrame);
        this.load.spritesheet('enemy_spider', 'assets/images/character/robos/2-SpiderRobot.png', enemyFrame);
        this.load.spritesheet('enemy_fly', 'assets/images/character/robos/1-FlyRobot.png', enemyFrame);
    }


    create() {
        this.scene.launch('HUDScene'); 
        
        const map = this.make.tilemap({ key: 'map' });

        const tilesets = [
            map.addTilesetImage('TorreFinal1', 'torre'),
            map.addTilesetImage('Tree2', 'arvore'),
            map.addTilesetImage('Rock2', 'rocha'),
            map.addTilesetImage('Tilemap_color3', 'grama'),
            map.addTilesetImage('Bushe3', 'arbusto'),
            map.addTilesetImage('solo', 'chao'),
        ];

        const chaoLayer = map.createLayer('Chao', tilesets, 0, 0); 
        const objetosLayer = map.createLayer('Objetos', tilesets, 0, 0); 
        const torreLayer = map.createLayer('Torre', tilesets[0], 0, 0); 

        this.physics.world.setBounds(0,0,map.widthInPixels,map.heightInPixels);

        // PLAYER
        this.player = new Player(this, 480, 270, 'Idle');
        this.player.setDepth(10);

        // TORRE
        this.towerObject = this.physics.add.sprite(
            map.widthInPixels/2,
            map.heightInPixels/2,
            'torre'
        );

        this.towerObject.body.immovable = true;
        this.towerObject.health = this.towerHealth;

        // TARGETS
        const targets = { primary: this.towerObject, secondary: this.player };

        // GRUPOS
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.spiderRobots = this.physics.add.group({ classType: SpiderRobot, runChildUpdate: true });
        this.flyRobots = this.physics.add.group({ classType: FlyRobot, runChildUpdate: true });

        this.enemies.get(800,100,'robot_idle',targets);
        this.spiderRobots.get(100,500,'enemy_spider',targets);
        this.flyRobots.get(500,100,'enemy_fly',targets);

        // INPUTS
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on('keydown-SPACE', this.player.handleAttack, this.player);

        // COLISÕES
        objetosLayer.setCollisionByProperty({ collides:true });
        torreLayer.setCollisionByProperty({ collides:true });

        this.physics.add.collider(this.player, objetosLayer);
        this.physics.add.collider(this.player, torreLayer);

        this.physics.add.collider([this.enemies, this.spiderRobots], objetosLayer);
        this.physics.add.collider([this.enemies, this.spiderRobots], torreLayer);

        this.physics.add.collider(this.enemies, this.enemies); 
        this.physics.add.collider(this.spiderRobots, this.spiderRobots); 
        this.physics.add.collider(this.enemies, this.spiderRobots); 
        this.physics.add.collider(this.flyRobots, this.flyRobots);

        // OVERLAPS
        const allEnemies = [this.enemies, this.spiderRobots, this.flyRobots];

        this.physics.add.overlap(this.player, allEnemies,
            this.handlePlayerEnemyOverlap, null, this);

        this.physics.add.overlap(this.enemies, allEnemies,
            this.handleAttackEnemy, null, this);

        // CAMERA
        this.cameras.main.setBounds(0,0,map.widthInPixels,map.heightInPixels);
        this.cameras.main.startFollow(this.player);
    }


    handleAttackEnemy(hitbox, enemy) {
        if (enemy.damage) {
            enemy.damage(5);
            this.cameras.main.flash(50,255,255,255);
        }
    }

    handlePlayerEnemyOverlap(player, enemy) {
        player.takeDamage(1);
    }


    collectChips(value) {
        this.playerChips += value;
    }


    handleGameOver() {
        this.physics.pause();
        this.scene.pause('HUDScene');

        this.add.text(
            this.cameras.main.midPoint.x,
            this.cameras.main.midPoint.y,
            'GAME OVER',
            { fontSize: '64px', fill:'#ff0000', fontStyle:'bold'}
        ).setOrigin(0.5).setDepth(2000);
    }


    update() {
        this.player.update(this.cursors);
    }
}
