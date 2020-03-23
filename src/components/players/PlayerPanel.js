import { ASSETS } from '../../assetsMap.js';

export default class PlayerPanel {
    constructor(player, platform) {
        this.player = player;
        this.platform = platform;
        this._init();
    }

    _init() {
        this.element = document.createElement('div');
        this.element.classList.add('unitSelectionPanel');
        this.element.classList.add('inGamePanel');
        this.element.innerHTML = `
            <h1>${this.player.name}</h1>
            <div class="pool">
                ${this._renderUnits()}
            </div>
        `;
    }

    _renderUnits() {
        let selectedUnits = '';

        for (const unit of this.player.units) {
            selectedUnits += `
                <div class="poolFaction locked ${unit}">
                    <img src="./images/${unit}.png"/>
                    <p>${unit}</p>
                </div>
            `;
        }

        return selectedUnits;
    }

    renderPanel(place) {
        let position = '';
        if (place == 'left') {
            position = 'beforeBegin';
        } else if (place == 'right') {
            position = 'afterEnd';
        }
        this.platform.platformEL.insertAdjacentElement(position, this.element);
    }

    handleDisableUnitOnDeath(unit) {
        if (this.player.hasUnit(unit)) {
            const unitEL = document.querySelector(`.unitSelectionPanel .poolFaction.${unit}`);
            unitEL.classList.add('disabled');
        }
    }
}