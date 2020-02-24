import ElementsUtil from '../utils/ElementsUtil.js';
import ModalUtil from '../utils/ModalUtil.js';

export default class PlayerRegistration {
    constructor(plaftorm) {
        this.plaftorm = plaftorm;

    }

    activate() {
        const modal = new ModalUtil({
            title: 'Registration Form',
            html: this.generateRegistrationForm(),
            buttons: [{
                name: 'Submit',
                class: 'primary-buton',
                action: this.submitPlayerInfo
            }]
        });
    }

    generateRegistrationModal() {

    }

    generateRegistrationForm() {
        this.regForm = `
        <div>
            <p>Player 1</p>
            <input type="text" id="player_1_input"/>
            <p>Player 2</p>
            <input type="text" id="player_2_input"/>
        </div>
        `;
    }

    submitPlayerInfo = (data) => {
        document.getElementById('player_1_input');
        const p1 = document.getElementById('player_1_input');
        const p2 = document.getElementById('player_2_input');
        console.log(data);
    }
}