import ElementsUtil from '../utils/ElementsUtil.js';
import ModalUtil from '../utils/ModalUtil.js';

export default class PlayerRegistrationModal {
    constructor(platform) {
        this.platform = platform;

    }

    activate() {
        this.modal = new ModalUtil({
            title: 'Registration Form',
            html: this.generateRegistrationForm(),
            buttons: [{
                name: 'Submit',
                class: 'primary-buton',
                action: this.submitPlayerInfo
            }]
        });

        this.modal.show();
    }

    close() {
        this.modal.hide();
    }

    generateRegistrationModal() {

    }

    generateRegistrationForm() {
        return `
        <div>
            <p>Player 1</p>
            <input type="text" id="player_1_input"/>
            <p>Player 2</p>
            <input type="text" id="player_2_input"/>
            <div class="error-container"></div>
        </div>
        `;
    }

    submitPlayerInfo = () => {
        const p1 = document.getElementById('player_1_input');
        const p2 = document.getElementById('player_2_input');

        if (p1.value && p2.value) {
            this.platform.initPlayerMediator([p1.value, p2.value]);
        } else {
            this.modal.showValidationError('Please write 2 names.');
        }
    }
}