// Player.js

export default class Player extends Phaser.Physics.Arcade.Sprite {

    // ESTADOS
    isAttacking = false;
    enemiesHitInAttack = new Set();

    maxHealth = 10;
    health = 10;
    isDead = false;
    isInvincible = false;

    speed = 200;

    // Direção real do ataque
    facing = "down";


    constructor(scene, x, y, spriteKey) {
        super(scene, x, y, spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setOrigin(0.5);
        this.setCollideWorldBounds(true);

        this.body.setSize(24,48);
        this.body.setOffset(12,8);

        // INPUTS
        this.keyW = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyA = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keyS = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keyD = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // HITBOX DE ATAQUE
        this.attackHitbox = scene.add.rectangle(0,0,50,50,0xff0000,0);
        scene.physics.add.existing(this.attackHitbox);

        this.attackHitbox.body.setAllowGravity(false);
        this.attackHitbox.body.setEnable(false);

        this.createAnimations(scene);
        this.anims.play("idle_down", true);
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    createAnimations(scene) {
        
        scene.anims.create({
            key: "idle_down",
            frames: scene.anims.generateFrameNumbers("Idle", { start:0, end:7 }),
            frameRate: 6,
            repeat: -1
        });

        scene.anims.create({
            key: "walk_down",
            frames: scene.anims.generateFrameNumbers("walk", { start:0, end:7 }),
            frameRate: 12,
            repeat: -1
        });

        scene.anims.create({
            key: "walk_up",
            frames: scene.anims.generateFrameNumbers("walk", { start:25, end:32 }),
            frameRate: 12,
            repeat: -1
        });

        scene.anims.create({
            key: "walk_side",
            frames: scene.anims.generateFrameNumbers("walk", { start:16, end:23 }),
            frameRate: 12,
            repeat: -1
        });


        // ATAQUE (apenas 2 frames)
        scene.anims.create({
            key: "attack_swing",
            frames: scene.anims.generateFrameNumbers("attack_anim", { start:0, end:1 }),
            frameRate: 10,
            repeat: 0
        });
    }



    // ===========================
    // DANO
    // ===========================
    takeDamage(amount) {

        if (this.isInvincible || this.isDead) return;

        this.health -= amount;

        if (this.health <= 0) {
            this.isDead = true;
            this.health = 0;
            this.scene.events.emit("gameover");
            return;
        }

        this.isInvincible = true;

        this.scene.time.delayedCall(400,
            () => this.isInvincible = false
        );

        this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 50,
            yoyo: true,
            repeat: 4
        });
    }



    // ===========================
    // ATAQUE DIRECIONAL
    // ===========================
    handleAttack() {
        
        if (this.isAttacking || this.isDead) return;

        this.isAttacking = true;
        this.enemiesHitInAttack.clear();

        this.attackHitbox.body.setEnable(true);

        this.anims.play("attack_swing");

        const halfW = this.width * 0.5;
        const halfH = this.height * 0.5;

        const offset = 35;

        switch(this.facing) {
            case "left":
                this.attackHitbox.setPosition(this.x - halfW - offset, this.y);
                break;

            case "right":
                this.attackHitbox.setPosition(this.x + halfW + offset, this.y);
                break;

            case "up":
                this.attackHitbox.setPosition(this.x, this.y - halfH - offset);
                break;

            case "down":
                this.attackHitbox.setPosition(this.x, this.y + halfH + offset);
                break;
        }


        this.scene.time.delayedCall(150,
            () => this.attackHitbox.body.setEnable(false)
        );


        this.once("animationcomplete-attack_swing", () => {
            this.isAttacking = false;
        });
    }



    // ===========================
    // UPDATE
    // ===========================
    update(cursors) {
        
        if (this.isDead) return;

        if (this.isAttacking) {
            this.setVelocity(0);
            return;
        }

        let moving = false;
        let anim = "idle_down";

        this.setVelocity(0);

        // LEFT
        if (cursors.left.isDown) {
            this.setVelocityX(-this.speed);
            this.setFlipX(false);
            anim = "walk_side";
            this.facing = "left";
            moving = true;
        }

        // RIGHT
        else if (cursors.right.isDown) {
            this.setVelocityX(this.speed);
            this.setFlipX(true);
            anim = "walk_side";
            this.facing = "right";
            moving = true;
        }

        // UP
        if (cursors.up.isDown) {
            this.setVelocityY(-this.speed);
            anim = "walk_up";
            this.facing = "up";
            moving = true;
        }

        // DOWN
        else if (cursors.down.isDown) {
            this.setVelocityY(this.speed);
            anim = "walk_down";
            this.facing = "down";
            moving = true;
        }

        // Normaliza velocidade
        this.body.velocity.normalize().scale(moving ? this.speed : 0);

        if (!moving) {
            anim = anim.replace("walk", "idle");
        }

        if (this.anims.currentAnim.key !== anim) {
            this.anims.play(anim, true);
        }
    }
}
