// Enemy.js

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    
    health = 10;
    speed = 50; 
    target = null;
    
    constructor(scene, x, y, spriteKey, target) {
        super(scene, x, y, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.target = target; 

        this.setCollideWorldBounds(true);
        this.setOrigin(0.5);
        this.body.setImmovable(true); 
        this.body.setMaxVelocity(this.speed); 
        
        this.body.setSize(20, 28); 
        this.body.setOffset(6, 4); 
        
        this.createAnimations(scene); 
        this.anims.play('enemy_idle', true);
    }

    createAnimations(scene) {
        // IDLE
        scene.anims.create({ key: 'enemy_idle', frames: scene.anims.generateFrameNumbers('robot_idle', { start: 0, end: 3 }), frameRate: 4, repeat: -1 });
        // WALK
        scene.anims.create({ key: 'enemy_walk', frames: scene.anims.generateFrameNumbers('robot_walk', { start: 0, end: 5 }), frameRate: 8, repeat: -1 });
        // ATTACK
        scene.anims.create({ key: 'enemy_attack', frames: scene.anims.generateFrameNumbers('robot_attack', { start: 0, end: 3 }), frameRate: 10, repeat: 0 });
    }

    update() {
        if (!this.target || this.health <= 0 || !this.body.enable) {
            this.setVelocity(0);
            return;
        }
        
        this.scene.physics.moveToObject(this, this.target, this.speed);

        if (this.body.velocity.x > 0) {
            this.setFlipX(false); 
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true); 
        }
        
        this.setDepth(this.y); 
        
        if (this.body.velocity.x !== 0 || this.body.velocity.y !== 0) {
            this.anims.play('enemy_walk', true);
        } else {
            this.anims.play('enemy_idle', true); 
        }
    }
    
    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy(); 
        }
    }
}