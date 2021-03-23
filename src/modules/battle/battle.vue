<template>
  <div class="">
    <h1>Player HP: {{playerA.hp}}</h1> 
    <h1>Boss HP: {{boss.hp}}</h1> 
    <button @click="autoBattle()" v-if="!isAuto">Start Auto</button>
    <h3>Boss log: {{ bossLog }}</h3>
    <p></p>
    <h3>Player log: {{ playerLog }}</h3>
    <p></p>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import { Watch } from 'vue-property-decorator'
import { Player } from '@/models/player.model';
import { battleService } from './battle.service'

@Options({
  props: {
       
  }
})
export default class Battle extends Vue {
  playerA = new Player();
  boss = new Player();
  isAuto = false;
  isGameOver = false;
  intervals: Record<string, number> = {};
  playerLog = "";
  bossLog = "";

  @Watch('playerA.hp')
  playerHpChanged(hp: number): void {    
    if (hp <= 0 && !this.isGameOver) {     
      this.playerA.hp = 0;     
      this.announceGameOver();      
      this.clearAllIntervals();
    }
  }

  @Watch('boss.hp')
  bossHpChanged(hp: number): void {    
    if (hp <= 0 && !this.isGameOver) {     
      this.boss.hp = 0;     
      this.announceWinning();     
      this.clearAllIntervals();
    }
  }

  clearAllIntervals(): void {
    clearInterval(this.intervals['player']);    
    clearInterval(this.intervals['boss']);   
    this.intervals['player'] = NaN; 
    this.intervals['boss'] = NaN; 
  }

  mounted(): void {
    this.modifyBossStats();
    this.modifyPlayerStats();    
  }
    
  modifyBossStats(): void {    
    // this.boss.hp = 1000;
    this.boss.critRate = 5;
  }

  modifyPlayerStats(): void {
    this.playerA.evasion = 20;
    this.playerA.defense = 100;
    this.playerA.speed = 2;
  }

  createPlayerLog(damage: number): void {
    if (damage === 0) {
      this.playerLog = `Player attack missed the boss`;
    } else {
      this.playerLog = `Player deal ${damage} damage to the boss `;
    }
  }

  createBossLog(damage: number): void {
    if (damage === 0) {
      this.bossLog = `Boss attack missed the player`;
    } else {
      this.bossLog = `Boss deal ${damage} damage to the player`;
    }
  }

  makeAttack(): void {
    this.attack(this.playerA, this.boss, 10);
    this.attack(this.boss, this.playerA, 10);
  }

  attack(playerA: Player, playerB: Player, initDamage: number): number {
    const damage = battleService.calculateDamage(playerA, playerB, initDamage);
    playerB.hp-= damage;
    return damage;
  }

  announceGameOver(): void {
    alert('Game Over');
    this.isGameOver = true;
  }

  announceWinning(): void {
    alert('You win');
    this.isGameOver = true;
  }

  autoBattle(): void {
    this.isGameOver = false;
    this.isAuto = true;
    this.intervals['player'] = setInterval(() => {
      const damage = this.attack(this.playerA, this.boss, 10);
      this.createPlayerLog(damage)
    }, (1 / this.playerA.speed) * 2000)
    this.intervals['boss'] = setInterval(() => {
      const damage = this.attack(this.boss, this.playerA, 10);
      this.createBossLog(damage);
    }, (1 / this.boss.speed) * 2000)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
