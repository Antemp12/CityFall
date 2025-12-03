// NivelJogoScene.js

export default class NivelJogoScene extends Phaser.Scene {

    constructor() {
        super('NivelJogoScene'); 
        this.enemySpeed = 50; 
        this.nextSpawnTime = 0;
        this.spawnDelay = 2000; 
        this.spawnAreaY = 600; // Altura onde o inimigo anda (ajustar ao seu Tilemap)
    }

    preload() {
        // --- 1. CARREGAMENTO DO MAPA ---
        // (Certifique-se que o ficheiro JSON e a imagem do tileset existem no disco)
        this.load.tilemapTiledJSON('mapa_destruido', 'assets/tilemaps/cityfall_map.json');
        this.load.image('tileset_img', 'assets/tiles/cityfall_tileset_img.png'); 

        // --- 2. CARREGAMENTO DO PERSONAGEM (INIMIGO BASE) ---
        // Usamos o sprite que você forneceu: '3-Robot-Idle.png'
        this.load.spritesheet('robot_idle', 'assets/spritesheets/3-Robot-Idle.png', { 
            frameWidth: 32, 
            frameHeight: 32 // Assumimos 32x32px
        });

        // --- 3. CARREGAMENTO DA FORTALEZA E TORRES ---
        // (Adicione a sua fortaleza aqui quando o sprite estiver pronto)
        // this.load.spritesheet('fortaleza', 'assets/sprites/fortaleza_danos.png', { frameWidth: 128, frameHeight: 160 });
    }

    create() {
        const { width, height } = this.sys.game.config;
        
        // --- A. CRIAÇÃO DO MAPA ---
        const mapa = this.make.tilemap({ key: 'mapa_destruido' });
        
        // 🚨 ATENÇÃO: Substitua 'NomeDoTilesetNoTiled' pelo nome exato do tileset no seu ficheiro Tiled.
        const tileset = mapa.addTilesetImage('NomeDoTilesetNoTiled', 'tileset_img');
        
        // 🚨 ATENÇÃO: Substitua 'ChaoCamada' e 'RotaCamada' pelos nomes exatos das camadas no Tiled.
        mapa.createLayer('ChaoCamada', tileset, 0, 0); 
        const rotaCamada = mapa.createLayer('RotaCamada', tileset, 0, 0); 

        // --- B. FORTALEZA E UI ---
        // Exibe a UI de Recursos
        this.add.text(10, 10, 'Créditos: 500 | Cristal: 0', { fontSize: '20px', fill: '#00FFFF' });
        // (Aqui adicionaria o sprite da Fortaleza)

        // --- C. CRIAÇÃO DO PERSONAGEM (INIMIGO) ---
        
        // 1. Definição da Animação de Andar (Requisito obrigatório)
        this.anims.create({
            key: 'robot_walk',
            frames: this.anims.generateFrameNumbers('robot_idle', { start: 0, end: 3 }), // Assumindo 4 frames de andar
            frameRate: 8,
            repeat: -1
        });

        // 2. Criação do Grupo de Inimigos
        this.enemies = this.physics.add.group();
        
        // 3. Adiciona Colisão entre inimigos e o chão (se necessário)

        console.log("NivelJogoScene pronta para spawn de inimigos.");
    }

    // --- FUNÇÃO UPDATE (MOVIMENTO E SPAWN) ---
    update(time, delta) {
        
        // [4] Lógica de Spawn Aleatório e Controlo de Tempo
        if (time > this.nextSpawnTime) {
            this.spawnEnemy();
            // Adiciona aleatoriedade ao tempo do próximo spawn (entre 2000ms e 3000ms)
            this.nextSpawnTime = time + this.spawnDelay + Phaser.Math.Between(0, 1000); 
        }

        // [5] Movimento dos Inimigos (Move todos para a esquerda)
        this.enemies.children.each(function (enemy) {
            enemy.setVelocityX(-this.enemySpeed);

            // Se o inimigo alcançar a Fortaleza (ex: x < 64), ele deve parar e atacar ou causar dano
            if (enemy.x < 64) { 
                enemy.setVelocityX(0); 
                // Lógica de ataque à Fortaleza aqui
            }
        }, this);
    }

    // --- FUNÇÃO SPAWN INIMIGO ---
    spawnEnemy() {
        // Altura fixa na rota
        let ySpawn = this.spawnAreaY; 
        
        // Cria o sprite no lado direito (fora do ecrã)
        let enemy = this.enemies.create(1280 + 32, ySpawn, 'robot_idle');
        
        // Configurações físicas
        enemy.setImmovable(true);
        enemy.body.allowGravity = false;
        
        // Inicia a animação de andar
        enemy.play('robot_walk');
    }
}