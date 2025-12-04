// HUDScene.js

export default class HUDScene extends Phaser.Scene {
    
    dashBar;
    towerHealthBar;
    towerHealthBarTitle; 
    textChips; 
    textKills; 
    
    gameScene;

    constructor() {
        super({ key: 'HUDScene' }); 
    }

    preload() {
        this.load.image('chipIcon', 'assets/images/interface/Chip.png'); 
    }

    create() {
        this.gameScene = this.scene.get('GameScene'); 
        
        if (!this.gameScene) {
            console.error("HUDScene falhou ao encontrar GameScene.");
            return;
        }

        // 1. BARRA DE VIDA DA TORRE (Verde)
        this.towerHealthBar = this.add.graphics();
        
        // CRIAÇÃO DO TÍTULO: Já centrado em X=480 com setOrigin(0.5)
        this.towerHealthBarTitle = this.add.text(960 / 2, 12, 'HOPE HEALTH', { 
            fontSize: '14px', 
            fill: '#ffffff', 
            fontFamily: 'Arial, sans-serif'
        }).setOrigin(0.5).setScrollFactor(0);
        
        this.updateTowerHealthBar(1); 
        
        // 2. BARRA DE RECARGA (DASH - Azul)
        this.dashBar = this.add.graphics();
        this.dashBar.setVisible(false); 
        
        // 3. TEXTO E ÍCONES HUD
        this.add.image(20, 45, 'chipIcon')
            .setScrollFactor(0)
            .setOrigin(0.5)
            .setScale(0.035); 
        
        this.textChips = this.add.text(45, 38, '0', { 
            fontSize: '28px', 
            fill: '#ffdf00', 
            fontFamily: 'Verdana, sans-serif'
        }).setScrollFactor(0);
        
        this.textKills = this.add.text(10, 90, 'KILLS: 0', { 
            fontSize: '20px', 
            fill: '#cccccc', 
            fontFamily: 'Verdana, sans-serif'
        }).setScrollFactor(0);
    }

    update() {
        const player = this.gameScene.player;

        if (player) {
            const towerRatio = this.gameScene.towerHealth / 100;
            this.updateTowerHealthBar(towerRatio);
            
            const dashRatio = 1 - (player.dashTimer / player.dashCooldown);
            this.updateDashBar(dashRatio);
            
            if (player.dashTimer > 0) {
                this.dashBar.setVisible(true); 
            } else if (dashRatio === 1) {
                this.dashBar.setVisible(false); 
            }
            
            this.textChips.setText('0'); 
            this.textKills.setText('KILLS: 0');
        }
    }
    
    // --- FUNÇÃO 1: BARRA DE VIDA DA TORRE (Centramento Corrigido) ---
    updateTowerHealthBar(ratio) {
        const barWidth = 400; 
        const barHeight = 15; 
        const xOffset = 960 / 2; // 480
        const yOffset = 40; 
        const titleYOffset = 12; // Posição Y do título

        const barStartX = xOffset - (barWidth / 2); // 480 - 200 = 280
        
        this.towerHealthBar.clear();
        
        // Fundo Vermelho
        this.towerHealthBar.fillStyle(0x880000); 
        this.towerHealthBar.fillRect(barStartX, yOffset, barWidth, barHeight);
        
        // Barra Verde
        this.towerHealthBar.fillStyle(0x00ff00); 
        this.towerHealthBar.fillRect(barStartX, yOffset, barWidth * ratio, barHeight);
        
        // CORREÇÃO: O Título é apenas posicionado em Y, pois já está centrado em X=480 no create().
        this.towerHealthBarTitle.y = titleYOffset; 
        
        this.towerHealthBar.setScrollFactor(0); 
    }

    // --- FUNÇÃO 2: BARRA DE RECARGA (Azul Limpa) ---
    updateDashBar(ratio) {
        const barWidth = 100; 
        const barHeight = 8;
        const xOffset = 960 - 110; 
        const yOffset = 540 - 20; 

        this.dashBar.clear();
        
        this.dashBar.fillStyle(0x555555);
        this.dashBar.fillRect(xOffset, yOffset, barWidth, barHeight);
        
        this.dashBar.fillStyle(0x0000ff);
        this.dashBar.fillRect(xOffset, yOffset, barWidth * ratio, barHeight);
        
        this.dashBar.setScrollFactor(0); 
    }
}