import Unit from './Unit.js';

export default class RageUnit extends Unit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.INITIAL_RAGE = 30;
        this.RAGE_INC = 10;
        this.RAGE_LOST = 10;
        this.MAX_RAGE = 100;

        this.rage = this.INITIAL_RAGE;

        this.rageEL = document.createElement('div');
        this.rageEL.classList.add('rage');
        this.rageEL.classList.add('secondaryStatEl');
        this._updateRageBarHeight();

        this._updateEnchancedDetail();

        this.element.appendChild(this.rageEL);
    }

    _updateRageBarHeight() {
        this.rageEL.style.height = 70 * this.rage / 100 + 'px';
    }

    updateStatBars() {
        super.updateStatBars();
        this._updateRageBarHeight();
        this._updateEnchancedDetail();
    }

    _updateEnchancedDetail() {
        super.enchanceGeneralDetails(`<span>Rage:</span> ${this.rage}/100`);
        super._setDetailsContentToElement();
    }

    _updateDMG() {
        this.baseDMG = Math.floor(this.initialBaseDMG + ((this.initialBaseDMG * this.rage) / 100));
    }

    _attack = (target) => {
        super._attack(target, 'male');
        const newRage = this.rage + this.RAGE_INC;
        if (newRage > this.MAX_RAGE) {
            this.rage = this.MAX_RAGE;
            this.rageEL.classList.add('max');
        } else {
            this.rage += this.RAGE_INC;
        }
        this._updateDMG();
        this.updateStatBars();
    }

    _updatePosition(newCords) {
        super._updatePosition(newCords);
        if (this.rage > this.RAGE_LOST) {
            this.rage -= this.RAGE_LOST;
            this.rageEL.classList.remove('max');
        } else if (this.rage <= this.RAGE_LOST) {
            this.rage = 0;
        }
        this._updateDMG();
        this.updateStatBars();
    }
}
