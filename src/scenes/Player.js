// Player.js

export default class Player extends Phaser.Physics.Arcade.Sprite {
    
    // Propriedades de Dash
    isDashing = false;
    dashDuration = 100; 
    dashCooldown = 1000; 
    dashTimer = 0; 
    
    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        // --- Configurações Visuais e Físicas ---
        this.setOrigin(0.5); 
        this.setCollideWorldBounds(true); 
        this.setDrag(500, 500); 
        this.body.setMaxVelocity(250); 
        
        // Ajuste para sprite 48x64 pixels
        this.body.setSize(24, 48); 
        this.body.setOffset(12, 8); 
        
        // --- Animações ---
        this.createAnimations(scene);
        this.anims.play('idle_down', true); 
    }

    // --- Criação das Animações ---
    createAnimations(scene) {
        const frameRate = 6; 
        const walkRate = 12; 
        
        // IDLE
        scene.anims.create({ key: 'idle_down', frames: scene.anims.generateFrameNumbers('Idle', { start: 0, end: 7 }), frameRate: frameRate, repeat: -1 });
        scene.anims.create({ key: 'idle_up', frames: scene.anims.generateFrameNumbers('Idle', { start: 8, end: 15 }), frameRate: frameRate, repeat: -1 });
        scene.anims.create({ key: 'idle_side', frames: scene.anims.generateFrameNumbers('Idle', { start: 16, end: 23 }), frameRate: frameRate, repeat: -1 });
        
        // WALK
        scene.anims.create({ key: 'walk_down', frames: scene.anims.generateFrameNumbers('walk', { start: 0, end: 7 }), frameRate: walkRate, repeat: -1 });
        scene.anims.create({ key: 'walk_up', frames: scene.anims.generateFrameNumbers('walk', { start: 25, end: 32 }), frameRate: walkRate, repeat: -1 });
        scene.anims.create({ key: 'walk_side', frames: scene.anims.generateFrameNumbers('walk', { start: 16, end: 23 }), frameRate: walkRate, repeat: -1 });
        
        // DASH
        scene.anims.create({ key: 'dash_anim', frames: scene.anims.generateFrameNumbers('Dash', { start: 8, end: 15 }), frameRate: 30, repeat: 0 });
    }

    // --- Lógica de Atualização (Movimento, Dash e Animação) ---
    update(cursors, shiftKey) { 
        const speed = 200;
        let isMoving = false;
        let newAnimKey = 'idle_down'; 
        
        // --- 1. Gestão do Dash Timer ---
        if (this.dashTimer > 0) {
            this.dashTimer -= this.scene.game.loop.delta; 
            if (this.dashTimer < 0) this.dashTimer = 0;
        }

        // --- 2. Iniciar o DASH ---
        if (shiftKey.isDown && !this.isDashing && this.dashTimer === 0) {
            this.isDashing = true;
            this.dashTimer = this.dashCooldown; 
            
            let dirX = 0;
            let dirY = 0;
            
            if (cursors.left.isDown) dirX = -1; else if (cursors.right.isDown) dirX = 1;
            if (cursors.up.isDown) dirY = -1; else if (cursors.down.isDown) dirY = 1;

            if (dirX === 0 && dirY === 0) {
                dirX = this.flipX ? -1 : 1; 
            }

            const dashImpulse = 700;
            
            this.body.setDrag(0); 
            this.setVelocity(dirX * dashImpulse, dirY * dashImpulse);

            if (dirX !== 0 && dirY !== 0) {
                 this.body.velocity.normalize().scale(dashImpulse);
            }
            
            this.anims.play('dash_anim', true);

            this.scene.time.delayedCall(this.dashDuration, () => {
                this.isDashing = false;
                this.setVelocity(0); 
                this.body.setDrag(500); 
            });
            return; 
        }

        // --- 3. Movimento Normal (Ignorado durante o Dash) ---
        if (this.isDashing) return; 
        
        this.setVelocity(0); 

        // Movimento Horizontal e Flip
        if (cursors.left.isDown) {
            this.setVelocityX(-speed); this.setFlipX(false); newAnimKey = 'walk_side'; isMoving = true;
        } else if (cursors.right.isDown) {
            this.setVelocityX(speed); this.setFlipX(true); newAnimKey = 'walk_side'; isMoving = true;
        }
        
        // Movimento Vertical
        if (cursors.up.isDown) {
            this.setVelocityY(-speed); newAnimKey = 'walk_up'; isMoving = true;
        } else if (cursors.down.isDown) {
            this.setVelocityY(speed); newAnimKey = 'walk_down'; isMoving = true;
        }

        this.body.velocity.normalize().scale(isMoving ? speed : 0);
        
        // --- 4. Animação ---
        if (!isMoving) {
            if (this.anims.currentAnim.key.includes('walk')) {
                newAnimKey = this.anims.currentAnim.key.replace('walk', 'idle');
            } else if (!this.anims.currentAnim.key.includes('idle')) {
                newAnimKey = 'idle_down';
            } else {
                newAnimKey = this.anims.currentAnim.key;
            }
        }
        
        if (this.anims.currentAnim.key !== newAnimKey) {
            this.anims.play(newAnimKey, true);
        }
    }
}