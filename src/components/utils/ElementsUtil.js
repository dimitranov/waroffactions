let instance = null;
class ElementsUtil {
    static getInstance() {
        if (instance) {
            return instance;
        }
        instance = new ElementsUtil();
        window.ElementsUtil = instance
        return instance;
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

    createElement(type, options) {
        return new ElementFactory(type, options);
    }

    on(query, action, cb) {
        // if () {

        // }
    }
}

class ElementFactory {
    constructor(type, options) {
        this.type = type;
        this.options = options;

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
    
        return element;
    }
}


export default ElementsUtil.getInstance();