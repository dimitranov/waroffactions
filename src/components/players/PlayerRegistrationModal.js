import ElementsUtil from '../utils/ElementsUtil.js';
import ModalUtil from '../utils/ModalUtil.js';

export default class PlayerRegistrationModal {
    constructor(platform) {
        this.platform = platform;

    }

    activate() {
        this.modal = new ModalUtil({
            className: 'user-registration-modal',
            title: 'Registration Form',
            html: this.generateRegistrationForm(),
            buttons: [{
                name: 'NEXT',
                class: ['button-main', 'button-orange', 'button-large'],
                action: this.submitPlayerInfo
            }]
        });

        this.modal.show();
    }

    close() {
        this.modal.hide();
    }

    generateRegistrationForm() {
        return `
        <div>
            <p>Player 1</p>
            <input type="text" id="player_1_input" autocomplete="off"/>
            <p>Player 2</p>
            <input type="text" id="player_2_input" autocomplete="off"/>
            <div class="error-container"></div>
        </div>
        `;
    }

    submitPlayerInfo = () => {
        const p1 = document.getElementById('player_1_input');
        const p2 = document.getElementById('player_2_input');

        if (p1.value && p2.value) {
            if (p1.value !== p2.value) {
                this.platform.initPlayerMediator([p1.value, p2.value]);
            } else {
                this.modal.showValidationError('Names must be different.');
            }

        } else {
            this.modal.showValidationError('Please write 2 names.');
        }
    }
}