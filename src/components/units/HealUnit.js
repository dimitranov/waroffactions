import ManaUnit from "./ManaUnit.js";

const BASE_HEAL_COST = 15;

export default class HealUnit extends ManaUnit {
    constructor(config, platform, player) {
        super(config, platform, player);

        this.baseHealing = config.baseHealing;
    }

    _handleSpecialUnitInteraction = (Target) => {
        if (Target.hp < Target.initialHP && this.mana !== 0) {
            let currentTargetHP = Target.hp;
            currentTargetHP += this.baseHealing;

            if (currentTargetHP > Target.initialHP) {
                currentTargetHP = Target.initialHP;
            }

            Target.hp = currentTargetHP;
            this.mana -= BASE_HEAL_COST;

            // make animation
            this._handleUnitActionAnimation(Target, 'spell');
            // update visuals on target
            Target.updateStatBars();
            this.updateStatBars();
        }
        console.log(this, Target);
    }

    _handleMovement() {
        super._handleMovement();
        const positions = this._getFormatedAroundUnitPositions(this.top, this.left);
        console.log(positions);
    }
}