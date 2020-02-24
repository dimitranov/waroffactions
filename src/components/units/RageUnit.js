import Unit from './Unit.js';

export default class RageUnit extends Unit {
    constructor({ name, hp, baseDMG, top, left, imageURL }, platform, player) {
        super({ name, hp, baseDMG, top, left, imageURL }, platform, player);

        this.rage = 0;

        this.rageEL = document.createElement('div');
        this.rageEL.classList.add('rage');
        this.rageEL.classList.add('secondaryStatEl');
        this.rageEL.style.height = this.rage + 'px';

        super.enchanceGeneraDetails(`Rage: ${this.rage}/100`);
        super._setDetailsContentToElement();

        this.element.appendChild(this.rageEL);
    }

    updateStatBars() {
        super.updateStatBars();
        this.rageEL.style.height = this.rage + 'px';
    }

    _attack = (target) => {
        super._attack(target, 'male');
        this.rage += 5;
        this.baseDMG = this.baseDMG + ((this.baseDMG * this.rage) / 100);
        this.updateStatBars();
    }
}
