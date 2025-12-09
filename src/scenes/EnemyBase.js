// Define a classe base para inimigos, estendendo Phaser.Physics.Arcade.Sprite.
export default class EnemyBase extends Phaser.Physics.Arcade.Sprite {
    
    // Construtor da classe EnemyBase.
    constructor(scene,x,y,spriteKey,targets){
        super(scene,x,y,spriteKey); // Chama o construtor da classe pai.

        scene.add.existing(this);      // Adiciona o inimigo à cena.
        scene.physics.add.existing(this); // Adiciona física ao inimigo.

        this.targets = targets; // Define os alvos do inimigo.

        // Define os atributos base do inimigo.
        this.baseHealth = 1;
        this.baseDamage = 1;
        this.baseSpeed = 50;

        // Inicializa a saúde e velocidade com os valores base.
        this.health = this.baseHealth;
        this.speed = this.baseSpeed;

        this.chipValue = 1; // Valor em chips ao ser destruído.

        this.setCollideWorldBounds(true); // Colide com os limites do mundo.
    }

    // Aplica bônus de acordo com a onda atual do jogo.
    applyWaveBonus(wave){
        const boost = Math.floor(wave / 3); // Calcula o bônus a cada 3 ondas.

        this.health = this.baseHealth + boost * 2; // Aumenta a saúde.
        this.damage = this.baseDamage + boost * 1; // Aumenta o dano.
        this.speed = this.baseSpeed + boost * 5;   // Aumenta a velocidade.
    }

    // Método para o inimigo receber dano.
    damage(amount){
        this.health -= amount; // Reduz a saúde.

        // Se a saúde for zero ou menos, o inimigo é destruído.
        if(this.health <= 0){
            this.scene.events.emit("robot_killed", this.chipValue); // Emite evento de inimigo morto.
            this.destroy(); // Remove o inimigo da cena.
        }
    }
}
