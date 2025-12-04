// GameScene.js

import Player from './Player.js'; 
import HUDScene from './HUDScene.js'; 
import Enemy from './Enemy.js'; 
import SpiderRobot from './SpiderRobot.js'; 
import FlyRobot from './FlyRobot.js'; 

export default class GameScene extends Phaser.Scene {
    
    // As propriedades devem ser apenas DECLARADAS aqui (fora do create):
    player;
    cursors;
    shiftKey; 
    spaceKey; 
    towerHealth = 100;
    
    enemies; 
    spiderRobots; 
    flyRobots; 
    
    constructor() {
        super('GameScene'); 
    }

    // --- 1. PRELOAD: Carregamento de TODOS os Recursos ---
    preload() {
        // --- CARREGAMENTO DO MAPA E TILES ---
        this.load.tilemapTiledJSON('map', 'assets/images/mapa/MapaInicial.json'); 
        this.load.image('torre', 'assets/images/mapa/TorreFinal1.png'); 
        this.load.image('arvore', 'assets/images/mapa/Tree2.png');
        this.load.image('rocha', 'assets/images/mapa/Rock2.png');
        this.load.image('grama', 'assets/images/mapa/Tilemap_color3.png'); 
        this.load.image('arbusto', 'assets/images/mapa/Bushe3.png');
        this.load.image('chao', 'assets/images/mapa/solo.png');

        // --- CARREGAMENTO DO JOGADOR (48x64) ---
        const playerFrameConfig = { frameWidth: 48, frameHeight: 64 }; 
        this.load.spritesheet('Idle', 'assets/images/character/personagem/Idle/Idle.png', playerFrameConfig); 
        this.load.spritesheet('walk', 'assets/images/character/personagem/Walk/walk.png', playerFrameConfig);
        this.load.spritesheet('Dash', 'assets/images/character/personagem/Dash/Dash.png', playerFrameConfig);
        this.load.spritesheet('death', 'assets/images/character/personagem/Death/death.png', playerFrameConfig);
        
        // --- CARREGAMENTO DOS INIMIGOS (32x32) ---
        const enemyFrameConfig = { frameWidth: 32, frameHeight: 32 }; 
        
        this.load.spritesheet('robot_idle', 'assets/images/character/robos/3-Robot-Idle.png', enemyFrameConfig);
        this.load.spritesheet('robot_walk', 'assets/images/character/robos/3-Robot-Walk.png', enemyFrameConfig);
        this.load.spritesheet('robot_attack', 'assets/images/character/robos/3-Robot-Atack.png', enemyFrameConfig);
        this.load.spritesheet('enemy_spider', 'assets/images/character/robos/2-SpiderRobot.png', enemyFrameConfig);
        this.load.spritesheet('enemy_fly', 'assets/images/character/robos/1-FlyRobot.png', enemyFrameConfig);
    }

    // --- 2. CREATE: Criação de Objetos e Lógica Inicial ---
    create() {
        this.scene.launch('HUDScene'); 
        
        // --- 1. MAPA TILED ---
        const map = this.make.tilemap({ key: 'map' }); 

        const tilesetTorre = map.addTilesetImage('TorreFinal1', 'torre'); 
        const tilesetArvore = map.addTilesetImage('Tree2', 'arvore');
        const tilesetRocha = map.addTilesetImage('Rock2', 'rocha');
        const tilesetGrama = map.addTilesetImage('Tilemap_color3', 'grama');
        const tilesetArbusto = map.addTilesetImage('Bushe3', 'arbusto');
        const tilesetChao = map.addTilesetImage('solo', 'chao'); 
        const todosTilesets = [tilesetTorre, tilesetArvore, tilesetRocha, tilesetGrama, tilesetArbusto, tilesetChao];

        const chaoLayer = map.createLayer('Chao', todosTilesets, 0, 0); 
        chaoLayer.setDepth(0); 

        const objetosLayer = map.createLayer('Objetos', todosTilesets, 0, 0);
        objetosLayer.setDepth(1000); 
        
        const torreLayer = map.createLayer('Torre', tilesetTorre, 0, 0); 
        torreLayer.setDepth(1000);   
        
        // --- 0. DEFINIR LIMITES DO MUNDO DA FÍSICA ---
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        
        // --- 2. JOGADOR (Inicialização AGORA, corrigindo o erro 'sys') ---
        this.player = new Player(this, 480, 270, 'Idle');
        this.player.setDepth(10); 

        // --- 3. INIMIGOS (Grupos) ---
        this.enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
        this.spiderRobots = this.physics.add.group({ classType: SpiderRobot, runChildUpdate: true });
        this.flyRobots = this.physics.add.group({ classType: FlyRobot, runChildUpdate: true }); 

        // Instanciar Inimigos
        this.enemies.get(800, 100, 'robot_idle', this.player);
        this.spiderRobots.get(100, 500, 'enemy_spider', this.player);
        this.flyRobots.get(500, 100, 'enemy_fly', this.player); 

        // --- 4. INPUTS e CÂMARA ---
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT); 
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.input.keyboard.on('keydown-SPACE', this.performAttack, this);
        
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        
        // --- 5. COLISÕES FINAIS ---
        objetosLayer.setCollisionByProperty({ collides: true }); 
        torreLayer.setCollisionByProperty({ collides: true }); 

        this.physics.add.collider(this.player, objetosLayer);
        this.physics.add.collider(this.player, torreLayer); 
        this.physics.add.collider([this.enemies, this.spiderRobots], objetosLayer); 
        this.physics.add.collider([this.enemies, this.spiderRobots], torreLayer);
        
        this.physics.add.collider(this.enemies, this.enemies); 
        this.physics.add.collider(this.spiderRobots, this.spiderRobots);
        this.physics.add.collider(this.enemies, this.spiderRobots);
        this.physics.add.collider(this.flyRobots, this.flyRobots);

        // Colisão com Dano (Overlap)
        const allEnemies = [this.enemies, this.spiderRobots, this.flyRobots];
        this.physics.add.overlap(this.player, allEnemies, this.handlePlayerEnemyOverlap, null, this);
        this.physics.add.overlap(this.enemies, allEnemies, this.handleAttackEnemy, null, this);
    }
    
    // --- MÉTODOS DE COMBATE ---
    performAttack() {
        const attackHitbox = this.add.zone(this.player.x, this.player.y, 50, 50);
        this.physics.world.enable(attackHitbox);
        attackHitbox.body.setAllowGravity(false);
        attackHitbox.body.moves = false;
        
        const attackRange = 15; 
        attackHitbox.x = this.player.x + (this.player.flipX ? -attackRange : attackRange);
        
        const allEnemies = [this.enemies, this.spiderRobots, this.flyRobots];
        this.physics.overlap(attackHitbox, allEnemies, this.handleAttackEnemy, null, this);

        this.time.delayedCall(100, () => {
            attackHitbox.destroy();
        }, [], this);
    }

    handleAttackEnemy(attackHitbox, enemy) {
        if (enemy.damage) { 
            enemy.damage(5); 
            this.cameras.main.flash(50, 255, 255, 255); 
        }
    }

    handlePlayerEnemyOverlap(player, enemy) {
        // Lógica de dano do inimigo ao jogador/torre
    }

    // --- 3. UPDATE: Lógica do Jogo (A cada Frame) ---
    update() {
        this.player.update(this.cursors, this.shiftKey); 
    }
}