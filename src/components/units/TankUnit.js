import RageUnit from "./RageUnit.js";

export default class TankUnit extends RageUnit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.baseHealthRegen = 15;
        this.staticHealIconEL = document.createElement('div');
        this.staticHealIconEL.classList.add('static-tank-icon');
        this.element.appendChild(this.staticHealIconEL);
    }

    // heal  for 20% of missing health
    getHealAmount() {
        return Math.floor((this.initialHP - this.hp) * 0.2);
    }

    _updatePosition = (newCords) => {
        super._updatePosition(newCords);
        let currentHp = this.hp;
        const heal = this.getHealAmount();
        currentHp += heal;
        if (currentHp >= this.initialHP) {
            this.hp = this.initialHP;
        } else {
            this.hp = currentHp;
            this._actionAmountAnimation('heal', heal);
        }
        this.updateStatBars();
    }
}