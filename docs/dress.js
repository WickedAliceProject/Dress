class Dress {
    static toLower(c) { return '-' + String.fromCharCode(c.charCodeAt(0) | 32); }
    constructor(selector) {
        this.selector = selector || '';
        this.style = selector ? {} : null;
        this.rules = [];
    }
    set(name, value = '') {
        if (!this.style) {
            return this;
        }
        if (name === 'length' || name === 'parentRule') {
            return this;
        }
        if (typeof name === 'string') {
            this.style[name] = value;
        }
        else {
            const style = this.style;
            Object.keys(name).forEach((key) => {
                if (key === 'length' || key === 'parentRule') {
                    return;
                }
                style[key] = name[key] || '';
            });
        }
        return this;
    }
    setCustom(name, value = '') {
        if (!this.style) {
            return this;
        }
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
    generateDress(style, parent) {
        if (typeof style === 'string') {
            const selectors = style.split(' ');
            const selector = selectors.shift() || '';
            let _style = parent.search(selector);
            if (!_style) {
                _style = new Dress(selector);
                parent.rules.push(_style);
            }
            selectors.forEach((selector) => {
                _style = _style.add(selector);
            });
            _style.parent = parent;
            return _style;
        }
        style.parent = parent;
        for (let i = 0; i < parent.rules.length; ++i) {
            if (parent.rules[i].selector === style.selector) {
                parent.rules[i] = style;
                return style;
            }
        }
        parent.rules.push(style);
        return style;
    }
    add(style) {
        return this.generateDress(style, this);
    }
    lineUp(style) {
        return this.generateDress(style, this.parent || this);
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
        const _style = this.style || {};
        const style = Object.keys(_style).map((key) => {
            if (typeof key !== 'string') {
                return '';
            }
            if (key === 'cssFloat') {
                return 'float:' + _style[key];
            }
            if (key === 'content') {
                return 'content:' + (_style[key].charAt(0) === '"' ? _style[key] : '"' + _style[key] + '"');
            }
            return key.replace(/[A-Z]/g, Dress.toLower) + ':' + _style[key];
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
            if (rootElement.children[0]) {
                rootElement.insertBefore(this.element, rootElement.children[0]);
            }
            else {
                rootElement.appendChild(this.element);
            }
        }
        this.element.textContent = this.toStoring();
        return this.element;
    }
}
define("dress", ["require", "exports"], function (require, exports) {
    "use strict";
    return Dress;
});
