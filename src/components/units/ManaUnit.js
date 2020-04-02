import Unit from './Unit.js';

export default class ManaUnit extends Unit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.MAX_MANA = 100;
        this.MANA_INC = 10;

        this.mana = this.MAX_MANA;
        this.initialMana = this.mana; // never change
        this.initialBaseDMG = this.baseDMG;

        this.manaEL = document.createElement('div');
        this.manaEL.classList.add('mana', 'secondaryStatEl', 'max');
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
            this.manaEL.classList.remove('max');
            if (this.mana < 1) {
                this.mana = 0;
            }
        }
        this.updateDMG();
        this.updateStatBars();
    }

    _updatePosition = (newCords) => {
        super._updatePosition(newCords);
        if (this.mana !== this.MAX_MANA) {
            this.manaEL.classList.remove('max');
            const newMana = this.mana + this.MANA_INC;
            if (newMana >= this.MAX_MANA) {
                this.mana = this.MAX_MANA;
                this.manaEL.classList.add('max');
            } else {
                this.mana = newMana;
            }
        }
        this.updateDMG();
        this.updateStatBars();
    }
}