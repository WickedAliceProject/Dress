
/*export class _StyleSheet
{
	private element: HTMLStyleElement;
	private sheet: StyleSheet;
	constructor()
	{
		this.element = document.createElement('style');
		this.element.appendChild( document.createTextNode('') );
		document.head.appendChild( this.element );
		this.sheet = <StyleSheet>this.element.sheet;
	}
}*/

class Dress
{
	public static toLower( c: string ) { return '-' + String.fromCharCode( c.charCodeAt( 0 ) | 32 ); }

	private parent: Dress;
	public selector: string;
	private style: { [ key in keyof CSSStyleDeclaration ]?: string } | null;
	private rules: Dress[];
	private element: HTMLStyleElement;

	constructor( selector?: string )
	{
		this.selector = selector || '';
		this.style = selector ? {} : null;
		this.rules = [];
	}

	// CSSStyleDeclaration
	public set( name: keyof CSSStyleDeclaration | { [ key in keyof CSSStyleDeclaration ]?: string }, value: string = '' )
	{
		if ( !this.style ) { return this; }
		if ( name === 'length' || name === 'parentRule' ) { return this; }
		if ( typeof name === 'string' )
		{
			this.style[ name ] = value;
		} else
		{
			const style = this.style;
			Object.keys( name ).forEach( ( key/*: keyof CSSStyleDeclaration*/ ) =>
			{
				if ( key === 'length' || key === 'parentRule' ) { return; }
				(<any>style)[ key ] = (<any>name)[ key ] || '';
			} );
		}
		return this;
	}

	/** Set CSS Custom propaties.
	*/
	public setCustom( name: string | { [ key: string ]: string }, value: string = '' )
	{
		if ( !this.style ) { return this; }
		if ( typeof name === 'string' )
		{
			if ( name.indexOf( '--' ) !== 0 ) { return this; }
			(<any>this.style)[ name ] = value;
		} else
		{
			Object.keys( name ).forEach( ( key ) =>
			{
				if ( key.indexOf( '--' ) !== 0 ) { return; }
				(<any>this.style)[ key ] = name[ key ] || '';
			} );
		}
		return this;
	}

	public unset( ...names: (keyof CSSStyleDeclaration|string)[] )
	{
		names.forEach( ( name ) => { delete (<any>this.style)[ name ]; } );
		return this;
	}

	private generateDress( style: Dress | string, parent: Dress )
	{
		if ( typeof style === 'string' )
		{
			const selectors = style.split( ' ' );
			const selector = selectors.shift() || '';
			let _style = <Dress>parent.search( selector );
			if ( !_style )
			{
				_style = new Dress( selector );
				parent.rules.push( _style );
			}
			selectors.forEach( ( selector ) =>
			{
				_style = _style.add( selector );
			} );
			_style.parent = parent;

			return _style;
		}

		style.parent = parent;

		for ( let i = 0 ; i < parent.rules.length ; ++i )
		{
			if ( parent.rules[ i ].selector === style.selector )
			{
				parent.rules[ i ] = style;
				// TODO: mearge inSelector
				return style;
			}
		}

		parent.rules.push( style );
		return style;
	}

	// CSSRule
	public add( style: Dress | string )
	{
		return this.generateDress( style, this );
	}

	public lineUp( style: Dress | string )
	{
		return this.generateDress( style, this.parent || this );
	}

	public search( selector: string )
	{
		for ( let i = 0 ; i < this.rules.length ; ++i )
		{
			if ( this.rules[ i ].selector === selector )
			{
				return this.rules[ i ];
			}
		}
		return null;
	}

	public remove( selector: string )
	{
		for ( let i = 0 ; i < this.rules.length ; ++i )
		{
			if ( this.rules[ i ].selector === selector )
			{
				this.rules.splice( i, 1 );
				// TODO: check this.inSelector[ i ].inSelector
			}
		}
		return this;
	}

	public update( selector: string, name: keyof CSSStyleDeclaration | { [ key in keyof CSSStyleDeclaration ]?: string }, value: string = '' )
	{
		const rule = this.search( selector );
		if ( !rule ) { return null; }
		rule.set( name, value );
		return rule;
	}

	public clear( selector: string )
	{
		const rule = this.search( selector );
		if ( !rule ) { return this; }
		rule.style = {};
		return this;
	}

	public toStoring( selector: string = '' ): string
	{
		if ( selector )
		{
			if ( this.selector[ 0 ] === '&' )
			{
				selector += this.selector.substring( 1 );
			} else
			{
				selector += ' ' + this.selector;
			}
		} else { selector = this.selector; }

		const _style = this.style || {};
		const style = Object.keys( _style ).map( ( key/*: keyof CSSStyleDeclaration*/ ) =>
		{
			if ( typeof key !== 'string' ) { return ''; }
			if ( key === 'cssFloat' ) { return 'float:' + _style[ key ]; }
			if ( key === 'content' ) { return 'content:' + ( (<string>_style[ key ]).charAt( 0 ) === '"' ? _style[ key ] : '"' + _style[ key ] + '"' ); }
			return key.replace( /[A-Z]/g, Dress.toLower ) + ':' + (<any>_style)[ key ];
		} ).join( ';' );
		return ( this.selector && style ? ( selector + '{' + style + '}' ) : '' ) + this.rules.map( ( rule ) => { return rule.toStoring( selector ); } ).join( '' );
	}

	// <style>
	public reflectStyleSheet( rootElement?: HTMLElement | ShadowRoot | DocumentFragment, force?: boolean )
	{
		if ( !this.element || force )
		{
			this.element = document.createElement( 'style' );
			this.element.appendChild( document.createTextNode( '' ) );
			if ( !rootElement ) { rootElement = document.head; }
			if ( rootElement.children[ 0 ] )
			{
				rootElement.insertBefore( this.element, rootElement.children[ 0 ] );
			} else
			{
				rootElement.appendChild( this.element );
			}
		}
		this.element.textContent = this.toStoring();
		return this.element;
	}
}
