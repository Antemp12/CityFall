/**
 * @file Player.js
 * @description Representa o personagem jogador no jogo, lidando com movimento, ataques, saúde e animações.
 * @exports Player
 */

/**
 * @class Player
 * @augments Phaser.Physics.Arcade.Sprite
 * @description Gerencia o estado do jogador, ações e interações dentro do mundo do jogo.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {

    /**
     * @property {boolean} isAttacking - Flag para indicar se o jogador está atualmente realizando um ataque.
     * @default false
     */
    isAttacking = false;
    /**
     * @property {boolean} isDead - Flag para indicar se o personagem jogador está morto.
     * @default false
     */
    isDead = false;

    /**
     * @property {number} maxHealth - Pontos de vida máximos que o jogador pode ter.
     * @default 100
     */
    maxHealth = 100;
    /**
     * @property {number} health - Pontos de vida atuais do jogador.
     * @default 100
     */
    health = 100;
    /**
     * @property {number} damage - Valor de dano causado pelo ataque do jogador.
     * @default 5
     */
    damage = 5;

    /**
     * @property {number} speed - Velocidade de movimento do jogador.
     * @default 200
     */
    speed = 200;
    /**
     * @property {string} facing - Direção para a qual o jogador está atualmente virado (ex: "down", "up", "left", "right").
     * @default "down"
     */
    facing = "down";
    /**
     * @property {number} lastDamageTime - Timestamp da última vez que o jogador sofreu dano, usado para frames de invulnerabilidade.
     * @default 0
     */
    lastDamageTime = 0;

    /**
     * @property {Phaser.GameObjects.Rectangle} attackHitbox - A hitbox usada para os ataques do jogador.
     */
    attackHitbox;

    /**
     * Cria uma instância de Player.
     * @param {Phaser.Scene} scene - A cena à qual este jogador pertence.
     * @param {number} x - A posição X inicial do jogador.
     * @param {number} y - A posição Y inicial do jogador.
     * @param {string} spriteKey - A chave para a folha de sprites a ser usada para o jogador.
     */
    constructor(scene, x, y, spriteKey){
        super(scene,x,y,spriteKey);

        // Adiciona o jogador à lista de exibição da cena e ao sistema de física.
        scene.add.existing(this);
        scene.physics.add.existing(this);

        // Impede que o jogador se mova para fora dos limites do mundo.
        this.setCollideWorldBounds(true);

        // Define o tamanho e o deslocamento do corpo físico para uma detecção de colisão precisa.
        this.body.setSize(24,48);
        this.body.setOffset(12,8);

        // Cria todas as animações necessárias para o jogador.
        this.createAnimations(scene);

        // Cria a hitbox de ataque, inicialmente invisível e desabilitada.
        this.attackHitbox = scene.add.rectangle(0,0,50,50,0xff0000,0);
        scene.physics.add.existing(this.attackHitbox);

        // Configura a hitbox de ataque para não ser afetada pela gravidade e a desabilita.
        this.attackHitbox.body.setAllowGravity(false);
        this.attackHitbox.body.enable = false;

        // Reproduz a animação ociosa padrão.
        this.anims.play("idle_down");
    }


    /**
     * Cria todas as animações para o personagem jogador.
     * @param {Phaser.Scene} scene - A cena usada para criar as animações.
     */
    createAnimations(scene){
        // Garante que as animações sejam criadas apenas uma vez para evitar erros de recriação.

        // Animação ociosa virada para baixo.
        if (!scene.anims.exists("idle_down")){
            scene.anims.create({
                key:"idle_down",
                frames: scene.anims.generateFrameNumbers("Idle",{start:0,end:7}),
                frameRate:6,
                repeat:-1 // Repete indefinidamente
            });
        }

        // Animação de caminhada virada para baixo.
        if (!scene.anims.exists("walk_down")){
            scene.anims.create({
                key:"walk_down",
                frames: scene.anims.generateFrameNumbers("walk",{start:0,end:7}),
                frameRate:12,
                repeat:-1
            });
        }

        // Animação de caminhada virada para cima.
        if (!scene.anims.exists("walk_up")){
            scene.anims.create({
                key:"walk_up",
                frames: scene.anims.generateFrameNumbers("walk",{start:25,end:32}),
                frameRate:12,
                repeat:-1
            });
        }

        // Animação de caminhada virada para os lados (esquerda/direita, gerenciado por flipX).
        if (!scene.anims.exists("walk_side")){
            scene.anims.create({
                key:"walk_side",
                frames: scene.anims.generateFrameNumbers("walk",{start:16,end:23}),
                frameRate:12,
                repeat:-1
            });
        }

        // Animação de ataque.
        if (!scene.anims.exists("attack_swing")){
            scene.anims.create({
                key:"attack_swing",
                frames: scene.anims.generateFrameNumbers("attack_anim",{start:2,end:3}),
                frameRate:10,
                repeat:0 // Toca uma vez
            });
        }
    }


    /**
     * Reduz a saúde do jogador em uma quantidade especificada.
     * Aciona o fim de jogo se a saúde cair para ou abaixo de zero.
     * @param {number} amount - A quantidade de dano a ser recebida.
     */
    takeDamage(amount){
        // Se o jogador já estiver morto, não faz nada.
        if (this.isDead) return;

        this.health -= amount;

        // Atualiza a saúde do jogador no registro da cena para exibição na UI.
        this.scene.registry.set("playerHP", this.health);

        // Verifica se a saúde do jogador caiu para zero ou abaixo.
        if (this.health <= 0){
            this.isDead = true;
            this.health = 0; // Garante que a saúde não fique abaixo de zero visualmente.

            // Emite um evento de fim de jogo para a cena.
            this.scene.events.emit("gameover");
        }
    }


    /**
     * Lida com a ação de ataque do jogador, incluindo animação e ativação da hitbox.
     */
    handleAttack(){
        // Impede o ataque se já estiver atacando ou morto.
        if (this.isAttacking || this.isDead) return;

        this.isAttacking = true;
        this.attackHitbox.body.enable = true; // Habilita a hitbox para detecção de colisão durante o ataque.

        this.anims.play("attack_swing"); // Reproduz a animação de ataque.

        const offset = 40; // Distância da hitbox do jogador.

        // Posiciona a hitbox de ataque com base na direção atual do jogador.
        if (this.facing === "left")  this.attackHitbox.setPosition(this.x - offset, this.y);
        if (this.facing === "right") this.attackHitbox.setPosition(this.x + offset, this.y);
        if (this.facing === "up")    this.attackHitbox.setPosition(this.x, this.y - offset);
        if (this.facing === "down")  this.attackHitbox.setPosition(this.x, this.y + offset);

        // Desabilita a hitbox de ataque após um curto atraso.
        this.scene.time.delayedCall(150,
            () => this.attackHitbox.body.enable = false
        );

        // Redefine o estado de ataque assim que a animação de ataque for concluída.
        this.once("animationcomplete-attack_swing", () => {
            this.isAttacking = false;
        });
    }


    /**
     * O loop de atualização principal para o jogador, lidando com movimento, entrada e animações.
     * @param {object} cursors - Um objeto contendo referências às teclas de entrada (ex: teclas de seta).
     */
    update(cursors){
        // Se o jogador estiver morto, para todo o movimento e sai.
        if (this.isDead) {
            this.setVelocity(0);
            return;
        }

        // Se o jogador estiver atacando, para todo o movimento e sai (a animação de ataque tem precedência).
        if (this.isAttacking){
            this.setVelocity(0);
            return;
        }

        let vx = 0; // Velocidade horizontal.
        let vy = 0; // Velocidade vertical.

        // Lida com o movimento horizontal com base na entrada do cursor.
        if (cursors.left.isDown){
            vx = -this.speed;
            this.facing = "left";
        }
        else if (cursors.right.isDown){
            vx = this.speed;
            this.facing = "right";
        }

        // Lida com o movimento vertical com base na entrada do cursor.
        if (cursors.up.isDown){
            vy = -this.speed;
            // Só muda a direção para "up" se não estiver movendo horizontalmente para priorizar a direção horizontal.
            if (vx === 0) {
                this.facing = "up";
            }
        }
        else if (cursors.down.isDown){
            vy = this.speed;
            // Só muda a direção para "down" se não estiver movendo horizontalmente.
            if (vx === 0) {
                this.facing = "down";
            }
        }

        this.setVelocity(vx,vy); // Aplica a velocidade calculada.

        // Inverte o sprite horizontalmente se estiver virado para a esquerda para manter a orientação correta.
        if (this.facing === "left") {
            this.setFlipX(false);
        } else if (this.facing === "right") {
            this.setFlipX(true); // Inverte para a direção direita
        }

        let anim = "idle_down"; // A animação padrão é ociosa para baixo.

        // Determina a animação de caminhada correta com base no movimento e na direção.
        if (vx !== 0 || vy !== 0){
            if (this.facing === "up") anim = "walk_up";
            else if (this.facing === "down") anim = "walk_down";
            else anim = "walk_side"; // Cobre "left" e "right"
        }

        this.anims.play(anim, true); // Reproduz a animação determinada.
    }
}
