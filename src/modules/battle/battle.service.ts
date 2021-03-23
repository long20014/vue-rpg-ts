import { Player } from "@/models/player.model";

class BattleService {
  constructor() {
    // do nothing
  }

  calculateDamage(self: Player, target: Player, initDamage: number): number {
    const critDamageMultiplier = this.calculateCritDamageMultiplier(self, target);
    const isHit = this.rollTheDice(self.hitRate - target.evasion);
    const delta = this.getRandomArbitrary(80, 120) / 100
    let damage = 0;
    if (isHit) {
      damage = (initDamage * critDamageMultiplier) * (1 - ((target.defense - self.atkIntensity) / (100 + target.defense))) * delta;
    }    
    return parseInt(damage.toFixed(0));
  }
  
  calculateCritDamageMultiplier(self: Player, target: Player): number {
    const isCrit = ((playerA: Player, playerB: Player): boolean => {
      const actualCritRate = playerA.critRate - playerB.critRateResist;
      try {
        const isCrit = this.rollTheDice(actualCritRate);
        return isCrit;
      } catch (e) {
        console.error(e);
        return false;
      }
    })(self, target);
    
    if (isCrit) {
      return self.critDamage - target.critDamageResist;
    }
    return 1;
  }
   
  rollTheDice(rate: number): boolean {
    if (rate < 0 || rate > 100) throw 'Rate out of Range';
    
    const luckyNumber = Math.floor(Math.random() * 10000) / 100;
    if (luckyNumber <= rate) {
      return true;
    }
    return false; 
  }

  getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }
  
}

export const battleService = new BattleService();
