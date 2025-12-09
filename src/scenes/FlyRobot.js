// Define a classe FlyRobot, que é um tipo específico de inimigo voador.
// Estende a classe Enemy para herdar comportamentos básicos de inimigo.
export default class FlyRobot extends Enemy {

    /**
     * Construtor para o FlyRobot.
     * @param {Phaser.Scene} scene - A cena atual do jogo.
     * @param {number} x - A posição X inicial do robô.
     * @param {number} y - A posição Y inicial do robô.
     * @param {string} spriteKey - A chave do sprite para o robô voador.
     * @param {object} targets - Os alvos para os quais o robô se moverá (geralmente a torre e o jogador).
     */
    constructor(scene, x, y, spriteKey, targets) {
        // Chama o construtor da classe pai (Enemy).
        // É passada uma spriteKey temporária pois as animações do Enemy base não são usadas por este robô.
        super(scene, x, y, spriteKey, targets);

        // Substituição das propriedades da classe base Enemy com valores específicos para FlyRobot.
        this.health = 4;        // Vida específica do robô voador.
        this.speed = 100;       // Velocidade de movimento específica do robô voador.
        this.chipValue = 2;     // Valor em "chips" concedido ao destruir este robô.
        this.damageValue = 12;  // Dano que este robô causa.

        // Configurações específicas do corpo de física para o FlyRobot.
        this.body.setAllowGravity(false); // Inibe a gravidade, permitindo que o robô voe.
        this.body.setSize(20, 20);        // Define o tamanho do corpo de física para colisões.
        this.body.setOffset(6, 6);        // Define o deslocamento do corpo de física em relação ao sprite.
        
        // A velocidade máxima precisa ser redefinida, pois a velocidade do robô foi alterada.
        this.body.setMaxVelocity(this.speed);

        // A animação inicial para o FlyRobot é diferente da do Enemy base.
        this.anims.play("fly_move"); // Inicia a animação de movimento do robô voador.
    }



    // ===========================
    // ANIMAÇÕES
    // ===========================
    /**
     * Cria as animações específicas para o FlyRobot.
     * Este método substitui o createAnimations da classe Enemy para definir animações de voo.
     * @param {Phaser.Scene} scene - A cena do jogo onde as animações serão criadas.
     */
    createAnimations(scene) {
        // Verifica se a animação "fly_move" já existe para evitar recriá-la.
        if (!scene.anims.exists("fly_move")) {
            scene.anims.create({
                key: "fly_move",
                frames: scene.anims.generateFrameNumbers("enemy_fly", { start:0, end:9 }),
                frameRate: 15,
                repeat: -1 // Repete indefinidamente.
            });
        }
    }


    // ===========================
    // UPDATE
    // ===========================
    /**
     * Método de atualização chamado a cada frame do jogo para o FlyRobot.
     * Contém lógica para movimento em direção ao alvo, virar o sprite e definir a profundidade.
     */
    update() {

        // Se a vida do inimigo for zero ou menos, ou se o corpo de física estiver desativado, o robô para.
        if (this.health <= 0 || !this.body.enable) {
            this.setVelocity(0);
            return;
        }

        let target = null;

        // Prioriza o alvo primário (torre) se ele tiver vida.
        if (this.targets.primary && this.targets.primary.health > 0) {
            target = this.targets.primary;
        } 
        // Caso contrário, tenta o alvo secundário (jogador), se existir.
        else if (this.targets.secondary) {
            target = this.targets.secondary;
        }

        // Se um alvo válido for encontrado, o inimigo se move em direção a ele.
        if (target) {
            this.scene.physics.moveToObject(this, target, this.speed);
        } else {
            this.setVelocity(0); // Se não há alvos, para de se mover.
        }


        // Ajusta a direção do sprite (flipX) com base na velocidade horizontal.
        if (this.body.velocity.x > 0) {
            this.setFlipX(false); // Não inverte se estiver indo para a direita.
        } else if (this.body.velocity.x < 0) {
            this.setFlipX(true);  // Inverte se estiver indo para a esquerda.
        }

        // Define uma profundidade fixa para o FlyRobot, garantindo que ele seja renderizado acima de outros elementos.
        this.setDepth(1500);

        // Reproduz a animação de movimento do robô voador.
        this.anims.play("fly_move", true);
    }
    
    // O método damage(amount) é herdado da classe Enemy e não precisa ser sobrescrito aqui.
