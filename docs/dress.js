class Dress {
    static toLower(c) { return '-' + String.fromCharCode(c.charCodeAt(0) | 32); }
    constructor(selector) {
        this.selector = selector;
        this.style = {};
        this.rules = [];
    }
    set(name, value = '') {
        if (name === 'length' || name === 'parentRule') {
            return this;
        }
        if (typeof name === 'string') {
            this.style[name] = value;
        }
        else {
            Object.keys(name).forEach((key) => {
                if (key === 'length' || key === 'parentRule') {
                    return;
                }
                this.style[key] = name[key] || '';
            });
        }
        return this;
    }
    setCustom(name, value = '') {
        if (typeof name === 'string') {
            if (name.indexOf('--') !== 0) {
                return this;
            }
            this.style[name] = value;
        }
        else {
            Object.keys(name).forEach((key) => {
                if (key.indexOf('--') !== 0) {
                    return;
                }
                this.style[key] = name[key] || '';
            });
        }
        return this;
    }
    unset(...names) {
        names.forEach((name) => { delete this.style[name]; });
        return this;
    }
    add(style) {
        if (typeof style === 'string') {
            const selectors = style.split(' ');
            const selector = selectors.shift() || '';
            let _style = this.search(selector);
            if (!_style) {
                _style = new Dress(selector);
                this.rules.push(_style);
            }
            selectors.forEach((selector) => {
                _style = _style.add(selector);
            });
            return _style;
        }
        for (let i = 0; i < this.rules.length; ++i) {
            if (this.rules[i].selector === style.selector) {
                this.rules[i] = style;
                return style;
            }
        }
        this.rules.push(style);
        return style;
    }
    search(selector) {
        for (let i = 0; i < this.rules.length; ++i) {
            if (this.rules[i].selector === selector) {
                return this.rules[i];
            }
        }
        return null;
    }
    remove(selector) {
        for (let i = 0; i < this.rules.length; ++i) {
            if (this.rules[i].selector === selector) {
                this.rules.splice(i, 1);
            }
        }
        return this;
    }
    update(selector, name, value = '') {
        const rule = this.search(selector);
        if (!rule) {
            return null;
        }
        rule.set(name, value);
        return rule;
    }
    clear(selector) {
        const rule = this.search(selector);
        if (!rule) {
            return this;
        }
        rule.style = {};
        return this;
    }
    toStoring(selector = '') {
        if (selector) {
            if (this.selector[0] === '&') {
                selector += this.selector.substring(1);
            }
            else {
                selector += ' ' + this.selector;
            }
        }
        else {
            selector = this.selector;
        }
        const style = Object.keys(this.style).map((key) => {
            return key.replace(/[A-Z]/g, Dress.toLower) + ':' + this.style[key];
        }).join(';');
        return (this.selector && style ? (selector + '{' + style + '}') : '') + this.rules.map((rule) => { return rule.toStoring(selector); }).join('');
    }
    reflectStyleSheet(rootElement, force) {
        if (!this.element || force) {
            this.element = document.createElement('style');
            this.element.appendChild(document.createTextNode(''));
            if (!rootElement) {
                rootElement = document.head;
            }
            rootElement.appendChild(this.element);
        }
        this.element.textContent = this.toStoring();
        return this.element;
    }
}
define("dress", ["require", "exports"], function (require, exports) {
    "use strict";
    return Dress;
});
