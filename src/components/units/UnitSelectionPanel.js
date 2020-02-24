import { ASSETS } from '../../assetsMap.js'

export default class UnitSelectionPanel {
    constructor(player, platform) {
        this.player = player;
        this.platform = platform;
        this.playerName = this.player.name;

        this.element = document.createElement('div');
        this.element.classList.add('playerPanel');
        this._renderFactionAndUnitPicking();

        this.currentSelectedFaction = null;
        this.locked = false;
    }

    static lockedPlayersMap = {};

    _renderLockedPanel() {
        let selectedUnits = '';

        for (const unit of this.player.units) {
            selectedUnits += `
                <div class="poolFaction locked" data-locked-unit-for-player="${this.playerName}">
                    <img src="./images/${unit}.png"/>
                    <p>${unit}</p>
                </div>
            `;
        }

        return selectedUnits;
    }

    _renderFactionsPool() {
        let factionEls = '';

        for (const faction of Object.keys(ASSETS)) {
            factionEls += `
                <div class="poolFaction" data-faction="${faction}" data-faction-of-player="${this.playerName}">
                    <img src="./images/${faction}.png"/>
                    <p>${faction}</p>
                </div>
            `;
        }

        return factionEls;
    }

    _renderUnitsPool(faction) {
        let unitsEls = '';

        for (const unit of Object.keys(ASSETS[faction])) {
            if (unit === 'base') {
                continue;
            }
            unitsEls += `
                <div class="poolFaction" data-unit-of-player="${this.playerName}" data-unit-name="${unit}">
                    <img src="./images/${unit}.png"/>
                    <p>${unit}</p>
                </div>
            `;
        }

        return unitsEls;
    }

    _renderReturnToFactionsBTN() {
        return `<button class="returnToFactionsBTN" data-faction-return-btn-player-name="${this.playerName}">return</button> `;
    }

    _renderLockBTN() {
        return `<button class="lockSelectionBTN" data-lock-selections="${this.playerName}">lock</button> `;
    }

    _renderFactionAndUnitPicking() {
        this.element.innerHTML = `
            <h1 contenteditable>${this.playerName}</h1>
            ${this.currentSelectedFaction ? `<p class="factionTitle">${this.currentSelectedFaction}</p>` : ''}
            <div class="pool">
                ${this.locked ? this._renderLockedPanel() : ''}
                ${!this.locked ? (this.currentSelectedFaction ? this._renderUnitsPool(this.currentSelectedFaction) : this._renderFactionsPool()) : ''}
                ${this.currentSelectedFaction ? this._renderReturnToFactionsBTN() : ''}
                ${this.currentSelectedFaction ? this._renderLockBTN() : ''}
            </div>
        `;
    }

    _onFactionSelect = e => {
        this.currentSelectedFaction = e.currentTarget.dataset.faction;
        this.player.setFaction(this.currentSelectedFaction);
        this._renderFactionAndUnitPicking();
        this._addListenerForReturnToFactionPanel();
        this._addEventListenerForLock();
        this._addEventListenersForUnitSelect();
    }

    _onUnitSelectFromPool = e => {
        const unitName = e.currentTarget.dataset.unitName;

        if (this.player.hasUnit(unitName)) {
            e.currentTarget.classList.remove('selectedUnit');
            this.player.deselectUnit(unitName);
        } else if (this.player.units.length < 3) {
            e.currentTarget.classList.add('selectedUnit');
            this.player.setUnit(unitName);
        }
    }

    _onReturnToFactionsClick = e => {
        this.currentSelectedFaction = null;
        this.player.resetPlayerSelection();
        this._renderFactionAndUnitPicking();
        this.addEventListenersForFactions();
    }

    _onLockSelection = e => {
        if (this.player.units.length > 0) {
            this.locked = true;
            this.currentSelectedFaction = null;
            this._renderFactionAndUnitPicking();

            UnitSelectionPanel.lockedPlayersMap[this.player.name] = true;

            if (Object.keys(UnitSelectionPanel.lockedPlayersMap).length === 2) {
                this.platform.unlockGame();
                this.platform.handleStartGame();
            }
        }
    }

    _addListenerForReturnToFactionPanel() {
        document.querySelector(`button[data-faction-return-btn-player-name="${this.playerName}"]`).addEventListener('click', this._onReturnToFactionsClick);
    }

    _addEventListenerForLock() {
        document.querySelector(`button[data-lock-selections="${this.playerName}"]`).addEventListener('click', this._onLockSelection);
    }

    _assignEventToNodeList(listSelector, event, callback) {
        const collection = document.querySelectorAll(listSelector);
        collection.forEach(unit => {
            unit.addEventListener(event, callback);
        });
    }

    _addEventListenersForUnitSelect() {
        this._assignEventToNodeList(`div[data-unit-of-player="${this.playerName}"]`, 'click', this._onUnitSelectFromPool);
    }

    addEventListenersForFactions() {
        this._assignEventToNodeList(`div[data-faction-of-player="${this.playerName}"]`, 'click', this._onFactionSelect);
    }
}
