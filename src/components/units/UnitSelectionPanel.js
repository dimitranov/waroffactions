import { ASSETS } from '../../assetsMap.js'
import Element from '../utils/ElementsUtil.js';

export default class UnitSelectionPanel {
    constructor(player, platform, unitSelectionModal) {
        this.player = player;
        this.platform = platform;
        this.unitSelectionModal = unitSelectionModal;
        this.playerName = this.player.name;

        this.element = document.createElement('div');
        this.element.classList.add('playerPanel');

        this._renderFactionPicking();

        this.disabledFaction = null;
        this.currentSelectedFaction = null;
        this.locked = false;
    }

    static lockedPlayersMap = {};

    static playerFactionSelectCount = 0;

    // views

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

    _renderFactionPicking() {
        this.element.innerHTML = `
            <h1>${this.playerName}</h1>
            <div class="pool">
                ${this._renderFactionsPool()}
                <button class="button-main button-blue button-small lockSelectionBTN" data-lock-selected-faction="${this.playerName}">lock</button> 
            </div>
        `;
    }

    _renderHeroesPicking() {
        this.element.innerHTML = `
            <h1>${this.playerName}</h1>
            <p class="factionTitle">${this.currentSelectedFaction}</p>
            <div class="pool">
                ${!this.locked ? this._renderUnitsPool(this.currentSelectedFaction) : this._renderLockedPanel()}
                ${!this.locked ? `<button class="button-main button-green button-small lockSelectionBTN" data-lock-selected-hero="${this.playerName}">lock</button>` : ''}
            </div>
        `;
    }

    // actions

    _onFactionClick = e => {
        const newClickedFaction = e.currentTarget.dataset.faction;

        if (newClickedFaction !== this.disabledFaction) {
            e.currentTarget.classList.add('selectedUnit');
            if (this.currentSelectedFaction && newClickedFaction !== this.currentSelectedFaction) {
                // change classes and unselect
                document.querySelector(`div[data-faction="${this.currentSelectedFaction}"][data-faction-of-player="${this.playerName}"]`)
                    .classList.remove('selectedUnit');
            }
            this.currentSelectedFaction = newClickedFaction;
            this.unitSelectionModal.notifyForFactionSelect(this.currentSelectedFaction, this.playerName);
        }
    }

    _onHeroClick = e => {
        const unitName = e.currentTarget.dataset.unitName;

        if (this.player.hasUnit(unitName)) {
            e.currentTarget.classList.remove('selectedUnit');
            this.player.deselectUnit(unitName);
        } else if (this.player.units.length < 3) {
            e.currentTarget.classList.add('selectedUnit');
            this.player.setUnit(unitName);
        }
    }

    _onLock_faction = () => {
        this.player.setFaction(this.currentSelectedFaction);
        UnitSelectionPanel.playerFactionSelectCount += 1;
        if (UnitSelectionPanel.playerFactionSelectCount === 2) {
            this.unitSelectionModal.changeTitle('Select you\'r HEROES')
        }
        this._renderHeroesPicking();
        this._addEventListenersForUnitSelect();
        this._addEventListenerForLock('hero');
    }

    _onLock_hero = () => {
        if (this.player.units.length > 0) {
            this.locked = true;
            this._renderHeroesPicking();
        }
    }

    _onLockSelection = e => {
        if (this.player.units.length > 0) {
            this.locked = true;
            this.currentSelectedFaction = null;
            this._renderHeroesPicking();

            UnitSelectionPanel.lockedPlayersMap[this.player.name] = true;

            if (Object.keys(UnitSelectionPanel.lockedPlayersMap).length === 2) {
                this.platform.unlockGame();
                this.platform.handleStartGame();
            }
        }
    }

    // listeners

    _addEventListenerForLock(type) {
        document.querySelector(`button[data-lock-selected-${type}="${this.playerName}"]`).addEventListener('click', this[`_onLock_${type}`]);
    }

    _addEventListenersForUnitSelect() {
        Element.addListenerToNodeList(`div[data-unit-of-player="${this.playerName}"]`, 'click', this._onHeroClick);
    }

    addEventListenersForFactions() {
        Element.addListenerToNodeList(`div[data-faction-of-player="${this.playerName}"]`, 'click', this._onFactionClick);
        this._addEventListenerForLock('faction');
    }

    // behaviour

    acceptSelectionNotification(selectedFaction) {
        // disable the faction from current panel
        this.disabledFaction = selectedFaction;
        const panelUnits = document.querySelectorAll(`div[data-faction-of-player="${this.playerName}"]`)
        for (const unit of panelUnits) {
            unit.classList.remove('disabled');
            if (unit.dataset.faction === this.disabledFaction) {
                unit.classList.add('disabled');
            }
        }
    }
}
