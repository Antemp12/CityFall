// SpiderRobot.js

export default class SpiderRobot extends Phaser.Physics.Arcade.Sprite {
    
    health = 5;
    speed = 70;
    chipValue = 1;
    damageValue = 10;

    targets = null;

    constructor(scene, x, y, spriteKey, targets) {
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.targets = targets;

        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);

        this.body.setImmovable(true);
        this.body.setMaxVelocity(this.speed);

        this.body.setSize(20,15);
        this.body.setOffset(6,17);

        this.createAnimations(scene);

        this.anims.play("spider_walk");
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    createAnimations(scene) {
        scene.anims.create({
            key: "spider_walk",
            frames: scene.anims.generateFrameNumbers("enemy_spider", { start:0, end:5 }),
            frameRate: 10,
            repeat: -1
        });
    }



    // ===========================
    // UPDATE
    // ===========================
    update() {

        if (this.health <= 0 || !this.body.enable) {
            this.setVelocity(0);
            return;
        }

        let target = null;

        if (this.targets.primary && this.targets.primary.health > 0) {
            target = this.targets.primary;
        } 
        else if (this.targets.secondary) {
            target = this.targets.secondary;
        }

        if (target) {
            this.scene.physics.moveToObject(this, target, this.speed);
        } else {
            this.setVelocity(0);
        }


        // virar sprite
        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }


        // profundidade
        this.setDepth(this.y);


        // animação
        this.anims.play("spider_walk", true);
    }



    // ===========================
    // RECEBER DANO
    // ===========================
    damage(amount) {
        this.health -= amount;

        if (this.health <= 0) {
            this.scene.events.emit("robot_killed", this.chipValue);
            this.destroy();
        }
    }
}
