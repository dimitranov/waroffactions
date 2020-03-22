import ModalUtil from '../utils/ModalUtil.js';
import { ASSETS } from '../../assetsMap.js';

export default class WinnerModal {
    constructor(winningPlayerName, winningUnits, winningFaction) {
        this.winningPlayerName = winningPlayerName;
        this.winningUnits = winningUnits;
        this.winningFaction = winningFaction;
    }

    activate() {
        this.modal = new ModalUtil({
            className: 'winner-modal',
            title: 'VICTORY !!!',
            html: this._getWinnerModalContent(),
            buttons: [{
                name: 'PLAY AGAIN',
                class: ['button-main', 'button-orange', 'button-large'],
                action: this.playAgain
            }]
        });

        this.modal.show();
    }

    close() {
        this.modal.hide();
    }

    _getWinnerModalContent = () => {

        let unitHTML = '';

        for (const unit of this.winningUnits) {
            unitHTML += `
                <img src="${ASSETS[this.winningFaction][unit].imageURL}"/>
            `;
        }

        const html = `
            <dvi class="winner-modal-container">
                ${this.winningPlayerName}
                <div class="image-container">
                    ${unitHTML}
                </div>
            </dvi>
        `;
        return html;
    }

    playAgain = () => {
        window.location.reload()
    }


}