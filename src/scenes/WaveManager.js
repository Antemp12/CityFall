export default class WaveManager {

    scene;

    wave = 1;

    nextWaveTime = 0;

    baseCount = 3;          // inimigos iniciais
    countIncrease = 2;     // +2 inimigos por wave
    strengthEvery = 3;     // aumenta força a cada 3 waves

    enemyStats = {
        health: 10,
        damage: 5,
        speed: 50
    };

    constructor(scene, targets){
        this.scene = scene;
        this.targets = targets;
    }



    // ===========================================================
    // COMEÇA SISTEMA
    // ===========================================================
    start(){
        this.nextWaveTime = this.scene.time.now + 10000;
    }



    // ===========================================================
    // UPDATE (chamado no GameScene.update)
    // ===========================================================
    update(){

        if (!this.scene) return;

        if (this.scene.time.now >= this.nextWaveTime){
            this.startWave();
            this.nextWaveTime = this.scene.time.now + 10000;
        }
    }



    // ===========================================================
    // COMEÇA UMA WAVE
    // ===========================================================
    startWave(){

        const numEnemies = this.baseCount + (this.wave - 1) * this.countIncrease;

        // aumenta força a cada X waves
        if (this.wave % this.strengthEvery === 0){
            this.enemyStats.health += 5;
            this.enemyStats.damage += 2;
            this.enemyStats.speed += 10;
        }


        for (let i=0; i<numEnemies; i++){
            this.spawnEnemy();
        }


        console.log("WAVE", this.wave, "iniciada!");
        this.wave++;
        this.scene.registry.set("wave", this.wave);
    }



    // ===========================================================
    // SPAWN DE INIMIGOS
    // ===========================================================
    spawnEnemy(){

        const map = this.scene.map;

        // Spawn near the edges of the map
        const side = Phaser.Math.Between(0, 3); // 0: top, 1: bottom, 2: left, 3: right
        let x, y;

        if (side === 0) { // top
            x = Phaser.Math.Between(0, map.widthInPixels);
            y = Phaser.Math.Between(0, 100);
        } else if (side === 1) { // bottom
            x = Phaser.Math.Between(0, map.widthInPixels);
            y = Phaser.Math.Between(map.heightInPixels - 100, map.heightInPixels);
        } else if (side === 2) { // left
            x = Phaser.Math.Between(0, 100);
            y = Phaser.Math.Between(0, map.heightInPixels);
        } else { // right
            x = Phaser.Math.Between(map.widthInPixels - 100, map.widthInPixels);
            y = Phaser.Math.Between(0, map.heightInPixels);
        }

        const groups = [this.scene.enemies, this.scene.spiderRobots, this.scene.flyRobots];
        const sprites = ["robot_idle", "enemy_spider", "enemy_fly"];
        const index = Phaser.Math.Between(0, 2);
        const group = groups[index];
        const sprite = sprites[index];

        const enemy = group.get(x, y, sprite, this.targets);

        if (!enemy) return;

        enemy.health = this.enemyStats.health;
        enemy.speed  = this.enemyStats.speed;

    }



}
