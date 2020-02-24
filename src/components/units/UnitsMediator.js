export default class UnitsMediator {
    constructor(platform) {
        this.platform = platform;
        this.units = {};

        this.currentPlayerIsOnTurn = null;

        this.currentOnTurn = null;
        this.unitsFinishedTurn = {};
    }


    // get the cords of all friendly units of a particular unit
    getFriendlyUnitsCords(unit) {
        const cordsMap = [];
        for (const u in this.units) {
            if (this.units[u].name !== unit) {
                cordsMap.push(this.units[u].cord);
            }
        }
        return cordsMap;
    }

    register(unit) {
        this.units[unit.name] = unit;
        unit.unitsMediator = this;
    }

    defrostUnits() {
        for (const unit in this.units) {
            this.units[unit].setUnitState({
                isFrozen: false,
                isPassedTurn: false,
                isEnemy: false
            })
        }
    }

    setAsEnemies() {
        for (const unit in this.units) {
            this.units[unit].setUnitState({
                isEnemy: true
            })
        }
    }

    _getOtherUnits(unit) {
        return Object.keys(this.units).filter(u => u !== unit);
    }

    notifyUnits(state, from) {
        for (const unit in this.units) {
            const newUnitState = {};

            // state composite
            switch (state) {
                case 'activated':
                    this.currentOnTurn = from;
                    this.platform.setCurrentActiveUnit(this.units[from]);
                    newUnitState.isFrozen = true;
                    newUnitState.isPassedTurn = false;
                    newUnitState.isActive = from === unit;
                    break;
                case 'finished':
                    this.currentOnTurn = null;
                    this.unitsFinishedTurn[from] = true;
                    this.platform.setCurrentActiveUnit(null);
                    if (from === unit) {
                        newUnitState.isFrozen = true;
                    } else {
                        newUnitState.isFrozen = this.unitsFinishedTurn[unit];
                    }
                    newUnitState.isPassedTurn = this.unitsFinishedTurn[unit];
                    newUnitState.isActive = false;
                    break;
                default: {}
            }

            this.units[unit].setUnitState(newUnitState);
        }
    }

    reset() {
        this.unitsFinishedTurn = {};
        this.currentOnTurn = null;
    }

    removeUnit(unitName) {
        delete this.units[unitName];
    }

    notifyMediator(state, from) {
        this.notifyUnits(state, from);

        if (Object.keys(this.units).length === Object.keys(this.unitsFinishedTurn).length) {
            this.playerMediator.onPlayerFinishedTurn();
            this.reset();
        }
    }
}