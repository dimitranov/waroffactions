import Unit from './Unit.js';

export default class ManaUnit extends Unit {
    constructor({ name, hp, baseDMG, top, left, imageURL }, platform, player) {
        super({ name, hp, baseDMG, top, left, imageURL }, platform, player);

        this.mana = 100;
        this.initialMana = this.mana; // never change
        this.initialBaseDMG = this.baseDMG;

        this.manaEL = document.createElement('div');
        this.manaEL.classList.add('mana');
        this.manaEL.classList.add('secondaryStatEl');
        this.updateManaBar();

        this.updateEnchancedDetail();

        this.updateDMG();

        this.element.appendChild(this.manaEL);
    }

    updateStatBars() {
        super.updateStatBars();
        this.updateManaBar();
        this.updateEnchancedDetail();
    }

    updateEnchancedDetail() {
        super.enchanceGeneralDetails(`<span>Mana:</span> ${this.mana}/${this.initialMana}`);
        super._setDetailsContentToElement();
    }

    updateDMG() {
        this.baseDMG = Math.floor(this.initialBaseDMG + (this.mana * 0.2));
    }

    updateManaBar() {
        this.manaEL.style.height = (this.mana * 0.70) + 'px';
    }

    _attack = target => {
        super._attack(target, 'spell');
        if (this.mana > 1) {
            this.mana -= 20;
            if (this.mana < 1) {
                this.mana = 0;
            }
        }
        this.updateDMG();
        this.updateStatBars();
    }

    _updatePosition = (newCords) => {
        super._updatePosition(newCords);
        const manaGain = 10;
        if (this.mana !== 100) {
            this.mana += manaGain;
        }
        this.updateDMG();
        this.updateStatBars();
    }
}