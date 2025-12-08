// StoryScene.js

export default class StoryScene extends Phaser.Scene {
    constructor() {
        super('StoryScene');
    }

    create() {
        const { width, height } = this.sys.game.config;
        const centerX = width / 2;
        const centerY = height / 2;

        this.add.text(centerX, 80, 'A HISTÓRIA DE CITY FALL', {
            fontSize: '48px',
            fill: '#ffde3d',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        // Define scrollable area
        const scrollAreaX = centerX;
        const scrollAreaY = 200;
        const scrollAreaWidth = width - 100;
        const scrollAreaHeight = height - 350; // Adjusted height to leave space for title and button

        const storyTextContent = [
            'No ano de 2077, a megalópole de Neo-VilaMou está sob ataque constante.',
            'Robôs rebeldes, antes parte da força de trabalho automatizada, viraram-se contra os seus criadores.',
            'A última esperança reside numa antiga torre de energia, o coração da cidade.',
            '',
            'Como o último Guardião da torre, a sua missão é defender o núcleo de energia.',
            'Colete "chips" dos robôs derrubados para aprimorar as defesas e as suas próprias habilidades.',
            'A cada onda, os inimigos tornam-se mais fortes e numerosos.',
            '',
            'O destino de Neo-VilaMou está nas suas mãos.',
            '',
            'Os cientistas da Neo-VilaMou descobriram que a fonte de energia dos robôs está ligada à torre.',
            'Se a torre cair, toda a cidade ficará sem energia e será dominada.',
            'O Guardião deve usar todas as suas habilidades para proteger o último bastião da humanidade.',
            'Novas ameaças emergem das profundezas da cidade, robôs mais poderosos e astutos.',
            'A cada vitória, a esperança de Neo-Lisboa aumenta, mas a um custo terrível.',
            'Será que o Guardião conseguirá resistir à incessante maré de aço e circuitos?',
            'O futuro da humanidade depende do Guardião e da sua coragem.',
            'A batalha final aproxima-se, e o destino da cidade pende por um fio.'
        ];

        // Create the text object with all story content
        const storyText = this.add.text(0, 0, storyTextContent, {
            fontSize: '24px',
            fill: '#ffffff',
            align: 'center',
            wordWrap: { width: scrollAreaWidth },
            lineSpacing: 10
        });

        const textContainer = this.add.container(scrollAreaX, scrollAreaY, [storyText]);
        textContainer.setSize(scrollAreaWidth, scrollAreaHeight);
        textContainer.setScrollFactor(0);

        // Set origin for the text within the container
        storyText.setOrigin(0.5, 0);
        storyText.y = 0; // Initial position at the top of the container

        // Create a graphics object to use as a mask
        const graphics = this.make.graphics();
        graphics.fillRect(scrollAreaX - scrollAreaWidth / 2, scrollAreaY, scrollAreaWidth, scrollAreaHeight);
        const mask = new Phaser.Display.Masks.GeometryMask(this, graphics);
        textContainer.setMask(mask);

        // Make the container interactive to capture scroll events
        const scrollZone = this.add.zone(scrollAreaX, scrollAreaY, scrollAreaWidth, scrollAreaHeight)
            .setOrigin(0.5, 0)
            .setInteractive();

        let isDragging = false;
        let lastPointerY = 0;

        scrollZone.on('pointerdown', (pointer) => {
            isDragging = true;
            lastPointerY = pointer.y;
        });

        scrollZone.on('pointerup', () => {
            isDragging = false;
        });

        scrollZone.on('pointermove', (pointer) => {
            if (isDragging) {
                const dy = pointer.y - lastPointerY;
                storyText.y += dy;
                lastPointerY = pointer.y;
                
                // Clamp text position
                storyText.y = Phaser.Math.Clamp(storyText.y, textContainer.height - storyText.height, 0);
            }
        });

        this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            storyText.y -= deltaY * 0.5; // Adjust scroll speed
            
            // Clamp text position
            storyText.y = Phaser.Math.Clamp(storyText.y, textContainer.height - storyText.height, 0);
        });

        // Botão "VOLTAR AO MENU"
        const backButton = this.add.text(centerX, height - 80, '< VOLTAR AO MENU', {
            fontSize: '32px',
            fill: '#c3c3c3'
        })
        .setOrigin(0.5)
        .setPadding(10)
        .setInteractive({ useHandCursor: true });

        backButton.on('pointerover', () => {
            backButton.setStyle({ fill: '#ffde3d' });
        });

        backButton.on('pointerout', () => {
            backButton.setStyle({ fill: '#c3c3c3' });
        });

        backButton.on('pointerdown', () => {
            this.scene.start('MenuScene');
        });
    }
}
