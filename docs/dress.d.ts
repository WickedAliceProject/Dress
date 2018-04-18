declare class Dress {
    static toLower(c: string): string;
    selector: string;
    private style;
    private rules;
    private element;
    constructor(selector: string);
    set(name: keyof CSSStyleDeclaration | {
        [key in keyof CSSStyleDeclaration]?: string;
    }, value?: string): this;
    unset(...names: (keyof CSSStyleDeclaration)[]): this;
    add(style: Dress | string): Dress;
    search(selector: string): Dress | null;
    remove(selector: string): this;
    update(selector: string, name: keyof CSSStyleDeclaration | {
        [key in keyof CSSStyleDeclaration]?: string;
    }, value?: string): Dress | null;
    clear(selector: string): this;
    toStoring(selector?: string): string;
    reflectStyleSheet(): HTMLStyleElement;
}
declare module "dress" {
    export = Dress;
}