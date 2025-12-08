// FlyRobot.js

export default class FlyRobot extends Phaser.Physics.Arcade.Sprite {
    
    health = 4;
    speed = 100; 
    targets = null;
    chipValue = 12; // Recompensa de Chips
    
    constructor(scene, x, y, spriteKey, targets) {
        super(scene, x, y, spriteKey); 
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.targets = targets; 

        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false); 
        this.body.setImmovable(true); 
        this.body.setMaxVelocity(this.speed); 
        
        this.body.setSize(20, 20); 
        this.body.setOffset(6, 6); 
        
        this.createAnimations(scene);
        this.anims.play('fly_movement', true);
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'fly_movement',
            frames: scene.anims.generateFrameNumbers('enemy_fly', { start: 0, end: 9 }), 
            frameRate: 15,
            repeat: -1
        });
    }

    update() {
        if (!this.targets.primary && !this.targets.secondary) {
            this.setVelocity(0);
            return;
        }
        
        let currentTarget = null;
        if (this.targets.primary && this.targets.primary.health > 0) {
            currentTarget = this.targets.primary;
        } else if (this.targets.secondary) {
            currentTarget = this.targets.secondary;
        }
        
        if (currentTarget) {
            this.scene.physics.moveToObject(this, currentTarget, this.speed);
        } else {
            this.setVelocity(0);
        }

        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }
        
        this.setDepth(1500); 
        this.anims.play('fly_movement', true);
    }
    
    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            // EMITIR EVENTO DE RECOMPENSA
            this.scene.events.emit('robot_killed', this.chipValue); 
            this.destroy();
        }
    }
}