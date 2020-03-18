export default class Player {
    constructor(name, number) {
        this.name = name;
        this.hp = 300;
        this.faction = null;
        this.isOnTurn = false;
        this.units = [];
        this.unitsAlive = [];
        this.number = number;
    }

    setFaction(faction) {
        this.faction = faction;
    }

    setUnit(unit) {
        this.units.push(unit);
        this.unitsAlive.push(unit);
    }

    setUnits(units) {
        this.units = units;
        this.unitsAlive = units;
    }

    deselectUnit(unit) {
        this.units = this.units.filter(u => u !== unit);
    }

    hasUnit(unit) {
        return this.units.find(u => u === unit);
    }

    hasAliveUnits() {
        return this.unitsAlive.length !== 0
    }

    handleUnitDeath(unit) {
        const unitPosition = this.unitsAlive.indexOf(unit);
        this.unitsAlive.splice(unitPosition, 1);
    }

    resetPlayerSelection() {
        this.units = [];
        this.faction = null;
    }
}