import UnitFactory from "./UnitFactory.js";

export default class UnitBuilder {
    create = (unitName, playerName, platform, details) => {
        const UnitsFactory = new UnitFactory(platform);
        const unit = UnitsFactory.create(unitName, playerName);

        for (const detail in details) {
            unit[detail] = details[detail];
        }

        unit.updateVisuals('initial');
        
        unit.activateUnitInteraction();

        return unit;
    }
}