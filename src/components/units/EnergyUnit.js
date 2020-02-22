import Unit from '../Unit.js';

export default class EnergyUnit extends Unit {
    constructor({ name, hp, baseDMG, top, left, imageURL }, platform, player) {
        super({ name, hp, baseDMG, top, left, imageURL }, platform, player);

        this.energy = 0;
        this.initialDMG = baseDMG;

        this.energyEL = document.createElement('div');
        this.energyEL.classList.add('energy');
        this.energyEL.classList.add('secondaryStatEl');
        this.energyEL.style.height = this.energy + 'px';

        super.enchanceGeneraDetails(`Energy: ${this.energy}/100`);
        super._setDetailsContentToElement();

        this.element.appendChild(this.energyEL);
    }

    updateStatBars() {
        super.updateStatBars();
        this.energyEL.style.height = this.energy + 'px';
    }

    _attack = (target) => {
        if (this.energy === 100) {
            this.baseDMG = this.baseDMG * 2;
        }
        super._attack(target, 'male');
        this.energy += 20;
        if (this.energy > 100) {
            this.energy = 0;
            this.baseDMG = this.initialDMG;
        }
        this.updateStatBars();
    }
}