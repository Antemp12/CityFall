// SpiderRobot.js

export default class SpiderRobot extends Phaser.Physics.Arcade.Sprite {
    
    health = 5;
    speed = 70; 
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
        
        this.body.setSize(20, 15); 
        this.body.setOffset(6, 17); 
        
        this.createAnimations(scene);
        this.anims.play('spider_walk', true);
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'spider_walk',
            frames: scene.anims.generateFrameNumbers('enemy_spider', { start: 0, end: 5 }), 
            frameRate: 10, 
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
        
        this.setDepth(this.y); 
        this.anims.play('spider_walk', true);
    }
    
    damage(amount) {
        this.health -= amount;
        if (this.health <= 0) {
            this.destroy();
        }
    }
}