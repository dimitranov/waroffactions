import { ASSETS } from '../../assetsMap.js'
import Element from '../utils/ElementsUtil.js';

export default class UnitSelectionPanel {
    constructor(player, platform, unitSelectionModal) {
        this.player = player;
        this.platform = platform;
        this.unitSelectionModal = unitSelectionModal;
        this.playerName = this.player.name;

        this.element = document.createElement('div');
        this.element.classList.add('unitSelectionPanel');

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

        for (const key of Object.keys(ASSETS[faction])) {
            const unit = ASSETS[faction][key];
            if (key === 'base') {
                continue;
            }
            unitsEls += `
                <div class="poolFaction"
                    data-unit-of-player="${this.playerName}"
                    data-unit-name="${unit.name}"
                    data-unit-spec="${unit.unitSpec}"
                    data-unit-class="${unit.unitClass}">
                    <img src="./images/${unit.name}.png"/>
                    <p>${unit.name}</p>
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
                <button class="button-main button-blue button-small lockSelectionBTN" data-lock-selected-faction="${this.playerName}">PICK</button>
                <div class="units-panel-details-panel faction ${this.playerName}"></div>
            </div>
        `;
    }

    _renderHeroesPicking() {
        this.element.innerHTML = `
            <h1>${this.playerName}</h1>
            <p class="factionTitle">${this.currentSelectedFaction}</p>
            <div class="pool">
                ${!this.locked ? this._renderUnitsPool(this.currentSelectedFaction) : this._renderLockedPanel()}
                ${!this.locked ? `<button class="button-main button-green button-small lockSelectionBTN" data-lock-selected-hero="${this.playerName}">LOCK</button>` : ''}
                <div class="units-panel-details-panel units ${this.playerName}"></div>
            </div>
        `;
    }

    _renderHeroDeatailsPanel(unitData) {
        if (!unitData) return '';
        return `
            <p><span>Spec:</span> ${unitData.unitSpec}</p>
            <p><span>Class:</span> ${unitData.unitClass}</p>
            <p><span>Resource:</span> ${unitData.unitType}</p>
            <p><span>HP:</span> ${unitData.hp}</p>
            <p><span>DMG:</span> ${unitData.baseDMG}</p>
        `;
    }

    _renderFactionDeatailsPanel(faction) {
        if (!faction) return '';
        let html = '';
        if (faction.countering.length > 0) {
            html += '<p><span class="countering">Countering</span></p>';
        }
        for (const fac of faction.countering) {
            html += `<p>${fac}</p>`;
        }
        if (faction.counters.length > 0) {
            html += '<p><span class="counters">Counters</span></p>';
        }
        for (const fac of faction.counters) {
            html += `<p>${fac}</p>`;
        }
        return html;
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

    _onHeroMouseEnter = e => {
        if (this.detailsClearTimeout) {
            clearTimeout(this.detailsClearTimeout)
        }
        const unitName = e.currentTarget.dataset.unitName;
        const unitData = ASSETS[this.currentSelectedFaction][unitName];
        const panel = document.querySelector(`.units-panel-details-panel.units.${this.playerName}`);
        panel.innerHTML = this._renderHeroDeatailsPanel(unitData);
        this.detailsClearTimeout = setTimeout(() => {
            panel.innerHTML = '';
        }, 4000);
    }

    _onFactionMouseEnter = e => {
        if (this.detailsClearTimeout) {
            clearTimeout(this.detailsClearTimeout)
        }
        const factionName = e.currentTarget.dataset.faction;
        const factionData = Object.values(ASSETS[factionName])[1];
        const panel = document.querySelector(`.units-panel-details-panel.faction.${this.playerName}`);
        panel.innerHTML = this._renderFactionDeatailsPanel(factionData);
        this.detailsClearTimeout = setTimeout(() => {
            panel.innerHTML = '';
        }, 4000);
    }

    _onLock_faction = () => {
        if (this.currentSelectedFaction) {
            this.player.setFaction(this.currentSelectedFaction);
            UnitSelectionPanel.playerFactionSelectCount += 1;
            if (UnitSelectionPanel.playerFactionSelectCount === 2) {
                this.unitSelectionModal.changeTitle('Select you\'r HEROES')
            }
            this._renderHeroesPicking();
            this._addEventListenersForUnitSelect();
            this._addEventListenersForUnitHover();
            this._addEventListenerForLock('hero');
        } else {
            this.unitSelectionModal.modal.showValidationError('You have to pick a faction !!!');
        }
    }

    _onLock_hero = () => {
        if (this.player.units.length > 0) {
            this.locked = true;
            this._renderHeroesPicking();
        } else {
            this.unitSelectionModal.modal.showValidationError('Select you\'r Units !!!');
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

    _addEventListenersForUnitHover() {
        Element.addListenerToNodeList(`div[data-unit-of-player="${this.playerName}"]`, 'mouseover', this._onHeroMouseEnter);
    }

    addEventListenersForFactions() {
        Element.addListenerToNodeList(`div[data-faction-of-player="${this.playerName}"]`, 'click', this._onFactionClick);
        this._addEventListenerForLock('faction');
        this._addEventListenersForFactionHover();
    }

    _addEventListenersForFactionHover() {
        Element.addListenerToNodeList(`div[data-faction-of-player="${this.playerName}"]`, 'mouseover', this._onFactionMouseEnter);
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
