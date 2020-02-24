import Element from './ElementsUtil.js'

export default class ModalUtil {
    constructor(config) {
        this.title = config.title;
        this.html = config.html;
        this.buttons = config.buttons;

        this.generateModal();
    }

    insertModalContent() {

    }

    generateModal() {
        const buttonElements = [];
        for (const button of this.buttons) {
            const btn = Element.button({
                name: button.name,
                class: button.class,
            }, 'START GAME');
            btn.addEventListener('click', button.action);
            buttonElements.push(btn);
        }

        this.modalHealderEl = Element.div({ class: 'modal-header' }, `
        <div class='fdsafds'>
            ${this.title}
        </div>`);

        this.modalFooterEl = Element.div({ class: 'modal-footer' }, [...buttonElements]);

        this.modalEl = ElementsUtil.div({
            class: 'modal',
            id: 'modal-dialog-container'
        }, [
            this.modalHealderEl,
            this.modalFooterEl
        ]);

        // this.modalEl.innerHTML = `<div>
        //     HI  there 
        // </div>`
        document.body.appendChild(this.modalEl);
    }


}