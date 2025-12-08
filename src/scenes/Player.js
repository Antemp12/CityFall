export default class Player extends Phaser.Physics.Arcade.Sprite {

    // ESTADOS
    isAttacking = false;
    isDead = false;

    maxHealth = 10;
    health = 10;

    speed = 200;

    facing = "down";     // direção do ataque

    constructor(scene, x, y, key){
        super(scene, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        this.body.setSize(24,48);
        this.body.setOffset(12,8);

        // INPUT
        this.keys = scene.input.keyboard.addKeys("W,S,A,D,SPACE");

        // HITBOX ATAQUE
        this.attackHitbox = scene.add.rectangle(0,0,50,50,0xff0000,0);
        scene.physics.add.existing(this.attackHitbox);

        this.attackHitbox.body.setAllowGravity(false);
        this.attackHitbox.body.setEnable(false);

        this.createAnimations(scene);

        this.anims.play("idle_down", true);

    }



    // ===========================================================
    // ANIMAÇÕES
    // ===========================================================
    createAnimations(scene){

        scene.anims.create({
            key: "idle_down",
            frames: scene.anims.generateFrameNumbers("Idle",{start:0,end:7}),
            frameRate: 6,
            repeat:-1
        });

        scene.anims.create({
            key: "walk_down",
            frames: scene.anims.generateFrameNumbers("walk",{start:0,end:7}),
            frameRate: 12,
            repeat:-1
        });

        scene.anims.create({
            key: "walk_up",
            frames: scene.anims.generateFrameNumbers("walk",{start:25,end:32}),
            frameRate: 12,
            repeat:-1
        });

        scene.anims.create({
            key: "walk_side",
            frames: scene.anims.generateFrameNumbers("walk",{start:16,end:23}),
            frameRate: 12,
            repeat:-1
        });


        // ATAQUE COM APENAS 2 FRAMES
        scene.anims.create({
            key:"attack_swing",
            frames: scene.anims.generateFrameNumbers("attack",{start:0,end:1}),
            frameRate:10,
            repeat:0
        });
    }



    // ===========================================================
    // DANO
    // ===========================================================
    takeDamage(amount){

        if (this.isDead) return;

        this.health -= amount;

        if (this.health <= 0){
            this.isDead = true;
            this.health = 0;

            this.scene.events.emit("gameover");
        }
    }



    // ===========================================================
    // ATAQUE
    // ===========================================================
    attack(){

        if (this.isAttacking || this.isDead) return;

        this.isAttacking = true;

        this.attackHitbox.body.setEnable(true);

        this.anims.play("attack_swing");

        const offset = 40;

        switch(this.facing){
            case "left":
                this.attackHitbox.setPosition(this.x - offset, this.y);
                break;

            case "right":
                this.attackHitbox.setPosition(this.x + offset, this.y);
                break;

            case "up":
                this.attackHitbox.setPosition(this.x, this.y - offset);
                break;

            case "down":
                this.attackHitbox.setPosition(this.x, this.y + offset);
                break;
        }


        // DESACTIVAR HITBOX
        this.scene.time.delayedCall(150, () => {
            this.attackHitbox.body.setEnable(false);
        });


        // TERMINAR ATAQUE
        this.once("animationcomplete-attack_swing", () => {
            this.isAttacking = false;
        });
    }



    // ===========================================================
    // UPDATE
    // ===========================================================
    update(){

        if (this.isDead) {
            this.setVelocity(0);
            return;
        }

        // ATAQUE
        if (Phaser.Input.Keyboard.JustDown(this.keys.SPACE)){
            this.attack();
        }

        if (this.isAttacking){
            this.setVelocity(0);
            return;
        }


        let anim = "idle_down";
        let moving = false;

        this.setVelocity(0);


        // LEFT
        if (this.keys.A.isDown){
            this.setVelocityX(-this.speed);
            this.setFlipX(false);

            anim = "walk_side";
            this.facing = "left";
            moving = true;
        }

        // RIGHT
        else if (this.keys.D.isDown){
            this.setVelocityX(this.speed);
            this.setFlipX(true);

            anim = "walk_side";
            this.facing = "right";
            moving = true;
        }


        // UP
        if (this.keys.W.isDown){
            this.setVelocityY(-this.speed);

            anim = "walk_up";
            this.facing = "up";
            moving = true;
        }

        // DOWN
        else if (this.keys.S.isDown){
            this.setVelocityY(this.speed);

            anim = "walk_down";
            this.facing = "down";
            moving = true;
        }


        // NORMALIZAR VELOCIDADE
        this.body.velocity.normalize().scale(moving ? this.speed : 0);


        // IDLE
        if (!moving){
            anim = anim.replace("walk","idle");
        }


        // TROCAR ANIMAÇÃO
        if (this.anims.currentAnim.key !== anim){
            this.anims.play(anim,true);
        }
    }
}
