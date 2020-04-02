import UnitsMediator from './units/UnitsMediator.js';
import UnitBuilder from './units/UnitBuilder.js';
import UnitSelectionModal from './units/UnitSelectionModal.js';

import PlayerMediator from './players/PlayerMediator.js';
import PlayerRegistrationModal from './players/PlayerRegistrationModal.js';
import PlayerPanel from './players/PlayerPanel.js';

export default class Platform {
    constructor(width, height) {
        this.platformEL = document.getElementById('platform');
        this.platformEL.style.width = width + 'px';
        this.platformEL.style.height = height + 'px';

        this.gridCellWidth = width / 10;

        this.gameLocked = true;

        this.offsetMap = []; // 340x670px
        this.cordsMap = []; // 3x4
        this.unitsMapPosition = {}; // Urvald: '3x5
        this.unitsMap = {}; // Urvald: { name: 'Urvald, hp: 400, ...}
        this.playerUnitsArrayMap = {}; // [Player Name]: ['Urvald', 'Mormond']

        this.unitMediatorMap = {};
        this.UnitBuilder = new UnitBuilder();
        this._initPlayerRegistrationModal();
    }

    handleStartGame() {
        if (!this.gameLocked) {
            this._activateGameStartAnimation();

            this.playerUnitsArrayMap[this.playerMediator.activePlayer.name] = this.playerMediator.activePlayer.units;
            this.playerUnitsArrayMap[this.playerMediator.enemyPlayer.name] = this.playerMediator.enemyPlayer.units;

            const activePlayer = this.playerMediator.activePlayer;
            const enemyPlayer = this.playerMediator.enemyPlayer;

            for (const playerName in this.playerUnitsArrayMap) {
                // create the mediator
                const Mkey = 'UM_' + playerName;
                this.unitMediatorMap[Mkey] = new UnitsMediator(this);

                const currentUnitMediator = this.unitMediatorMap[Mkey];

                currentUnitMediator.currentPlayerIsOnTurn = playerName === activePlayer.name;

                currentUnitMediator.playerMediator = this.playerMediator;
                this.playerMediator.unitMediatorMap = this.unitMediatorMap;

                // create units
                const unitsArray = this.playerUnitsArrayMap[playerName];
                unitsArray.forEach((unitName, index) => {
                    const cords = this.playerMediator.players[playerName].initialUnitCords[index];
                    const details = {
                        isFrozen: playerName !== activePlayer.name,
                        isEnemy: enemyPlayer.units.indexOf(unitName) > -1
                    };

                    const unit = this.UnitBuilder.create(unitName, playerName, this, details, cords);

                    currentUnitMediator.register(unit);
                    this.unitsMap[unitName] = unit;
                });
            }
            this.unitMediatorMap['UM_' + enemyPlayer.name].setAsEnemies();

            this.handlePlayerPanels();
        }
    }

    _initPlayerRegistrationModal() {
        this.newPlayerRegistrationModal = new PlayerRegistrationModal(this);
        this.newPlayerRegistrationModal.activate();
    }

    initPlayerMediator(playersArray) {
        this.playerMediator = new PlayerMediator(playersArray);
        this.newPlayerRegistrationModal.close();
        this._initHeroPoolSelection();
    }

    _initHeroPoolSelection() {
        this.unitSelectionModal = new UnitSelectionModal(this, this.playerMediator);
        this.unitSelectionModal.activate();
    }

    notifyUnitDeath(unit) {
        this.leftPanel.handleDisableUnitOnDeath(unit);
        this.rigthPanel.handleDisableUnitOnDeath(unit);
    }

    handlePlayerPanels() {
        this.leftPanel = new PlayerPanel(this.playerMediator.activePlayer, this);
        this.rigthPanel = new PlayerPanel(this.playerMediator.enemyPlayer, this);

        this.leftPanel.renderPanel('left');
        this.rigthPanel.renderPanel('right');
    }

    _handleGridRendered() {
        this.gridSquares = this.platformEL.getElementsByClassName('gridSquare');
    }

    unlockGame() {
        this.unitSelectionModal.close();
        this.gameLocked = false;
    }

    setCurrentActiveUnit(unit) {
        this.currentActiveUnit = unit;
    }

    getCurrentActiveUnit() {
        return this.currentActiveUnit;
    }

    _activateGameStartAnimation() {
        let count = 3;
        const timerEL = document.createElement('div');
        timerEL.id = 'game-start-counter';
        this.platformEL.parentElement.appendChild(timerEL);
        var startDate = new Date();
        const countDown = () => {
            if (count === -1) {
                timerEL.remove();
                console.log(new Date().getTime() - startDate);
                clearInterval(this.gameStartTimer);
                return;
            }
            if (count === 0) {
                timerEL.textContent = 'START';
            } else {
                timerEL.textContent = count;
            }
            count -= 1;
            if (count < 0) {
                timerEL.textContent = 'START';
            }
        }

        countDown();
        this.gameStartTimer = setInterval(countDown, 1000);
        this.platformEL.classList.add('platformFadeIn');
    }

    _showMapSquares(x, y) {
        const newSquare = document.createElement('div');
        newSquare.className = 'gridSquare';
        newSquare.style.display = 'none';
        newSquare.style.top = (y * this.gridCellWidth) + 'px';
        newSquare.style.left = (x * this.gridCellWidth) + 'px';
        newSquare.dataset.top = y;
        newSquare.dataset.left = x;
        this.platformEL.appendChild(newSquare);
    }

    drawMap() {
        for (let x = 0; x < 10; x++) {
            this.offsetMap[x] = [];
            for (let y = 0; y < 10; y++) {
                this.offsetMap[x][y] = { top: y * 80, left: x * 80 };
                this.cordsMap.push(x + 'x' + y);
                this._showMapSquares(x, y);
            }
        }

        this._handleGridRendered();
    }
}