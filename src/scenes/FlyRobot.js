// FlyRobot.js

export default class FlyRobot extends Phaser.Physics.Arcade.Sprite {

    health = 4;
    speed = 100;
    chipValue = 2;
    damageValue = 12;

    targets = null;

    constructor(scene, x, y, spriteKey, targets) {
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.targets = targets;

        this.setOrigin(0.5);

        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setMaxVelocity(this.speed);

        this.body.setSize(20,20);
        this.body.setOffset(6,6);

        this.createAnimations(scene);

        this.anims.play("fly_move");
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    createAnimations(scene) {
        scene.anims.create({
            key: "fly_move",
            frames: scene.anims.generateFrameNumbers("enemy_fly", { start:0, end:9 }),
            frameRate: 15,
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


        this.setDepth(1500);

        this.anims.play("fly_move", true);
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
