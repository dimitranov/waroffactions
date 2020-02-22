import Unit from '../Unit.js';

export default class ManaUnit extends Unit {
    constructor({ name, hp, baseDMG, top, left, imageURL }, platform, player) {
        super({ name, hp, baseDMG, top, left, imageURL }, platform, player);

        this.mana = 300;
        this.initialMana = this.mana; // never change

        this.manaEL = document.createElement('div');
        this.manaEL.classList.add('mana');
        this.manaEL.classList.add('secondaryStatEl');
        this.manaEL.style.height = (this.mana * 0.20) + 'px';

        super.enchanceGeneraDetails(`Mana: ${this.mana}/${this.initialMana}`);
        super._setDetailsContentToElement();

        this.element.appendChild(this.manaEL);
    }

    updateStatBars() {
        super.updateStatBars();
        this.manaEL.style.height = (this.mana * 0.20) + 'px';
    }

    _attack = target => {
        super._attack(target, 'spell');
        this.mana -= 20;
        this.updateStatBars();
    }
}