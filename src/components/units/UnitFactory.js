import { ASSETS } from '../../assetsMap.js'
import ManaUnit from './ManaUnit.js';
import RageUnit from './RageUnit.js';
import EnergyUnit from './EnergyUnit.js';
import Unit from './Unit.js';
import TankUnit from './TankUnit.js';
import HealUnit from './HealUnit.js';

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
            case 'Rage': UnitType = RageUnit; break;
            case 'Energy': UnitType = EnergyUnit; break;
            default: UnitType = Unit;
        }

        if (config.unitSpec === 'Tank') {
            UnitType = TankUnit;
        }

        if (config.unitSpec === 'Heal') {
            UnitType = HealUnit;
        }

        const unit = new UnitType(config, this.platform, playerName);

        return unit;
    }

}