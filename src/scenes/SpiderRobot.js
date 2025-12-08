import Enemy from "./Enemy.js";

export default class SpiderRobot extends Enemy {

    constructor(scene, x, y, spriteKey, targets) {
        // Chamar o construtor da classe Enemy
        super(scene, x, y, spriteKey, targets);

        // Substituir propriedades da classe base
        this.health = 5;
        this.speed = 70;
        this.chipValue = 1;
        this.damageValue = 10;
        
        // Configurações específicas do corpo para o SpiderRobot
        this.body.setSize(20,15);
        this.body.setOffset(6,17);

        // A velocidade máxima precisa ser redefinida, pois a velocidade foi alterada
        this.body.setMaxVelocity(this.speed);

        // A animação inicial é diferente da do Enemy base
        this.anims.play("spider_walk");
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    // Este método substitui o createAnimations da classe Enemy
    createAnimations(scene) {
        // Adiciona a verificação para evitar recriar a animação
        if (!scene.anims.exists("spider_walk")) {
            scene.anims.create({
                key: "spider_walk",
                frames: scene.anims.generateFrameNumbers("enemy_spider", { start:0, end:5 }),
                frameRate: 10,
                repeat: -1
            });
        }
    }



    // ===========================
    // UPDATE
    // ===========================
    // O método update é mantido porque o SpiderRobot tem uma animação diferente
    update() {

        if (this.health <= 0 || !this.body.enable) {
            this.setVelocity(0);
            return;
        }

        let target = null;

        if (this.targets.primary && this.targets.primary.health > 0) {
            target = this.targets.primary;
        } 
        else if (this.targets.secondary && this.targets.secondary.health > 0) {
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

    // O método damage(amount) foi removido. Agora será herdado da classe Enemy.
}
