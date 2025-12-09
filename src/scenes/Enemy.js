// Define a classe Enemy que estende Phaser.Physics.Arcade.Sprite, representando um inimigo no jogo.
export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    
    // Propriedades do inimigo.
    health = 10; // Vida atual do inimigo.
    speed = 50;  // Velocidade de movimento do inimigo.
    targets = null; // Alvos que o inimigo deve atacar (torre, jogador, etc.).
    chipValue = 5; // Valor em "chips" que o inimigo concede ao ser destruído.
    damageValue = 20; // Dano que o inimigo causa.

    // Construtor do inimigo.
    constructor(scene, x, y, spriteKey, targets) {
        super(scene, x, y, spriteKey); // Chama o construtor da classe pai (Phaser.Physics.Arcade.Sprite).

        scene.add.existing(this);      // Adiciona o inimigo à cena.
        scene.physics.add.existing(this); // Adiciona física ao inimigo.

        this.targets = targets; // Define os alvos do inimigo.

        this.setCollideWorldBounds(true); // Faz com que o inimigo colida com os limites do mundo.
        this.setOrigin(0.5);             // Define a origem do sprite no centro.

        this.body.setImmovable(true);    // Impede que o inimigo seja empurrado por colisões.
        this.body.setMaxVelocity(this.speed); // Define a velocidade máxima do inimigo.

        this.body.setSize(20,28); // Define o tamanho do corpo de física.
        this.body.setOffset(6,4); // Define o deslocamento do corpo de física em relação ao sprite.
        
        this.createAnimations(scene); // Cria as animações do inimigo.
        this.anims.play("enemy_idle", true); // Inicia a animação de "idle".
    }



    // ----------------------------------------------------------
    // ANIMAÇÕES
    // ----------------------------------------------------------
    // Cria as animações para o inimigo (idle, walk, attack).
    createAnimations(scene) {
        
        // Animação de "idle" (parado).
        if (!scene.anims.exists("enemy_idle")){
            scene.anims.create({
                key: "enemy_idle",
                frames: scene.anims.generateFrameNumbers("robot_idle",{start:0,end:3}),
                frameRate:4,
                repeat:-1 // Repete indefinidamente.
            });
        }

        // Animação de "walk" (andando).
        if (!scene.anims.exists("enemy_walk")){
            scene.anims.create({
                key: "enemy_walk",
                frames: scene.anims.generateFrameNumbers("robot_walk",{start:0,end:5}),
                frameRate:8,
                repeat:-1 // Repete indefinidamente.
            });
        }

        // Animação de "attack" (atacando).
        if (!scene.anims.exists("enemy_attack")){
            scene.anims.create({
                key: "enemy_attack",
                frames: scene.anims.generateFrameNumbers("robot_attack",{start:0,end:3}),
                frameRate:10,
                repeat:0 // Não repete.
            });
        }
    }



    // ----------------------------------------------------------
    // UPDATE
    // ----------------------------------------------------------
    // Método de atualização chamado a cada frame do jogo.
    update() {

        // Se a vida do inimigo for zero ou menos, ele para de se mover.
        if (this.health <= 0) {
            this.setVelocity(0);
            return;
        }

        // Se não houver alvos definidos, o inimigo para.
        if (!this.targets) {
            this.setVelocity(0);
            return;
        }

        let target = null;

        // Prioriza o alvo primário (torre) se ele tiver vida.
        if (this.targets.primary && this.targets.primary.health > 0) {
            target = this.targets.primary;
        } 
        // Caso contrário, tenta o alvo secundário (jogador).
        else if (this.targets.secondary && this.targets.secondary.health > 0) {
            target = this.targets.secondary;
        }

        // Se um alvo válido for encontrado, o inimigo se move em direção a ele.
        if (target) {
            this.scene.physics.moveToObject(this, target, this.speed);
        } else {
            this.setVelocity(0); // Se não há alvos, para de se mover.
        }

        // Ajusta a direção do sprite (flipX) com base na velocidade horizontal.
        if (this.body.velocity.x > 0) this.setFlipX(true);
        else if (this.body.velocity.x < 0) this.setFlipX(false);

        // Define a profundidade (ordem de renderização) com base na posição Y.
        this.setDepth(this.y);

        // Reproduz a animação de "walk" enquanto o inimigo estiver ativo.
        this.anims.play("enemy_walk", true);
    }



    // ----------------------------------------------------------
    // RECEBER DANO
    // ----------------------------------------------------------
    // Reduz a vida do inimigo pelo valor do 'amount'.
    damage(amount) {
        this.health -= amount;

        // Se a vida cair para zero ou menos, o inimigo é destruído e emite um evento.
        if (this.health <= 0) {
            this.scene.events.emit("robot_killed", this.chipValue); // Emite evento de inimigo morto, passando o valor do chip.
            this.destroy(); // Destrói o objeto inimigo.
        }
    }
}
