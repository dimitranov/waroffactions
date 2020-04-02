import ManaUnit from "./ManaUnit.js";

const BASE_HEAL_COST = 15;

export default class HealUnit extends ManaUnit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.baseHealing = config.baseHealing;
        this.staticHealIconEL = document.createElement('div');
        this.staticHealIconEL.classList.add('static-heal-icon');
        this.element.appendChild(this.staticHealIconEL);
    }

    _handleHeal(Target) {
        if (Target.hp < Target.initialHP && this.mana !== 0) {
            let currentTargetHP = Target.hp;
            currentTargetHP += this.baseHealing;

            if (currentTargetHP > Target.initialHP) {
                currentTargetHP = Target.initialHP;
            }

            // perform heal
            Target.hp = currentTargetHP;
            this.mana -= BASE_HEAL_COST;
            // number animation
            Target._actionAmountAnimation('heal', this.baseHealing);
            // make animation
            this._handleUnitActionAnimation(Target, 'spell');
            // update visuals on target
            Target.updateStatBars();
            this.updateStatBars();
        }
    }

    _handleSpecialUnitInteraction = (Target) => {
        this._handleHeal(Target);
    }

    _initiateAroundUnitSquaresInteraction() {
        super._initiateAroundUnitSquaresInteraction();
        const friendlyPositionsInScope = this._getFormatedAroundUnitPositions(this.top, this.left).friendlyPositionsInScope;

        for (const cord of friendlyPositionsInScope) {
            const friendlyGridCell = document.querySelector(`.gridSquare[data-top="${cord[0]}"][data-left="${cord[2]}"]`);
            friendlyGridCell.classList.add('gridSquareHealable');
        }
    }
}