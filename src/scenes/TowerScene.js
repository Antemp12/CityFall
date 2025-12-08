
export default class TowerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'TowerScene' });
    }

    preload() {
        // Carregar o mapa em formato JSON
        this.load.tilemapTiledJSON('mapa-torre', 'assets/images/mapa2/Mapa2.json');

        // Carregar os tilesets (as imagens usadas no mapa)
        // A chave 'tileset_interno' deve corresponder ao nome do tileset no Tiled
        this.load.image('Interior', 'assets/images/mapa2/pixel-cyberpunk-interior.png');
        this.load.image('nucleo', 'assets/images/mapa2/nucleo.png'); // Corrigir o caminho se necessário
        this.load.image('nucleoUp', 'assets/images/mapa2/nucleuoUp.png'); // Corrigido o erro de digitação
    }

    create() {
        // Criar o mapa
        const map = this.make.tilemap({ key: 'mapa-torre' });

        // Adicionar os tilesets ao mapa
        // O primeiro parâmetro é o nome do tileset no Tiled, o segundo é a chave da imagem carregada no preload
        const tilesetInterior = map.addTilesetImage('pixel-cyberpunk-interior', 'Interior');
        const tilesetNucleo = map.addTilesetImage('nucleo', 'nucleo');
        const tilesetNucleoUp = map.addTilesetImage('nucleoUp', 'nucleoUp');

        // Criar as camadas (layers) do mapa
        // Os nomes devem corresponder exatamente aos nomes das camadas no Tiled
        // Verifique o arquivo Mapa2.json para os nomes corretos das camadas
        const chaoLayer = map.createLayer('Chao', tilesetInterior, 0, 0);
        const objetos2Layer = map.createLayer('Objetos2', tilesetInterior, 0, 0);
        const nucleoLayer = map.createLayer('Nucleo', [tilesetNucleo, tilesetNucleoUp], 0, 0);


        // Adicionar colisões se necessário (exemplo)
        // paredesLayer.setCollisionByProperty({ collides: true });

        // Adicionar um texto de depuração para confirmar que a cena carregou
        this.add.text(10, 10, 'Tower Scene Loaded', { font: '16px Arial', fill: '#ffffff' });

        // Lógica para voltar para a cena principal
        this.input.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }

    update() {
        // Lógica da cena da torre
    }
}
