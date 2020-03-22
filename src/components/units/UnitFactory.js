import { ASSETS } from '../../assetsMap.js'
import ManaUnit from './ManaUnit.js';
import RageUnit from './RageUnit.js';
import EnergyUnit from './EnergyUnit.js';
import Unit from './Unit.js';

export default class UnitFactory {
    constructor(platform) {
        this.platform = platform;
    }

    _getUnitConfig(name, cords) {
        for (const faction in ASSETS) {
            for (const unit in ASSETS[faction]) {
                if (unit == name) {
                    const unitConfig = { ...ASSETS[faction][unit], ...cords };
                    return unitConfig;
                }
            }
        }
    }

    create(name, playerName, cords) {
        const config = this._getUnitConfig(name, cords);
        let UnitType = null;
        switch (config.unitType) {
            case 'Mana': UnitType = ManaUnit; break;
            case 'Raget': UnitType = RageUnit; break;
            case 'Energy': UnitType = EnergyUnit; break;
            default: UnitType = Unit;
        }
        const unit = new UnitType(config, this.platform, playerName);

        return unit;
    }

}