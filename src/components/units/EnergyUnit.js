import Unit from './Unit.js';

export default class EnergyUnit extends Unit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.energy = 60;

        this.energyEL = document.createElement('div');
        this.energyEL.classList.add('energy');
        this.energyEL.classList.add('secondaryStatEl');
        this.energyEL.style.height = this.energy + 'px';

        this.updateEnchancedDetail();

        this.element.appendChild(this.energyEL);
    }

    updateStatBars() {
        super.updateStatBars();
        this.energyEL.style.height = this.energy + 'px';
        this.updateEnchancedDetail();
    }

    updateEnchancedDetail() {
        super.enchanceGeneralDetails(`<span>Energy:</span> ${this.energy}/100`);
        super._setDetailsContentToElement();
    }

    _attack = (target) => {
        super._attack(target, 'male');
        if (this.energy >= 100) {
            this.energy = 0;
            this.baseDMG = this.initialBaseDMG;
        } else {
            this.energy += 20;
        }
        if (this.energy >= 100) {
            this.energy = 100;
            this.baseDMG = this.baseDMG * 2;
        }
        this.updateStatBars();
    }

    _updatePosition = (newCords) => {
        super._updatePosition(newCords);
        const energyLost = 10;
        if (this.energy > energyLost) {
            this.energy -= energyLost;
        } else if (this.energy <= energyLost) {
            this.energy = 0;
        }
        this.updateStatBars();
    }
}