import UnitSelectionPanel from './units/UnitSelectionPanel.js';
import UnitsMediator from './units/UnitsMediator.js';
import UnitBuilder from './units/UnitBuilder.js';
import UnitSelectionModal from './units/UnitSelectionModal.js';
import PlayerMediator from './players/PlayerMediator.js';
import PlayerRegistrationModal from './players/PlayerRegistrationModal.js';


import ModalUtil from './utils/ModalUtil.js';
import Element from './utils/ElementsUtil.js';


import Player from './players/Player.js';

export default class Platform {
    constructor(width, height) {
        this.platformEL = document.getElementById('platform');
        this.platformEL.style.width = width + 'px';
        this.platformEL.style.height = height + 'px';

        this.unitPool = document.getElementById('unitPool');

        this.gameLocked = true;

        this.offsetMap = []; // 340x670px
        this.cordsMap = []; // 3x4
        this.unitsMapPosition = {}; // Urvald: '3x5
        this.unitsMap = {}; // Urvald: { name: 'Urvald, hp: 400, ...}
        this.playerUnitsArrayMap = {}; // [Player Name]: ['Urvald', 'Mormond']

        this.unitMediatorMap = {};
        this.UnitBuilder = new UnitBuilder();
        // this._initPlayerRegistrationModal()
        this.playerMediator = new PlayerMediator(['Dimi', 'Georgi']);
        this._initHeroPoolSelection();
    }

    handleStartGame() {
        if (!this.gameLocked) {
            this._activateGameStartAnimation();

            this.playerUnitsArrayMap[this.playerMediator.activePlayer.name] = this.playerMediator.activePlayer.units;
            this.playerUnitsArrayMap[this.playerMediator.enemyPlayer.name] = this.playerMediator.enemyPlayer.units;

            // this.playerUnitsArrayMap = {
            //     Dimi: ["Urvald", "Mormond"],
            //     Georgi: ["Euvion", "Lemro"],
            // };

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
                unitsArray.forEach(unitName => {
                    const details = {
                        isFrozen: playerName !== activePlayer.name,
                        isEnemy: enemyPlayer.units.indexOf(unitName) > -1
                    };

                    const unit = this.UnitBuilder.create(unitName, playerName, this, details);

                    currentUnitMediator.register(unit);
                    this.unitsMap[unitName] = unit;
                });
            }
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

    handleUnitSelectionStage() {
        [
            new UnitSelectionPanel(this.playerMediator.activePlayer, this),
            new UnitSelectionPanel(this.playerMediator.enemyPlayer, this)
        ].forEach(poolPanel => {
            this.unitPool.appendChild(poolPanel.element);
            poolPanel.addEventListenersForFactions();
        });
    }

    _activateGameStartAnimation() {
        this.platformEL.classList.add('platformFadeIn');
    }

    _showMapSquares(x, y) {
        const newSquare = document.createElement('div');
        newSquare.className = 'gridSquare';
        newSquare.style.display = 'none';
        newSquare.style.top = (y * 80) + 'px';
        newSquare.style.left = (x * 80) + 'px';
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
    }
}


// TASKS:

// 1. Make visual changes to friendly units when close to each other
// 2. Make atacking possible
// 3. add more assets and export units configs in assetsJs file


// const data = {
//     isDAWProduct: false,
//     priorityDesignChange: 'true',
//     optionsType: 'FOIL_COLOR',
//     numOfOptions: 1,
//     options: [{
//         label: 'FORMAT',
//         type: 'CARD_SIZE',
//     }]
// };


// 1. zadacha: Da se console logne optionsType na data
// // data.optionsType
// 2. zadacha: Da se console.log label na purviq options
// // data.options[0].label

// const data = {
//     competitors: [{
//         class: 'X',
//         type: 'X1',
//         people: [{
//             name: 'Georgi',
//             score: '22'
//         }]
//     }, {
//         class: 'Y',
//         type: 'Y1',
//         people: [{
//             name: 'Dani',
//             score: 33
//         }, {
//             name: 'Dimi',
//             score: 51
//         }]
//     }]
// };

// 3. zadacha: Da se console logne - imaeto na 2 - viq compoetitor ot class Y
// // data.competitors[1].people[1].name
// 4. zadacha: Da se console logne - scora na 1-viq compoetitor ot class X
// // data.competitors[0].people[0].score


// const data = {
//     addons: {
//         first: [{
//             label: 'X',
//             type: 'X1',
//         }, {
//             label: 'Y',
//             type: 'Y1',
//             values: [{
//                 data: {
//                     name: 'Georgi',
//                     gender: 'male',
//                     favNumbers: [ 3, 7, 24 ]
//                 },
//             }, {
//                 data: {
//                     name: 'Dimi',
//                     gender: 'female',
//                     favNumbers: [44, 66, 12],
//                     hobis: {
//                         first: 'read book',
//                         second: 'eat',
//                         third: 'play with dog'
//                     }
//                 },
//             }]
//         }]
//     }
// };

// 5 zadacha: da se console  logne -> 2 - roto lubimo chislo na Dimi
// // data.addons.first[1].values[1].data.favNumbers[1]
// 6 zadacha: da se console  logne -> genders na Georgi
// // data.addons.first[1].values[0].data.gender
// 7 zadacha: da se console  logne -> 3 - toto hobi na Dimi
// // data.addons.first[1].values[1].data.hobis.third