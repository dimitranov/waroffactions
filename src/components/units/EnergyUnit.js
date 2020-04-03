import Unit from './Unit.js';

export default class EnergyUnit extends Unit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.INITIAL_ENERGY = 30;
        this.ENERGY_INC = 25;
        this.ENERGY_LOST = 15;
        this.MAX_ENERGY = 100;

        this.energy = this.INITIAL_ENERGY;

        this.energyEL = document.createElement('div');
        this.energyEL.classList.add('energy', 'secondaryStatEl');
        this.updateEnergyBarHeight();

        this.updateEnchancedDetail();

        this.element.appendChild(this.energyEL);
    }

    updateEnergyBarHeight() {
        this.energyEL.style.height = 70 * this.energy / 100 + 'px';
    }

    updateStatBars() {
        super.updateStatBars();
        this.updateEnergyBarHeight();
        this.updateEnchancedDetail();
    }

    updateEnchancedDetail() {
        super.enchanceGeneralDetails(`<span>Energy:</span> ${this.energy}/100`);
        super._setDetailsContentToElement();
    }

    _attack = (target) => {
        super._attack(target, 'male');
        if (this.energy >= this.MAX_ENERGY) {
            this.energy = 0;
            this.baseDMG = this.initialBaseDMG;
        } else {
            this.energy += this.ENERGY_INC;
            this.energyEL.classList.remove('max');
        }
        if (this.energy >= this.MAX_ENERGY) {
            this.energy = this.MAX_ENERGY
            this.baseDMG = this.baseDMG * 2;
            this.energyEL.classList.add('max');
        }
        this.updateStatBars();
    }

    _updatePosition = (newCords) => {
        super._updatePosition(newCords);
        const energyLost = this.ENERGY_LOST;
        if (this.energy > energyLost) {
            this.energy -= energyLost;
        } else if (this.energy <= energyLost) {
            this.energy = 0;
        }
        this.updateStatBars();
    }
}