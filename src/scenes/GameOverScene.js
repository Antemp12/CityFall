// GameOverScene.js
// Esta cena é exibida quando o jogo termina, mostrando estatísticas do jogo e opções para reiniciar ou ir para o menu principal.

export default class GameOverScene extends Phaser.Scene {

    /**
     * Construtor para a GameOverScene.
     * Define o nome da cena como "GameOverScene".
     */
    constructor() {
        super("GameOverScene");
    }

    /**
     * O método `create` é chamado quando a cena é iniciada.
     * @param {object} data - Dados passados para a cena, contendo estatísticas do jogo (kills, chips, time, wave).
     */
    create(data) {
        // Cria um retângulo de fundo escuro semi-transparente para melhorar a visibilidade do texto.
        const bg = this.add.rectangle(
            this.cameras.main.width / 2,    // Centraliza horizontalmente
            this.cameras.main.height / 2,   // Centraliza verticalmente
            600,                            // Largura do retângulo
            400,                            // Altura do retângulo
            0x000000,                       // Cor (preto)
            0.8                             // Alpha (80% opaco)
        ).setOrigin(0.5);                   // Define a origem no centro do retângulo
        
        // Impede que o fundo role com a câmara.
        bg.setScrollFactor(0);

        // Exibe o título "GAME OVER".
        this.add.text(
            this.cameras.main.width / 2,        // Centraliza horizontalmente
            this.cameras.main.height / 2 - 150, // Posição acima do centro
            "GAME OVER",                        // Conteúdo do texto
            {
                fontSize: "64px",               // Tamanho da fonte
                fill: "#ff0000",                // Cor do texto (vermelho)
                fontStyle: "bold"               // Estilo da fonte (negrito)
            }
        ).setOrigin(0.5).setScrollFactor(0);    // Centraliza a origem e impede a rolagem

        // Exibe as estatísticas do jogo passadas da GameScene.
        this.add.text(
            this.cameras.main.width / 2,        // Centraliza horizontalmente
            this.cameras.main.height / 2 - 50,  // Posição ligeiramente acima do centro
            `Mortes: ${data.kills}\nChips: ${data.chips}\nTempo: ${data.time}s\nOnda: ${data.wave}`, // Estatísticas formatadas
            {
                fontSize: "24px",               // Tamanho da fonte
                fill: "#ffffff",                // Cor do texto (branco)
                align: "center"                 // Alinhamento do texto ao centro
            }
        ).setOrigin(0.5).setScrollFactor(0);    // Centraliza a origem e impede a rolagem

        // Cria o botão "Restart".
        const restartButton = this.add.text(
            this.cameras.main.width / 2 - 100,  // Posição à esquerda do centro
            this.cameras.main.height / 2 + 100, // Posição abaixo do centro
            "Reiniciar",                        // Texto do botão
            {
                fontSize: "32px",               // Tamanho da fonte
                fill: "#00ff00",                // Cor padrão do texto (verde)
                fontStyle: "bold"               // Estilo da fonte (negrito)
            }
        ).setOrigin(0.5).setInteractive().setScrollFactor(0); // Centraliza a origem, torna interativo, impede a rolagem

        // Adiciona um listener de evento para quando o botão de reiniciar é clicado.
        restartButton.on('pointerdown', () => {
            this.scene.stop('GameOverScene'); // Para a cena atual de Game Over
            this.scene.stop('HUDScene');       // Para a cena HUD
            this.scene.start('GameScene');     // Inicia uma nova GameScene
        });

        // Adiciona um listener de evento para quando o ponteiro passa por cima do botão de reiniciar.
        restartButton.on('pointerover', () => {
            restartButton.setStyle({ fill: '#ffff00' }); // Altera a cor do texto para amarelo ao passar o mouse
        });

        // Adiciona um listener de evento para quando o ponteiro sai do botão de reiniciar.
        restartButton.on('pointerout', () => {
            restartButton.setStyle({ fill: '#00ff00' }); // Reverte a cor do texto para verde
        });

        // Cria o botão "Main Menu".
        const menuButton = this.add.text(
            this.cameras.main.width / 2 + 100,  // Posição à direita do centro
            this.cameras.main.height / 2 + 100, // Posição abaixo do centro, alinhado com o botão de reiniciar
            "Menu Principal",                   // Texto do botão
            {
                fontSize: "32px",               // Tamanho da fonte
                fill: "#00ff00",                // Cor padrão do texto (verde)
                fontStyle: "bold"               // Estilo da fonte (negrito)
            }
        ).setOrigin(0.5).setInteractive().setScrollFactor(0); // Centraliza a origem, torna interativo, impede a rolagem

        // Adiciona um listener de evento para quando o botão do menu principal é clicado.
        menuButton.on('pointerdown', () => {
            window.location.reload(); // Recarrega a página inteira para voltar ao estado inicial (geralmente o menu principal)
        });

        // Adiciona um listener de evento para quando o ponteiro passa por cima do botão do menu principal.
        menuButton.on('pointerover', () => {
            menuButton.setStyle({ fill: '#ffff00' }); // Altera a cor do texto para amarelo ao passar o mouse
        });

        // Adiciona um listener de evento para quando o ponteiro sai do botão do menu principal.
        menuButton.on('pointerout', () => {
            menuButton.setStyle({ fill: '#00ff00' }); // Reverte a cor do texto para verde
        });
    }
}
