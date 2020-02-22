import { ASSETS } from '../../assetsMap.js'
import ManaUnit from './ManaUnit.js';
import RageUnit from './RageUnit.js';
import EnergyUnit from './EnergyUnit.js';
import Unit from '../Unit.js';

export default class UnitFactory {
    constructor(platform) {
        this.platform = platform;
    }

    _getUnitConfig(name) {
        for (const faction in ASSETS) {
            for (const unit in ASSETS[faction]) {
                if (unit == name) {
                    return ASSETS[faction][unit];
                }
            }
        }
    }

    create(name, playerName) {
        const config = this._getUnitConfig(name);
        let UnitType = null;
        switch (config.unitType) {
            case 'ManaUnit': UnitType = ManaUnit; break;
            case 'RageUnit': UnitType = RageUnit; break;
            case 'EnergyUnit': UnitType = EnergyUnit; break;
            default: UnitType = Unit;
        }
        const unit = new UnitType(config, this.platform, playerName);

        return unit;
    }

}