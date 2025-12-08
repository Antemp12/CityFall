export default class Player extends Phaser.Physics.Arcade.Sprite {

    isAttacking = false;
    isDead = false;

    maxHealth = 100;
    health = 100;
    damage = 5;

    speed = 200;
    facing = "down";
    lastDamageTime = 0;


    constructor(scene, x, y, spriteKey){
        super(scene,x,y,spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        this.body.setSize(24,48);
        this.body.setOffset(12,8);

        this.createAnimations(scene);

        this.attackHitbox = scene.add.rectangle(0,0,50,50,0xff0000,0);
        scene.physics.add.existing(this.attackHitbox);

        this.attackHitbox.body.setAllowGravity(false);
        this.attackHitbox.body.enable = false;

        this.anims.play("idle_down");
    }



    // ----------------------------------------------------------
    // ANIMAÇÕES
    // ----------------------------------------------------------
    createAnimations(scene){

        if (!scene.anims.exists("idle_down")){
            scene.anims.create({
                key:"idle_down",
                frames: scene.anims.generateFrameNumbers("Idle",{start:0,end:7}),
                frameRate:6,
                repeat:-1
            });
        }

        if (!scene.anims.exists("walk_down")){
            scene.anims.create({
                key:"walk_down",
                frames: scene.anims.generateFrameNumbers("walk",{start:0,end:7}),
                frameRate:12,
                repeat:-1
            });
        }

        if (!scene.anims.exists("walk_up")){
            scene.anims.create({
                key:"walk_up",
                frames: scene.anims.generateFrameNumbers("walk",{start:25,end:32}),
                frameRate:12,
                repeat:-1
            });
        }

        if (!scene.anims.exists("walk_side")){
            scene.anims.create({
                key:"walk_side",
                frames: scene.anims.generateFrameNumbers("walk",{start:16,end:23}),
                frameRate:12,
                repeat:-1
            });
        }

        if (!scene.anims.exists("attack_swing")){
            scene.anims.create({
                key:"attack_swing",
                frames: scene.anims.generateFrameNumbers("attack_anim",{start:2,end:3}),
                frameRate:10,
                repeat:0
            });
        }
    }



    // ----------------------------------------------------------
    // DANO
    // ----------------------------------------------------------
    takeDamage(amount){

        if (this.isDead) return;

        this.health -= amount;

        this.scene.registry.set("playerHP", this.health);

        if (this.health <= 0){
            this.isDead = true;
            this.health = 0;

            this.scene.events.emit("gameover");
        }
    }



    // ----------------------------------------------------------
    // ATAQUE
    // ----------------------------------------------------------
    handleAttack(){

        if (this.isAttacking || this.isDead) return;

        this.isAttacking = true;

        this.attackHitbox.body.enable = true;

        this.anims.play("attack_swing");

        const offset = 40;

        if (this.facing === "left")  this.attackHitbox.setPosition(this.x - offset, this.y);
        if (this.facing === "right") this.attackHitbox.setPosition(this.x + offset, this.y);
        if (this.facing === "up")    this.attackHitbox.setPosition(this.x, this.y - offset);
        if (this.facing === "down")  this.attackHitbox.setPosition(this.x, this.y + offset);

        this.scene.time.delayedCall(150,
            () => this.attackHitbox.body.enable = false
        );

        this.once("animationcomplete-attack_swing", () => {
            this.isAttacking = false;
        });
    }



    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------
    update(cursors){

        if (this.isDead) {
            this.setVelocity(0);
            return;
        }

        if (this.isAttacking){
            this.setVelocity(0);
            return;
        }

        let vx = 0;
        let vy = 0;

        if (cursors.left.isDown){
            vx = -this.speed;
            this.facing = "left";
        }
        else if (cursors.right.isDown){
            vx = this.speed;
            this.facing = "right";
        }

        if (cursors.up.isDown){
            vy = -this.speed;
            if (vx === 0) { // Only change facing to up if not moving horizontally
                this.facing = "up";
            }
        }
        else if (cursors.down.isDown){
            vy = this.speed;
            if (vx === 0) { // Only change facing to down if not moving horizontally
                this.facing = "down";
            }
        }

        this.setVelocity(vx,vy);

        if (this.facing === "left") {
            this.setFlipX(false);
        } else if (this.facing === "right") {
            this.setFlipX(true);
        }

        let anim = "idle_down";

        if (vx !== 0 || vy !== 0){
            if (this.facing === "up") anim = "walk_up";
            else if (this.facing === "down") anim = "walk_down";
            else anim = "walk_side";
        }

        this.anims.play(anim, true);
    }
}

