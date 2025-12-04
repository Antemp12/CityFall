// HUDScene.js

export default class HUDScene extends Phaser.Scene {
    
    dashBar;
    towerHealthBar; 
    textGold; 
    
    gameScene;

    constructor() {
        super({ key: 'HUDScene' }); 
    }

    create() {
        this.gameScene = this.scene.get('GameScene'); 
        
        if (!this.gameScene) {
            console.error("HUDScene falhou ao encontrar GameScene.");
            return;
        }

        // 1. BARRA DE RECARGA (DASH - Azul)
        this.dashBar = this.add.graphics();
        this.dashBar.setVisible(false); 
        
        // 2. BARRA DE VIDA DA TORRE (Verde)
        this.towerHealthBar = this.add.graphics();
        this.updateTowerHealthBar(1); 
        
        // 3. TEXTO HUD (Gold/Chips e Kills)
        this.textGold = this.add.text(10, 10, 'Chips: 0', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);
        this.add.text(10, 30, 'Kills: 0', { fontSize: '16px', fill: '#fff' }).setScrollFactor(0);
    }

    update() {
        const player = this.gameScene.player;

        if (player) {
            // Atualizar a Vida da Torre
            const towerRatio = this.gameScene.towerHealth / 100;
            this.updateTowerHealthBar(towerRatio);
            
            // Atualizar a Barra de Dash
            const dashRatio = 1 - (player.dashTimer / player.dashCooldown);
            this.updateDashBar(dashRatio);
            
            // Lógica de visibilidade do Dash Bar
            if (player.dashTimer > 0) {
                this.dashBar.setVisible(true); 
            } else if (dashRatio === 1) {
                this.dashBar.setVisible(false); 
            }
        }
    }
    
    // --- FUNÇÃO 1: BARRA DE VIDA DA TORRE (Verde) ---
    updateTowerHealthBar(ratio) {
        const barWidth = 100; 
        const barHeight = 10;
        const xOffset = 960 / 2; // Centro do ecrã
        const yOffset = 10; 

        this.towerHealthBar.clear();
        
        // Fundo Vermelho (Dano/Vazio)
        this.towerHealthBar.fillStyle(0xff0000); 
        this.towerHealthBar.fillRect(xOffset - (barWidth / 2), yOffset, barWidth, barHeight);
        
        // Barra Verde (Vida)
        this.towerHealthBar.fillStyle(0x00ff00); // COR VERDE
        this.towerHealthBar.fillRect(xOffset - (barWidth / 2), yOffset, barWidth * ratio, barHeight);
        
        this.towerHealthBar.setScrollFactor(0); 
    }

    // --- FUNÇÃO 2: BARRA DE RECARGA (Azul) ---
    updateDashBar(ratio) {
        const barWidth = 100; 
        const barHeight = 8;
        const xOffset = 960 - 110; 
        const yOffset = 540 - 20; 

        this.dashBar.clear();
        
        // Fundo Cinzento (Vazio)
        this.dashBar.fillStyle(0x555555);
        this.dashBar.fillRect(xOffset, yOffset, barWidth, barHeight);
        
        // Barra Azul (Recarga)
        this.dashBar.fillStyle(0x0000ff);
        this.dashBar.fillRect(xOffset, yOffset, barWidth * ratio, barHeight);
        
        this.dashBar.setScrollFactor(0); 
    }
}