import Enemy from "./Enemy.js";

export default class FlyRobot extends Enemy {

    constructor(scene, x, y, spriteKey, targets) {
        // Chamar o construtor da classe Enemy, mas passar uma spriteKey temporária
        // porque as animações do Enemy base não são necessárias.
        super(scene, x, y, spriteKey, targets);

        // Substituir propriedades da classe base
        this.health = 4;
        this.speed = 100;
        this.chipValue = 2;
        this.damageValue = 12;

        // Configurações específicas do corpo para o FlyRobot
        this.body.setAllowGravity(false);
        this.body.setSize(20,20);
        this.body.setOffset(6,6);
        
        // A velocidade máxima precisa ser redefinida, pois a velocidade foi alterada
        this.body.setMaxVelocity(this.speed);

        // A animação inicial é diferente da do Enemy base
        this.anims.play("fly_move");
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    // Este método substitui o createAnimations da classe Enemy
    createAnimations(scene) {
        // Adiciona a verificação para evitar recriar a animação
        if (!scene.anims.exists("fly_move")) {
            scene.anims.create({
                key: "fly_move",
                frames: scene.anims.generateFrameNumbers("enemy_fly", { start:0, end:9 }),
                frameRate: 15,
                repeat: -1
            });
        }
    }



    // ===========================
    // UPDATE
    // ===========================
    // O método update é mantido porque o FlyRobot tem uma lógica de profundidade e animação diferente
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


        this.setDepth(1500); // Profundidade fixa para o FlyRobot

        this.anims.play("fly_move", true);
    }
    
    // O método damage(amount) foi removido. Agora será herdado da classe Enemy.
}
