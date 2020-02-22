export default class Player {
    constructor(name, number) {
        this.name = name;
        this.hp = 300;
        this.faction = null;
        this.isOnTurn = false;
        this.units = [];
        this.number = number;
    }

    setFaction(faction) {
        this.faction = faction;
    }

    setUnit(unit) {
        this.units.push(unit);
    }

    setUnits(units) {
        this.units = units;
    }

    deselectUnit(unit) {
        this.units = this.units.filter(u => u !== unit);
    }

    hasUnit(unit) {
        return this.units.find(u => u === unit);
    }

    resetPlayerSelection() {
        this.units = [];
        this.faction = null;
    }
}