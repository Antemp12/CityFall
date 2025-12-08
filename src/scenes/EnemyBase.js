export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene,x,y,spriteKey,targets){
        super(scene,x,y,spriteKey);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.targets = targets;

        this.baseHealth = 1;
        this.baseDamage = 1;
        this.baseSpeed = 50;

        this.health = this.baseHealth;
        this.speed = this.baseSpeed;

        this.chipValue = 1;

        this.setCollideWorldBounds(true);
    }

    applyWaveBonus(wave){
        const boost = Math.floor(wave / 3);

        this.health = this.baseHealth + boost * 2;
        this.damage = this.baseDamage + boost * 1;
        this.speed = this.baseSpeed + boost * 5;
    }

    damage(amount){
        this.health -= amount;

        if(this.health <= 0){
            this.scene.events.emit("robot_killed", this.chipValue);
            this.destroy();
        }
    }
}
