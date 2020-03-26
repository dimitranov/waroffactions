import RageUnit from "./RageUnit.js";

export default class TankUnit extends RageUnit {
    constructor(config, platform, player) {
        super(config, platform, player);
        console.log('TaNK unit created', this);
    }
}