import Player from "./Player.js";

export default class PlayerMediator {
    constructor(names) {
        this.names = names;
        this.players = {};

        this.activePlayer = null;
        this.enemyPlayer = null;

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
        } else {
            this.enemyPlayer = player;
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
        console.log(player + ' WON !!!!')
    }
}