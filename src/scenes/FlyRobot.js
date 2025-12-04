// FlyRobot.js

export default class FlyRobot extends Phaser.Physics.Arcade.Sprite {
    
    health = 4;
    speed = 100; 
    target = null;
    
    constructor(scene, x, y, spriteKey, target) {
        super(scene, x, y, spriteKey); 

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.target = target; 

        this.setCollideWorldBounds(true);
        this.body.setAllowGravity(false); // CRUCIAL
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
        if (!this.target || this.health <= 0) {
            this.setVelocity(0);
            return;
        }
        
        this.scene.physics.moveToObject(this, this.target, this.speed);

        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }
        
        this.setDepth(1500); // Acima de todos os objetos de solo
        this.anims.play('fly_movement', true);
    }
    
    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}