import Element from '../utils/ElementsUtil.js'
import UnitSelectionPanel from './UnitSelectionPanel.js'
import ModalUtil from '../utils/ModalUtil.js'

export default class UnitSelectionModal {
    constructor(platform, playerMediator) {
        this.platform = platform;
        this.playerMediator = playerMediator;
    }

    activate() {
        const poolContainer = Element.div();
        this.unitSelectionPanels = [
            new UnitSelectionPanel(this.playerMediator.activePlayer, this.platform, this),
            new UnitSelectionPanel(this.playerMediator.enemyPlayer, this.platform, this)
        ];

        this.unitSelectionPanels.forEach(poolPanel => {
            poolContainer.appendChild(poolPanel.element);
        });

        this.modal = new ModalUtil({
            title: 'Pick faction',
            html: [poolContainer],
            buttons: [{
                name: 'PLAY',
                class: 'primary-buton',
                action: this.onHandleStartGameSession
            }]
        });

        this.modal.show();

        this.unitSelectionPanels.forEach(poolPanel => {
            poolPanel.addEventListenersForFactions();
        });
    }

    close() {
        this.modal.hide();
    }

    changeTitle(title) {
        this.modal.changeTitle(title);
    }

    onHandleStartGameSession = () => {
        console.log('click start game');
        
        if (this.unitSelectionPanels[0].locked && this.unitSelectionPanels[1].locked) {
            // ready to start game 
            this.platform.unlockGame();
            this.platform.handleStartGame();
        }
    }
}