import Unit from './Unit.js';

export default class RageUnit extends Unit {
    constructor({ name, hp, baseDMG, top, left, imageURL }, platform, player) {
        super({ name, hp, baseDMG, top, left, imageURL }, platform, player);

        this.rage = 0;
        this.initialBaseDMG = this.baseDMG;

        this.rageEL = document.createElement('div');
        this.rageEL.classList.add('rage');
        this.rageEL.classList.add('secondaryStatEl');
        this.rageEL.style.height = this.rage + 'px';

        this.updateEnchancedDetail();

        this.element.appendChild(this.rageEL);
    }

    updateStatBars() {
        super.updateStatBars();
        this.rageEL.style.height = this.rage + 'px';
        this.updateEnchancedDetail();
    }

    updateEnchancedDetail() {
        super.enchanceGeneralDetails(`<span>Rage:</span> ${this.rage}/100`);
        super._setDetailsContentToElement();
    }

    updateDMG() {
        this.baseDMG = Math.floor(this.initialBaseDMG + ((this.initialBaseDMG * this.rage) / 100));
    }

    _attack = (target) => {
        super._attack(target, 'male');
        this.rage += 5;
        this.updateDMG();
        this.updateStatBars();
    }

    _updatePosition = (newCords) => {
        super._updatePosition(newCords);
        const rageLost = 5;
        if (this.rage > rageLost) {
            this.rage -= rageLost;
        } else if (this.rage <= rageLost) {
            this.rage = 0;
        }
        this.updateDMG();
        this.updateStatBars();
    }
}
