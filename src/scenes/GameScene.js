// GameScene.js

import Player from './Player.js'; 

export default class GameScene extends Phaser.Scene {
    
    player;
    cursors;
    
    constructor() {
        super('GameScene'); 
    }

    // --- 1. PRELOAD: Carregamento de TODOS os Recursos ---
    preload() {
        // --- CARREGAMENTO DO MAPA TILED ---
        this.load.tilemapTiledJSON('map', 'assets/images/mapa/MapaInicial.json'); 
        
        // CARREGAMENTO DOS 6 FICHEIROS PNG DO MAPA (Tilesets)
        this.load.image('torre', 'assets/images/mapa/TorreFinal1.png'); 
        this.load.image('arvore', 'assets/images/mapa/Tree2.png');
        this.load.image('rocha', 'assets/images/mapa/Rock2.png');
        this.load.image('grama', 'assets/images/mapa/Tilemap_color3.png'); 
        this.load.image('arbusto', 'assets/images/mapa/Bushe3.png');
        this.load.image('chao', 'assets/images/mapa/solo.png');

        // --- CARREGAMENTO DOS 4 SPRITESHEETS DO JOGADOR (48x64) ---
        const frameConfig = { frameWidth: 48, frameHeight: 64 }; 
        this.load.spritesheet('Idle', 'assets/images/character/personagem/Idle/Idle.png', frameConfig); 
        this.load.spritesheet('walk', 'assets/images/character/personagem/Walk/walk.png', frameConfig);
        this.load.spritesheet('Dash', 'assets/images/character/personagem/Dash/Dash.png', frameConfig);
        this.load.spritesheet('death', 'assets/images/character/personagem/Death/death.png', frameConfig);
    }

    // --- 2. CREATE: Criação de Objetos e Lógica Inicial ---
    create() {
        // --- 1. MAPA TILED ---
        const map = this.make.tilemap({ key: 'map' }); 

        // Ligação dos Tilesets 
        const tilesetTorre = map.addTilesetImage('TorreFinal1', 'torre'); 
        const tilesetArvore = map.addTilesetImage('Tree2', 'arvore');
        const tilesetRocha = map.addTilesetImage('Rock2', 'rocha');
        const tilesetGrama = map.addTilesetImage('Tilemap_color3', 'grama');
        const tilesetArbusto = map.addTilesetImage('Bushe3', 'arbusto');
        const tilesetChao = map.addTilesetImage('solo', 'chao'); 
        
        const todosTilesets = [
            tilesetTorre, tilesetArvore, tilesetRocha, 
            tilesetGrama, tilesetArbusto, tilesetChao
        ];

        // Criação das Camadas
        const chaoLayer = map.createLayer('Chao', todosTilesets, 0, 0); 
        const objetosLayer = map.createLayer('Objetos', todosTilesets, 0, 0);
        const torreLayer = map.createLayer('Torre', tilesetTorre, 0, 0); 
        
        // --- 2. JOGADOR ---
        this.player = new Player(this, 480, 270, 'Idle');
        
        // --- 3. CONTROLOS e CÂMARA ---
        // ALTERAÇÃO: Mapear WASD para as teclas
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });
        
        // Configurações da câmara (Seguimento exato)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
    }
    
    // --- 3. UPDATE: Lógica do Jogo (A cada Frame) ---
    update() {
        this.player.update(this.cursors);
    }
}