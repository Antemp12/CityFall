// GameScene.js

export default class GameScene extends Phaser.Scene {
    
    constructor() {
        super('GameScene'); 
    }

    // --- 1. PRELOAD: Carregamento de TODOS os Recursos ---
    preload() {
        // OBRIGATÓRIO: Carregar o ficheiro JSON do mapa
        this.load.tilemapTiledJSON('map', 'assets/images/mapa/MapaInicial.json'); 
        
        // Carregar CADA UM DOS 6 FICHEIROS PNG
        // O 1º parâmetro (a chave) é o que usaremos no 'create'
        this.load.image('torre', 'assets/images/mapa/TorreFinal1.png'); 
        this.load.image('arvore', 'assets/images/mapa/Tree2.png');
        this.load.image('rocha', 'assets/images/mapa/Rock2.png');
        this.load.image('grama', 'assets/images/mapa/Tilemap_color3.png'); 
        this.load.image('arbusto', 'assets/images/mapa/Bushe3.png');
        this.load.image('chao', 'assets/images/mapa/solo.png');
    }

    // --- 2. CREATE: Criação de Objetos e Lógica Inicial ---
    create() {
        const map = this.make.tilemap({ key: 'map' }); 

        // 1. LIGAR CADA IMAGEM (Chave do preload) AO SEU NOME NO MAPA TILED
        
        // SUBSTITUA: 'NomeDoTilesetNoTiled' pelo NOME EXATO do Tileset no Tiled.
        // O segundo parâmetro é a chave que usou no this.load.image() acima.
        
        const tilesetTorre = map.addTilesetImage('TorreFinal1', 'torre'); 
        const tilesetArvore = map.addTilesetImage('Tree2', 'arvore');
        const tilesetRocha = map.addTilesetImage('Rock2', 'rocha');
        const tilesetGrama = map.addTilesetImage('Tilemap_color3', 'grama');
        const tilesetArbusto = map.addTilesetImage('Bushe3', 'arbusto');
        const tilesetChao = map.addTilesetImage('solo', 'chao'); 
        
        // Colocar todos os tilesets numa lista para ser mais fácil criar as camadas
        const todosTilesets = [
            tilesetTorre, tilesetArvore, tilesetRocha, 
            tilesetGrama, tilesetArbusto, tilesetChao
        ];

        // 2. CRIAR AS CAMADAS DO MAPA
        
        
        map.createLayer('Chao', todosTilesets, 0, 0); 

       
        map.createLayer('Objetos', todosTilesets, 0, 0);
        
        
        map.createLayer('Torre', tilesetTorre, 0, 0); 
    }
}