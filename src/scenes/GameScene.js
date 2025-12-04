// GameScene.js

import Player from './Player.js'; 
import HUDScene from './HUDScene.js'; 

export default class GameScene extends Phaser.Scene {
    
    player;
    cursors;
    shiftKey; 
    towerHealth = 100; // Vida inicial da torre (para ser lida pela HUDScene)
    
    constructor() {
        super('GameScene'); 
    }

    // --- 1. PRELOAD: Carregamento de TODOS os Recursos ---
    preload() {
        // --- CARREGAMENTO DO MAPA TILED ---
        this.load.tilemapTiledJSON('map', 'assets/images/mapa/MapaInicial.json'); 
        this.load.image('torre', 'assets/images/mapa/TorreFinal1.png'); 
        this.load.image('arvore', 'assets/images/mapa/Tree2.png');
        this.load.image('rocha', 'assets/images/mapa/Rock2.png');
        this.load.image('grama', 'assets/images/mapa/Tilemap_color3.png'); 
        this.load.image('arbusto', 'assets/images/mapa/Bushe3.png');
        this.load.image('chao', 'assets/images/mapa/solo.png');

        // --- CARREGAMENTO DOS SPRITESHEETS DO JOGADOR (48x64) ---
        const frameConfig = { frameWidth: 48, frameHeight: 64 }; 
        this.load.spritesheet('Idle', 'assets/images/character/personagem/Idle/Idle.png', frameConfig); 
        this.load.spritesheet('walk', 'assets/images/character/personagem/Walk/walk.png', frameConfig);
        this.load.spritesheet('Dash', 'assets/images/character/personagem/Dash/Dash.png', frameConfig);
        this.load.spritesheet('death', 'assets/images/character/personagem/Death/death.png', frameConfig);
        
        // ** NOTA: Certifique-se de que os caminhos das imagens acima estão corretos **
    }

    // --- 2. CREATE: Criação de Objetos e Lógica Inicial ---
    create() {
        // --- LANÇAR A HUD SCENE ---
        this.scene.launch('HUDScene'); 
        
        // --- 1. MAPA TILED ---
        const map = this.make.tilemap({ key: 'map' }); 

        // Ligação dos Tilesets (os nomes devem ser EXATOS aos do Tiled)
        const tilesetTorre = map.addTilesetImage('TorreFinal1', 'torre'); 
        const tilesetArvore = map.addTilesetImage('Tree2', 'arvore');
        const tilesetRocha = map.addTilesetImage('Rock2', 'rocha');
        const tilesetGrama = map.addTilesetImage('Tilemap_color3', 'grama');
        const tilesetArbusto = map.addTilesetImage('Bushe3', 'arbusto');
        const tilesetChao = map.addTilesetImage('solo', 'chao'); 
        const todosTilesets = [tilesetTorre, tilesetArvore, tilesetRocha, tilesetGrama, tilesetArbusto, tilesetChao];

        // Criação das Camadas
        const chaoLayer = map.createLayer('Chao', todosTilesets, 0, 0); 
        chaoLayer.setDepth(0); // Fundo estático

        const objetosLayer = map.createLayer('Objetos', todosTilesets, 0, 0);
        const torreLayer = map.createLayer('Torre', tilesetTorre, 0, 0); 
        
        // --- 0. DEFINIR LIMITES DO MUNDO DA FÍSICA (Correção da Barreira Invisível) ---
        this.physics.world.setBounds(
            0, 
            0, 
            map.widthInPixels,  // Largura total do mapa (e.g., 1280px)
            map.heightInPixels  // Altura total do mapa (e.g., 736px)
        );
        
        // --- 2. JOGADOR ---
        this.player = new Player(this, 480, 270, 'Idle');
        
        // --- 3. PROFUNDIDADE (PARA PASSAR POR BAIXO) ---
        objetosLayer.setDepth(1000); // Profundidade ALTA para objetos/árvores
        torreLayer.setDepth(1000);   // Profundidade ALTA para a torre
        this.player.setDepth(10);    // Profundidade BAIXA para o jogador (fica por baixo)
        
        // --- 4. COLISÕES DO MAPA ---
        // Torna sólido apenas os tiles com a propriedade 'collides: true'
        objetosLayer.setCollisionByProperty({ collides: true }); 
        torreLayer.setCollisionByProperty({ collides: true }); 

        // Colisor do jogador com as camadas sólidas
        this.physics.add.collider(this.player, objetosLayer);
        this.physics.add.collider(this.player, torreLayer); 

        // --- 5. CONTROLOS e CÂMARA ---
        this.cursors = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W, down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A, right: Phaser.Input.Keyboard.KeyCodes.D
        });
        this.shiftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT); 
        
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
    }
    
    // --- 3. UPDATE: Lógica do Jogo (A cada Frame) ---
    update() {
        // O jogador agora usa a lógica de Dash corrigida no Player.js
        this.player.update(this.cursors, this.shiftKey); 
        
        // NÃO HÁ CÓDIGO DE PROFUNDIDADE DINÂMICA AQUI, pois o jogador deve ficar sempre por baixo (depth 10)
    }
}