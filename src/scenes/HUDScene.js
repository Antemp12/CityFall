// HUDScene.js

// Define a classe HUDScene que estende Phaser.Scene, responsável por exibir a interface do usuário (HUD).
export default class HUDScene extends Phaser.Scene {

    // Construtor da cena, inicializa o nome da cena.
    constructor() {
        super('HUDScene');
    }

    // Propriedades para armazenar os objetos de texto e imagem do HUD.
    towerText; // Texto que exibe a saúde da torre
    playerText; // Texto que exibe a saúde do jogador
    chipsImage; // Imagem dos "chips" (moeda/recurso)
    chipsCountText; // Texto que exibe a quantidade de chips
    waveText; // Texto que exibe a onda atual
    towerHealthBar; // Barra de vida da torre

    // Método chamado uma vez quando a cena é criada.
    create() {

        // Calcula a posição X central da câmera para posicionar elementos.
        const centerX = this.cameras.main.width / 2;

        // Adiciona o texto "Tower Health" no topo da tela.
        this.towerText = this.add.text(centerX, 20, "Tower Health", {
            fontSize: "20px",
            fill: "#ffffff"
        }).setOrigin(0.5, 0);

        // Cria um objeto gráfico para desenhar a barra de vida da torre.
        this.towerHealthBar = this.add.graphics();
        // Desenha a barra de vida inicial (cheia).
        this.drawTowerHealthBar(1000, centerX); // Saúde total inicial

        // Adiciona o texto da saúde do jogador.
        this.playerText = this.add.text(20,70, "Player: 100", {
            fontSize: "20px",
            fill: "#ffffff"
        });

        // Adiciona a imagem do chip e configura sua posição e escala.
        this.chipsImage = this.add.image(20, 110, "chip").setOrigin(0, 0.5).setScale(0.05);
        // Adiciona o texto que exibe a contagem de chips.
        this.chipsCountText = this.add.text(70, 110, "0", {
            fontSize: "20px",
            fill: "#ffff00"
        }).setOrigin(0, 0.5);

        // Adiciona o texto da onda atual.
        this.waveText = this.add.text(20,130, "Wave: 1", {
            fontSize: "20px",
            fill: "#00ff00"
        });


        // Configura um ouvinte de evento para atualizar o HUD quando dados do registro mudam.
        this.registry.events.on("changedata", this.updateHUD, this);
    }

    // Método para atualizar os elementos do HUD com base nos dados do jogo.
    updateHUD(parent, key, value) {
        // Retorna se a câmera principal não estiver disponível.
        if (!this.cameras.main) return;

        // Atualiza a barra de vida da torre se a chave for "towerHP".
        if (key === "towerHP") {
            this.drawTowerHealthBar(value);
        }
        // Atualiza o texto da saúde do jogador.
        if (key === "playerHP") this.playerText.setText("Player: " + value);
        // Atualiza o texto da contagem de chips.
        if (key === "chips")    this.chipsCountText.setText(value);
        // Atualiza o texto da onda.
        if (key === "wave")     this.waveText.setText("Wave: " + value);
    }

    // Método para desenhar ou atualizar a barra de vida da torre.
    drawTowerHealthBar(health, centerX = this.cameras.main.width / 2) {
        // Limpa a barra de vida anterior.
        this.towerHealthBar.clear();

        const barWidth = 200; // Largura da barra de vida.
        const barX = centerX - barWidth / 2; // Posição X da barra.

        // Desenha o fundo da barra de vida (cor preta).
        this.towerHealthBar.fillStyle(0x000000);
        this.towerHealthBar.fillRect(barX, 45, barWidth, 20);

        // Calcula a porcentagem da vida e define a cor da barra (verde ou vermelha).
        let healthPercent = health / 1000;
        let color = healthPercent > 0.5 ? 0x00ff00 : 0xff0000; // Verde se >50%, vermelho caso contrário
        // Desenha a barra de vida preenchida com a cor apropriada.
        this.towerHealthBar.fillStyle(color);
        this.towerHealthBar.fillRect(barX, 45, barWidth * healthPercent, 20);
    }
}
