// Enemy.js

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    
    health = 10;
    speed = 50;
    chipValue = 5;

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

        this.body.setSize(20,28);
        this.body.setOffset(6,4);

        this.createAnimations(scene);
        this.anims.play("enemy_idle");
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    createAnimations(scene) {

        scene.anims.create({
            key: "enemy_idle",
            frames: scene.anims.generateFrameNumbers("robot_idle", { start:0, end:3 }),
            frameRate: 4,
            repeat: -1
        });

        scene.anims.create({
            key: "enemy_walk",
            frames: scene.anims.generateFrameNumbers("robot_walk", { start:0, end:5 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: "enemy_attack",
            frames: scene.anims.generateFrameNumbers("robot_attack", { start:0, end:3 }),
            frameRate: 10,
            repeat: 0
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
        } 
        else {
            this.setVelocity(0);
        }


        // virar sprite
        if (this.body.velocity.x > 0) {
            this.setFlipX(false);
        } 
        else if (this.body.velocity.x < 0) {
            this.setFlipX(true);
        }


        // profundidade
        this.setDepth(this.y);


        // animações
        if (this.body.velocity.length() > 0) {
            this.anims.play("enemy_walk", true);
        } else {
            this.anims.play("enemy_idle", true);
        }
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
