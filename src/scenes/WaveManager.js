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

    constructor(scene){
        this.scene = scene;
    }



    // ===========================================================
    // COMEÇA SISTEMA
    // ===========================================================
    start(){
        this.nextWaveTime = this.scene.time.now + 30000;
    }



    // ===========================================================
    // UPDATE (chamado no GameScene.update)
    // ===========================================================
    update(){

        if (!this.scene) return;

        if (this.scene.time.now >= this.nextWaveTime){
            this.startWave();
            this.nextWaveTime = this.scene.time.now + 30000;
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
    }



    // ===========================================================
    // SPAWN DE INIMIGOS
    // ===========================================================
    spawnEnemy(){

        const map = this.scene.map;

        const x = Phaser.Math.Between(0, map.widthInPixels);
        const y = Phaser.Math.Between(0, map.heightInPixels);

        const enemy = this.scene.enemies.get(x,y,'robot_idle');

        if (!enemy) return;

        enemy.health = this.enemyStats.health;
        enemy.speed  = this.enemyStats.speed;

        enemy.damage = (amt) => {
            enemy.health -= amt;
        };

    }



}
