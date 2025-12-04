// Player.js

export default class Player extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // CORREÇÃO: Linhas incompatíveis removidas (setPixelPerfect e setRenderToTexture)

        // --- Configurações Visuais e Físicas ---
        this.setOrigin(0.5); // Origem no centro do frame
        this.setCollideWorldBounds(true); 
        this.setDrag(500, 500); // Arrasto para paragens suaves
        this.body.setMaxVelocity(250); 
        
        // Ajuste para sprite 48x64 pixels (Dimensões da Hitbox)
        this.body.setSize(24, 48); 
        this.body.setOffset(12, 8); 
        
        // --- Animações ---
        this.createAnimations(scene);
        this.anims.play('idle_down', true); // Estado inicial
    }

    // --- Criação das Animações ---
    createAnimations(scene) {
        const frameRate = 6; // FPS para idle
        const walkRate = 12; // FPS para andar
        
        // --------------------------------------------------------
        // ANIMAÇÕES IDLE (Assumindo organização de 4 direções)
        // --------------------------------------------------------

        // IDLE DOWN (Linha 1: Frames 0 a 7)
        scene.anims.create({
            key: 'idle_down',
            frames: scene.anims.generateFrameNumbers('Idle', { start: 0, end: 7 }), 
            frameRate: frameRate,
            repeat: -1
        });
        
        // IDLE UP (Linha 2: Frames 8 a 15)
        scene.anims.create({
            key: 'idle_up',
            frames: scene.anims.generateFrameNumbers('Idle', { start: 8, end: 15 }), 
            frameRate: frameRate,
            repeat: -1
        });

        // IDLE SIDE (Linha 3: Frames 16 a 23)
        scene.anims.create({
            key: 'idle_side',
            frames: scene.anims.generateFrameNumbers('Idle', { start: 16, end: 23 }), 
            frameRate: frameRate,
            repeat: -1
        });
        
        // --------------------------------------------------------
        // ANIMAÇÕES WALK (Andar) - (Usando o 'walk.png')
        // --------------------------------------------------------

        // WALK DOWN (Linha 1 do walk.png: Frames 0 a 7)
        scene.anims.create({
            key: 'walk_down',
            frames: scene.anims.generateFrameNumbers('walk', { start: 0, end: 7 }), 
            frameRate: walkRate,
            repeat: -1
        });

        // WALK UP (Linha 2 do walk.png: Frames 8 a 15)
        scene.anims.create({
            key: 'walk_up',
            frames: scene.anims.generateFrameNumbers('walk', { start: 25, end: 32 }), 
            frameRate: walkRate,
            repeat: -1
        });

        // WALK SIDE (Linha 3 do walk.png: Frames 16 a 23)
        scene.anims.create({
            key: 'walk_side',
            frames: scene.anims.generateFrameNumbers('walk', { start: 16, end: 23 }), 
            frameRate: walkRate,
            repeat: -1
        });
        
        // Adicione as outras animações (Dash e Death) aqui, ajustando as linhas (se precisar).
    }

    // --- Lógica de Atualização (Movimento e Animação de 4 Direções) ---
    update(cursors) {
        const speed = 200;
        let isMoving = false;
        let newAnimKey = 'idle_down'; 
        
        this.setVelocity(0);

        // --- 1. Determinar Movimento e Orientação ---
        
        if (cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(false); 
            newAnimKey = 'walk_side';
            isMoving = true;
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(true); 
            newAnimKey = 'walk_side';
            isMoving = true;
        }
        
        if (cursors.up.isDown) {
            this.setVelocityY(-speed);
            newAnimKey = 'walk_up';
            isMoving = true;
        } else if (cursors.down.isDown) {
            this.setVelocityY(speed);
            newAnimKey = 'walk_down';
            isMoving = true;
        }

        // Normalização da velocidade diagonal
        this.body.velocity.normalize().scale(isMoving ? speed : 0);
        
        // --- 2. Animação ---
        
        if (!isMoving) {
            // Se estiver parado, mantém a orientação IDLE da última direção de movimento
            if (this.anims.currentAnim.key.includes('walk')) {
                newAnimKey = this.anims.currentAnim.key.replace('walk', 'idle');
            } else if (!this.anims.currentAnim.key.includes('idle')) {
                newAnimKey = 'idle_down';
            } else {
                newAnimKey = this.anims.currentAnim.key; // Se já estiver em idle, mantém
            }
        }
        
        // Toca a nova animação apenas se for diferente da atual
        if (this.anims.currentAnim.key !== newAnimKey) {
            this.anims.play(newAnimKey, true);
        }
    }
}