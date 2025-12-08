// HUDScene.js

export default class HUDScene extends Phaser.Scene {
    
    // Elementos gráficos e de texto
    dashBar; 
    towerHealthBar; // Reutilizada para a barra de vida do jogador
    towerHealthBarTitle; 
    textChips; 
    textKills; 
    textPlayerHealth; // HP em percentagem

    gameScene;

    constructor() { super('HUDScene'); }
    
    // --- PRELOAD ---
    preload() { 
        this.load.image('chipIcon', 'assets/images/interface/Chip.png'); 
    }

    create() {
        // Obter a referência para a cena principal
        this.gameScene = this.scene.get('GameScene'); 
        
        if (!this.gameScene) {
            console.error("HUDScene falhou ao encontrar GameScene.");
            return;
        }

        // --- 1. BARRA DE VIDA DO JOGADOR (Topo Esquerdo) ---
        const barX = 10;
        const barY = 10;
        const barWidth = 200;
        const barHeight = 20;

        // Fundo e Título da Barra de Vida
        this.add.rectangle(barX, barY, barWidth, barHeight, 0x000000).setOrigin(0).setStrokeStyle(1, 0xFFFFFF).setScrollFactor(0);
        this.towerHealthBar = this.add.rectangle(barX, barY, barWidth, barHeight, 0x228B22).setOrigin(0).setScrollFactor(0);
        
        this.towerHealthBarTitle = this.add.text(barX + barWidth / 2, barY + barHeight / 2, 'PLAYER HEALTH', {
            fontSize: '12px',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0);

        // --- 2. CONTADOR DE CHIPS (Moeda - Topo Esquerdo) ---
        this.add.image(20, 65, 'chipIcon') // Posição Y ajustada
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setScale(0.035); 
        
        this.textChips = this.add.text(45, 55, '0', { 
            fontSize: '28px', 
            fill: '#ffdf00', 
            fontFamily: 'Verdana, sans-serif'
        }).setScrollFactor(0);
        
        // --- 3. BARRA DE RECARGA (DASH - Fundo Direito) ---
        this.dashBar = this.add.graphics();
        this.dashBar.setVisible(false); 

        // --- 4. PERCENTAGEM DE VIDA (Canto Inferior Direito) ---
        this.textPlayerHealth = this.add.text(950, 530, 'HP: 100%', { 
            fontSize: '24px', 
            fill: '#ffffff', 
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(1).setScrollFactor(0); 

        // Outros textos (Kills)
        this.textKills = this.add.text(10, 90, 'KILLS: 0', { 
            fontSize: '20px', 
            fill: '#cccccc', 
            fontFamily: 'Verdana, sans-serif'
        }).setScrollFactor(0);
    }

    update() {
        const player = this.gameScene.player;
        const gameScene = this.gameScene;

        if (player) {
            // --- 1. ATUALIZAÇÃO DA VIDA DO JOGADOR ---
            const healthRatio = player.health / player.maxHealth;
            const percent = Math.max(0, Math.round(healthRatio * 100));
            
            // Barra de vida (Preenchimento)
            this.updatePlayerHealthBar(healthRatio); 
            // Texto HP%
            this.textPlayerHealth.setText(`HP: ${percent}%`);
            
            // --- 2. ATUALIZAÇÃO DE CHIPS E KILLS ---
            this.textChips.setText(gameScene.playerChips.toString());
            // this.textKills.setText(`KILLS: ${gameScene.playerKills}`); // Se existir a variável playerKills

            // --- 3. ATUALIZAÇÃO DA BARRA DE DASH ---
            const dashRatio = 1 - (player.dashTimer / player.dashCooldown);
            this.updateDashBar(dashRatio);
            
            // Lógica de visibilidade
            if (player.dashTimer > 0) {
                this.dashBar.setVisible(true); 
            } else if (dashRatio === 1) {
                this.dashBar.setVisible(false); 
            }
        }
    }
    
    // --- FUNÇÃO 1: BARRA DE VIDA DO JOGADOR (Verde/Amarelo/Vermelho) ---
    updatePlayerHealthBar(ratio) {
        const barWidth = 200; 
        const newWidth = Math.max(0, barWidth * ratio); 
        this.towerHealthBar.width = newWidth;
        
        // Mudar a cor com base na vida
        if (ratio < 0.3) {
            this.towerHealthBar.setFillStyle(0xFF4500); // Vermelho/Laranja
        } else if (ratio < 0.6) {
            this.towerHealthBar.setFillStyle(0xFFFF00); // Amarelo
        } else {
            this.towerHealthBar.setFillStyle(0x228B22); // Verde
        }
    }

    // --- FUNÇÃO 2: BARRA DE RECARGA (Azul Limpa) ---
    updateDashBar(ratio) {
        const barWidth = 100; 
        const barHeight = 8;
        const xOffset = 960 - 110; 
        const yOffset = 540 - 20; 

        this.dashBar.clear();
        
        // Fundo Cinzento
        this.dashBar.fillStyle(0x555555);
        this.dashBar.fillRect(xOffset, yOffset, barWidth, barHeight);
        
        // Barra Azul
        this.dashBar.fillStyle(0x0000ff);
        this.dashBar.fillRect(xOffset, yOffset, barWidth * ratio, barHeight);
        
        this.dashBar.setScrollFactor(0); 
    }
}