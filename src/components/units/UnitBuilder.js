import UnitFactory from "./UnitFactory.js";

export default class UnitBuilder {
    _getInitialCords(cords) {
        return {
            top: cords.top + Math.floor(Math.random() * 2),
            left: cords.left + Math.floor(Math.random() * 2)
        };
    }

    create = (unitName, playerName, platform, details, cords) => {
        const UnitsFactory = new UnitFactory(platform);

        const unitInitialCords = this._getInitialCords(cords);
        const unit = UnitsFactory.create(unitName, playerName, unitInitialCords);

        for (const detail in details) {
            unit[detail] = details[detail];
        }

        unit.updateVisuals('initial');

        unit.activateUnitInteraction();

        return unit;
    }
}