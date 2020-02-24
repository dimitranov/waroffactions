let instance = null;

class ElementsUtil {
    constructor() {
        this.supportedElements = ['div', 'p', 'span', 'img', 'button'];
        this.initElementCreationalMethods();
    }

    static getInstance() {
        if (instance) {
            return instance;
        }
        instance = new ElementsUtil();
        window.ElementsUtil = instance
        return instance;
    }

    initElementCreationalMethods() {
        for (const element of this.supportedElements) {
            this[element] = (options, html) => {
                return new ElementFactory(element, options, html);
            }
        }
    }

    get(query, shouldGetAll) {
        let method = 'getElementBuyTagName';
        let result = null;

        if (query.indexOf('#') !== -1 && query.indexOf('.') !== -1) { // complex query
            method = 'querySelector';
            if (shouldGetAll) {
                method = 'querySelectorAll';
            }
        } else if (query.indexOf('#') !== -1 && query.indexOf('.') === -1) { // Id only
            method = 'getElementById';
        } else if (query.indexOf('#') === -1 && query.indexOf('.') !== -1) { // class
            method = 'getElementsByClassName';
        }

        result = document[method](query);
        return result;
    }

    remove(element) {

    }

    createMethod = (methodName) => {
        return (options, html) => {
            return new ElementFactory(methodName, options, html);
        }
    }

    on(query, action, cb) {
        // if () {

        // }
    }
}

class ElementFactory {
    constructor(type, options, html) {
        this.type = type;
        this.options = options;
        this.html = html;

        return this.build();
    }

    build() {
        const element = document.createElement(this.type);

        for (const attribute of Object.keys(this.options)) {
            if (attribute !== 'class') {
                if (typeof this.options[attribute] === 'object') {
                    for (const key of Object.keys(this.options[attribute])) {
                        element[attribute][key] = this.options[attribute][key];
                    }
                }
                if (typeof this.options[attribute] === 'string' || typeof this.options[attribute] === 'number') {
                    element[attribute] = this.options[attribute];
                }
            }
        }

        if (this.options.class) {
            if (typeof this.options.class === 'string') {
                element.classList.add(this.options.class);
            } else if (Array.isArray(this.options.class)) {
                this.options.class.forEach(className => {
                    element.classList.add(className);
                })
            }
        }

        if (typeof this.html === 'string') {
            element.innerHTML = this.html;
        } else if (Array.isArray(this.html)) {
            element.append(...this.html);
        }

        return element;
    }
}


export default ElementsUtil.getInstance();