import Element from './ElementsUtil.js'

export default class ModalUtil {
    constructor(config) {
        this.title = config.title;
        this.html = config.html;
        this.className = config.className
        this.buttons = config.buttons;
        this.errorShown = false;

        this.renderModal();
    }

    showValidationError(errMgs) {
        if (!this.errorShown) {
            this.validationError = Element.p({
                class: 'modal-error'
            }, errMgs);
            this.modalEl.appendChild(this.validationError);
            this.errorShown = true;
            setTimeout(() => {
                this.modalEl.removeChild(this.validationError);
                this.errorShown = false;
            }, 4000);
        }
    }

    changeTitle(newTitle) {
        document.querySelector('.modal-header .fdsafds').innerHTML = newTitle;
    }

    renderModal() {
        const buttonElements = [];
        for (const button of this.buttons) {
            const btn = Element.button({
                name: button.name,
                class: button.class,
            }, button.name);
            btn.addEventListener('click', button.action);
            buttonElements.push(btn);
        }

        this.modalHeaderEl = Element.div({ class: 'modal-header' }, `
        <div class='fdsafds'>
            ${this.title}
        </div>`);

        this.modalContent = Element.div({ class: 'modal-content' }, this.html);

        this.modalFooterEl = Element.div({ class: 'modal-footer' }, [...buttonElements]);

        this.modalContainer = Element.div({ class: 'modal-container' }, [
            this.modalHeaderEl,
            this.modalContent,
            this.modalFooterEl
        ])

        this.modalEl = Element.div({
            class: ['modal', this.className],
            id: 'modal-dialog-container'
        }, [this.modalContainer]);

    }

    show() {
        document.body.appendChild(this.modalEl);
    }

    hide() {
        this.modalEl.style.display = 'none';
        this.modalEl.remove();
    }


}