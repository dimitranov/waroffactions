import Player from "./Player.js";
import WinnerModal from "./WinnerModal.js";

const UNITS_INITIAL_CORDS = {
    activePlayer: [{
        top: 1,
        left: 1
    },
    {
        top: 2,
        left: 3
    },
    {
        top: 1,
        left: 5
    }],
    enemyPlayer: [{
        top: 7,
        left: 3
    },
    {
        top: 6,
        left: 5
    },
    {
        top: 7,
        left: 7
    }]
};

export default class PlayerMediator {
    constructor(names) {
        this.names = names;
        this.players = {};

        this.activePlayer = null;
        this.enemyPlayer = null;
        this.UNITS_INITIAL_CORDS = UNITS_INITIAL_CORDS;

        this.unitMediatorMap = {};

        this._init();
    }

    _init() {
        this.names.forEach((name, index) => {
            const player = new Player(name, index);
            this._register(player);
        });
    }

    _register(player) {
        this.players[player.name] = player;
        player.playerMediator = this;

        if (!this.activePlayer) {
            this.activePlayer = player;
            this.activePlayer.initialUnitCords = UNITS_INITIAL_CORDS.activePlayer;
        } else {
            this.enemyPlayer = player;
            this.enemyPlayer.initialUnitCords = UNITS_INITIAL_CORDS.enemyPlayer;
        }
    }

    onPlayerFinishedTurn() {
        this.activePlayer.isOnTurn = false;
        this.enemyPlayer.isOnTurn = true;

        const active = this.activePlayer;
        this.activePlayer = this.enemyPlayer;
        this.enemyPlayer = active;

        this.unitMediatorMap['UM_' + this.activePlayer.name].defrostUnits();
        this.unitMediatorMap['UM_' + this.enemyPlayer.name].setAsEnemies();
    }

    getCurrentEnemyPlayer = () => {
        return this.enemyPlayer;
    }

    getCurrentActivePlayer = () => {
        return this.activePlayer;
    }

    anounceVictory = (player) => {
        const units = this.enemyPlayer.units;
        const faction = this.enemyPlayer.faction;
        const winnerModal = new WinnerModal(player, units, faction);
        winnerModal.activate();
    }
}